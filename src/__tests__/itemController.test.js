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
    it('should return 404 for non-numeric ID', () => {
      mockReq.params.id = 'abc';
      
      itemController.getById(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should handle string numeric ID
    it('should return item for string numeric ID', () => {
      mockReq.params.id = '2';
      
      itemController.getById(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ id: 2, name: 'Item 2' });
    });
  });

  describe('createItem', () => {
    // Test: Should create new item with valid data
    it('should create new item with valid data', () => {
      mockReq.body.name = 'New Item';
      
      itemController.createItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 3,
        name: 'New Item'
      });
    });

    // Test: Should create item with undefined name
    it('should create item with undefined name', () => {
      mockReq.body = {};
      
      itemController.createItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 3,
        name: undefined
      });
    });

    // Test: Should increment ID correctly when items array is empty
    it('should create item with ID 1 when items array is empty', () => {
      const items = require('../data/items');
      items.length = 0;
      mockReq.body.name = 'First Item';
      
      itemController.createItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'First Item'
      });
    });
  });

  describe('updateItem', () => {
    // Test: Should update existing item
    it('should update existing item', () => {
      mockReq.params.id = '1';
      mockReq.body.name = 'Updated Item';
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Item'
      });
    });

    // Test: Should return 404 when item not found
    it('should return 404 when item not found', () => {
      mockReq.params.id = '999';
      mockReq.body.name = 'Updated Item';
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should keep existing name when no name provided
    it('should keep existing name when no name provided', () => {
      mockReq.params.id = '1';
      mockReq.body = {};
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Item 1'
      });
    });

    // Test: Should handle non-numeric ID
    it('should return 404 for non-numeric ID', () => {
      mockReq.params.id = 'abc';
      mockReq.body.name = 'Updated Item';
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('deleteItem', () => {
    // Test: Should delete existing item
    it('should delete existing item', () => {
      mockReq.params.id = '1';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item deleted" });
    });

    // Test: Should return 404 when item not found
    it('should return 404 when item not found', () => {
      mockReq.params.id = '999';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should handle non-numeric ID
    it('should return 404 for non-numeric ID', () => {
      mockReq.params.id = 'abc';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should delete last item correctly
    it('should delete last item correctly', () => {
      mockReq.params.id = '2';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item deleted" });
    });
  });
});