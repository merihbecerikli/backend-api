// Unit tests for itemController.js
// Tests all CRUD operations: getAll, getById, createItem, updateItem, deleteItem
// Covers edge cases, error scenarios, and proper response handling

const request = require('supertest');

// Mock the items data module
jest.mock('../data/items', () => {
  return [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];
});

const itemController = require('../controllers/itemController');

describe('itemController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Reset mocks before each test
    mockReq = {
      params: {},
      body: {}
    };
    mockRes = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
    
    // Reset the items array for each test
    jest.resetModules();
    require('../data/items').length = 0;
    require('../data/items').push(
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    );
  });

  describe('getAll', () => {
    // Test successful retrieval of all items
    it('should return all items', () => {
      itemController.getAll(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ]);
    });

    // Test empty items array
    it('should return empty array when no items exist', () => {
      require('../data/items').length = 0;
      
      itemController.getAll(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getById', () => {
    // Test successful retrieval of existing item
    it('should return item when valid ID is provided', () => {
      mockReq.params.id = '2';
      
      itemController.getById(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ id: 2, name: 'Item 2' });
    });

    // Test item not found scenario
    it('should return 404 when item does not exist', () => {
      mockReq.params.id = '999';
      
      itemController.getById(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test invalid ID format
    it('should return 404 when ID is not a number', () => {
      mockReq.params.id = 'invalid';
      
      itemController.getById(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test ID as string number
    it('should handle string ID correctly', () => {
      mockReq.params.id = '1';
      
      itemController.getById(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ id: 1, name: 'Item 1' });
    });
  });

  describe('createItem', () => {
    // Test successful item creation
    it('should create new item with valid data', () => {
      mockReq.body.name = 'New Item';
      
      itemController.createItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 4,
        name: 'New Item'
      });
    });

    // Test item creation without name
    it('should create item even without name', () => {
      mockReq.body = {};
      
      itemController.createItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 4,
        name: undefined
      });
    });

    // Test item creation with empty name
    it('should create item with empty name', () => {
      mockReq.body.name = '';
      
      itemController.createItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 4,
        name: ''
      });
    });

    // Test ID generation logic
    it('should generate correct ID based on array length', () => {
      // Add more items to test ID generation
      require('../data/items').push({ id: 4, name: 'Item 4' });
      mockReq.body.name = 'Item 5';
      
      itemController.createItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 5,
        name: 'Item 5'
      });
    });
  });

  describe('updateItem', () => {
    // Test successful item update
    it('should update existing item', () => {
      mockReq.params.id = '2';
      mockReq.body.name = 'Updated Item';
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 2,
        name: 'Updated Item'
      });
    });

    // Test update non-existent item
    it('should return 404 when updating non-existent item', () => {
      mockReq.params.id = '999';
      mockReq.body.name = 'Updated Item';
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test partial update (no name provided)
    it('should keep existing name when no name is provided', () => {
      mockReq.params.id = '1';
      mockReq.body = {};
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Item 1'
      });
    });

    // Test update with empty name
    it('should update with empty name when provided', () => {
      mockReq.params.id = '1';
      mockReq.body.name = '';
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: ''
      });
    });

    // Test update with invalid ID
    it('should return 404 when ID is invalid', () => {
      mockReq.params.id = 'invalid';
      mockReq.body.name = 'Updated Item';
      
      itemController.updateItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('deleteItem', () => {
    // Test successful item deletion
    it('should delete existing item', () => {
      mockReq.params.id = '2';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item deleted" });
    });

    // Test delete non-existent item
    it('should return 404 when deleting non-existent item', () => {
      mockReq.params.id = '999';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test delete with invalid ID
    it('should return 404 when ID is invalid', () => {
      mockReq.params.id = 'invalid';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test delete first item
    it('should delete first item correctly', () => {
      mockReq.params.id = '1';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item deleted" });
    });

    // Test delete last item
    it('should delete last item correctly', () => {
      mockReq.params.id = '3';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item deleted" });
    });

    // Test delete with zero ID
    it('should return 404 when ID is 0', () => {
      mockReq.params.id = '0';
      
      itemController.deleteItem(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('Edge Cases', () => {
    // Test all functions with undefined request objects
    it('should handle undefined params gracefully', () => {
      mockReq.params = undefined;
      
      expect(() => itemController.getById(mockReq, mockRes)).not.toThrow();
      expect(() => itemController.updateItem(mockReq, mockRes)).not.toThrow();
      expect(() => itemController.deleteItem(mockReq, mockRes)).not.toThrow();
    });

    // Test with undefined body
    it('should handle undefined body gracefully', () => {
      mockReq.body = undefined;
      
      expect(() => itemController.createItem(mockReq, mockRes)).not.toThrow();
      expect(() => itemController.updateItem(mockReq, mockRes)).not.toThrow();
    });
  });
});