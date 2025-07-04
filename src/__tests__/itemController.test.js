// Unit tests for itemController.js - Tests all CRUD operations for item management
const itemController = require('../controllers/itemController');

// Mock the items data module
jest.mock('../data/items', () => {
  return [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];
});

describe('itemController', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks before each test
    req = {
      params: {},
      body: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    
    // Reset items array to initial state
    const items = require('../data/items');
    items.splice(0, items.length);
    items.push({ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' });
  });

  describe('getAll', () => {
    // Test successful retrieval of all items
    it('should return all items', () => {
      itemController.getAll(req, res);
      
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]);
    });

    // Test when items array is empty
    it('should return empty array when no items exist', () => {
      const items = require('../data/items');
      items.splice(0, items.length);
      
      itemController.getAll(req, res);
      
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getById', () => {
    // Test successful retrieval of item by valid ID
    it('should return item when valid ID is provided', () => {
      req.params.id = '1';
      
      itemController.getById(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Item 1' });
    });

    // Test 404 response when item is not found
    it('should return 404 when item is not found', () => {
      req.params.id = '999';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test handling of non-numeric ID
    it('should return 404 when ID is not numeric', () => {
      req.params.id = 'abc';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test handling of zero ID
    it('should return 404 when ID is zero', () => {
      req.params.id = '0';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('createItem', () => {
    // Test successful creation of new item
    it('should create new item with valid data', () => {
      req.body.name = 'New Item';
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: 'New Item'
      });
    });

    // Test creation with empty name
    it('should create item with empty name', () => {
      req.body.name = '';
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: ''
      });
    });

    // Test creation without name field
    it('should create item when name is not provided', () => {
      req.body = {};
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: undefined
      });
    });

    // Test ID generation with empty items array
    it('should generate ID 1 when items array is empty', () => {
      const items = require('../data/items');
      items.splice(0, items.length);
      req.body.name = 'First Item';
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'First Item'
      });
    });
  });

  describe('updateItem', () => {
    // Test successful update of existing item
    it('should update existing item with new name', () => {
      req.params.id = '1';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Item'
      });
    });

    // Test update when item is not found
    it('should return 404 when item to update is not found', () => {
      req.params.id = '999';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test update with empty name
    it('should update item with empty name', () => {
      req.params.id = '1';
      req.body.name = '';
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: ''
      });
    });

    // Test update without name field (should preserve existing name)
    it('should preserve existing name when no name provided', () => {
      req.params.id = '1';
      req.body = {};
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Item 1'
      });
    });

    // Test update with non-numeric ID
    it('should return 404 when ID is not numeric', () => {
      req.params.id = 'abc';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('deleteItem', () => {
    // Test successful deletion of existing item
    it('should delete existing item', () => {
      req.params.id = '1';
      
      itemController.deleteItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ message: "Item deleted" });
      
      // Verify item is actually removed from array
      const items = require('../data/items');
      expect(items.find(i => i.id === 1)).toBeUndefined();
    });

    // Test deletion when item is not found
    it('should return 404 when item to delete is not found', () => {
      req.params.id = '999';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test deletion with non-numeric ID
    it('should return 404 when ID is not numeric', () => {
      req.params.id = 'abc';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test deletion of last item in array
    it('should delete the last item successfully', () => {
      req.params.id = '2';
      
      itemController.deleteItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ message: "Item deleted" });
      
      // Verify correct item was removed
      const items = require('../data/items');
      expect(items.length).toBe(1);
      expect(items[0].id).toBe(1);
    });

    // Test deletion when array becomes empty
    it('should handle deletion when only one item exists', () => {
      const items = require('../data/items');
      items.splice(0, items.length);
      items.push({ id: 1, name: 'Only Item' });
      
      req.params.id = '1';
      
      itemController.deleteItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ message: "Item deleted" });
      expect(items.length).toBe(0);
    });
  });
});