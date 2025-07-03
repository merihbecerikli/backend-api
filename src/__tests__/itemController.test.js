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
      status: jest.fn(() => mockRes)
    };
    
    // Reset items array to initial state
    const items = require('../data/items');
    items.splice(0, items.length);
    items.push(
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    );
  });

  describe('getAll', () => {
    // Test successful retrieval of all items
    it('should return all items', () => {
      itemController.getAll(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]);
    });

    // Test when items array is empty
    it('should return empty array when no items exist', () => {
      const items = require('../data/items');
      items.splice(0, items.length);
      
      itemController.getAll(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getById', () => {
    // Test successful retrieval of existing item
    it('should return item when valid id is provided', () => {
      mockReq.params.id = '1';
      
      itemController.getById(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ id: 1, name: 'Item 1' });
    });

    // Test when item is not found
    it('should return 404 when item is not found', () => {
      mockReq.params.id = '999';
      
      itemController.getById(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test with string id that converts to valid integer
    it('should handle string id parameters correctly', () => {
      mockReq.params.id = '2';
      
      itemController.getById(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ id: 2, name: 'Item 2' });
    });

    // Test with invalid id that doesn't convert to integer
    it('should return 404 for invalid id format', () => {
      mockReq.params.id = 'invalid';
      
      itemController.getById(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('createItem', () => {
    // Test successful item creation
    it('should create new item and return it with 201 status', () => {
      mockReq.body.name = 'New Item';
      
      itemController.createItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 3,
        name: 'New Item'
      });
    });

    // Test creation with empty name
    it('should create item even with empty name', () => {
      mockReq.body.name = '';
      
      itemController.createItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 3,
        name: ''
      });
    });

    // Test creation without name in body
    it('should create item with undefined name when name is not provided', () => {
      mockReq.body = {};
      
      itemController.createItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 3,
        name: undefined
      });
    });

    // Test ID generation with existing items
    it('should generate correct ID based on current items length', () => {
      const items = require('../data/items');
      items.push({ id: 3, name: 'Item 3' });
      mockReq.body.name = 'Item 4';
      
      itemController.createItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 4,
        name: 'Item 4'
      });
    });
  });

  describe('updateItem', () => {
    // Test successful item update
    it('should update existing item and return it', () => {
      mockReq.params.id = '1';
      mockReq.body.name = 'Updated Item';
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Item'
      });
    });

    // Test update with non-existent item
    it('should return 404 when trying to update non-existent item', () => {
      mockReq.params.id = '999';
      mockReq.body.name = 'Updated Item';
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test update without providing name (should keep existing name)
    it('should keep existing name when no name is provided in body', () => {
      mockReq.params.id = '1';
      mockReq.body = {};
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Item 1'
      });
    });

    // Test update with empty string name
    it('should update name to empty string when empty string is provided', () => {
      mockReq.params.id = '1';
      mockReq.body.name = '';
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: ''
      });
    });

    // Test update with invalid ID format
    it('should return 404 for invalid id format', () => {
      mockReq.params.id = 'invalid';
      mockReq.body.name = 'Updated Item';
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('deleteItem', () => {
    // Test successful item deletion
    it('should delete existing item and return success message', () => {
      mockReq.params.id = '1';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item deleted" });
      
      // Verify item was actually removed
      const items = require('../data/items');
      expect(items.find(i => i.id === 1)).toBeUndefined();
    });

    // Test deletion of non-existent item
    it('should return 404 when trying to delete non-existent item', () => {
      mockReq.params.id = '999';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test deletion with invalid ID format
    it('should return 404 for invalid id format', () => {
      mockReq.params.id = 'invalid';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test deletion of last item
    it('should handle deletion when only one item exists', () => {
      const items = require('../data/items');
      items.splice(0, items.length);
      items.push({ id: 1, name: 'Only Item' });
      
      mockReq.params.id = '1';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item deleted" });
      expect(items.length).toBe(0);
    });

    // Test deletion from middle of array
    it('should correctly remove item from middle of array', () => {
      const items = require('../data/items');
      items.push({ id: 3, name: 'Item 3' });
      
      mockReq.params.id = '2';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item deleted" });
      expect(items.length).toBe(2);
      expect(items.find(i => i.id === 2)).toBeUndefined();
      expect(items.find(i => i.id === 1)).toBeDefined();
      expect(items.find(i => i.id === 3)).toBeDefined();
    });
  });
});