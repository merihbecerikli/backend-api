const itemController = require('../controllers/itemController');

// Mock the items data module
jest.mock('../data/items', () => [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
]);

describe('itemController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Reset mocks before each test
    mockReq = {
      params: {},
      body: {}
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    
    // Reset items array to initial state
    const items = require('../data/items');
    items.length = 0;
    items.push(
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    );
  });

  describe('getAll', () => {
    // Test: Should return all items
    it('should return all items', () => {
      itemController.getAll(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]);
    });

    // Test: Should return empty array when no items exist
    it('should return empty array when no items exist', () => {
      const items = require('../data/items');
      items.length = 0;
      
      itemController.getAll(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getById', () => {
    // Test: Should return item when valid ID is provided
    it('should return item when valid ID is provided', () => {
      mockReq.params.id = '1';
      
      itemController.getById(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ id: 1, name: 'Item 1' });
    });

    // Test: Should return 404 when item is not found
    it('should return 404 when item is not found', () => {
      mockReq.params.id = '999';
      
      itemController.getById(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should handle non-numeric ID
    it('should handle non-numeric ID', () => {
      mockReq.params.id = 'abc';
      
      itemController.getById(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should handle negative ID
    it('should handle negative ID', () => {
      mockReq.params.id = '-1';
      
      itemController.getById(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('createItem', () => {
    // Test: Should create new item successfully
    it('should create new item successfully', () => {
      mockReq.body.name = 'New Item';
      
      itemController.createItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 3,
        name: 'New Item'
      });
    });

    // Test: Should handle missing name in request body
    it('should handle missing name in request body', () => {
      mockReq.body = {};
      
      itemController.createItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 3,
        name: undefined
      });
    });

    // Test: Should increment ID based on current items length
    it('should increment ID based on current items length', () => {
      const items = require('../data/items');
      items.push({ id: 3, name: 'Item 3' });
      mockReq.body.name = 'New Item';
      
      itemController.createItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 4,
        name: 'New Item'
      });
    });
  });

  describe('updateItem', () => {
    // Test: Should update existing item successfully
    it('should update existing item successfully', () => {
      mockReq.params.id = '1';
      mockReq.body.name = 'Updated Item';
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Item'
      });
    });

    // Test: Should return 404 when item is not found
    it('should return 404 when item is not found', () => {
      mockReq.params.id = '999';
      mockReq.body.name = 'Updated Item';
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should preserve existing name when no name is provided
    it('should preserve existing name when no name is provided', () => {
      mockReq.params.id = '1';
      mockReq.body = {};
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Item 1'
      });
    });

    // Test: Should handle non-numeric ID
    it('should handle non-numeric ID', () => {
      mockReq.params.id = 'abc';
      mockReq.body.name = 'Updated Item';
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('deleteItem', () => {
    // Test: Should delete existing item successfully
    it('should delete existing item successfully', () => {
      mockReq.params.id = '1';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item deleted" });
    });

    // Test: Should return 404 when item is not found
    it('should return 404 when item is not found', () => {
      mockReq.params.id = '999';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should handle non-numeric ID
    it('should handle non-numeric ID', () => {
      mockReq.params.id = 'abc';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should handle negative ID
    it('should handle negative ID', () => {
      mockReq.params.id = '-1';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should actually remove item from items array
    it('should actually remove item from items array', () => {
      const items = require('../data/items');
      const initialLength = items.length;
      mockReq.params.id = '1';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(items.length).toBe(initialLength - 1);
      expect(items.find(item => item.id === 1)).toBeUndefined();
    });
  });
});