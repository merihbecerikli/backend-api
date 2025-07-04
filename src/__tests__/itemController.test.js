const itemController = require('../controllers/itemController');

// Mock the items data module
jest.mock('../data/items', () => [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
]);

describe('itemController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };
    
    // Reset items array before each test
    const items = require('../data/items');
    items.splice(0, items.length);
    items.push(
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    );
  });

  describe('getAll', () => {
    // Test: Should return all items
    it('should return all items', () => {
      itemController.getAll(req, res);
      
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]);
    });

    // Test: Should return empty array when no items exist
    it('should return empty array when no items exist', () => {
      const items = require('../data/items');
      items.splice(0, items.length);
      
      itemController.getAll(req, res);
      
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getById', () => {
    // Test: Should return item when valid ID is provided
    it('should return item when valid ID is provided', () => {
      req.params.id = '1';
      
      itemController.getById(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Item 1' });
    });

    // Test: Should return 404 when item is not found
    it('should return 404 when item is not found', () => {
      req.params.id = '999';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should handle string ID that converts to valid integer
    it('should handle string ID that converts to valid integer', () => {
      req.params.id = '2';
      
      itemController.getById(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ id: 2, name: 'Item 2' });
    });

    // Test: Should return 404 for non-numeric ID
    it('should return 404 for non-numeric ID', () => {
      req.params.id = 'abc';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('createItem', () => {
    // Test: Should create new item with valid data
    it('should create new item with valid data', () => {
      req.body.name = 'New Item';
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: 'New Item'
      });
    });

    // Test: Should add item to items array
    it('should add item to items array', () => {
      const items = require('../data/items');
      req.body.name = 'Test Item';
      
      itemController.createItem(req, res);
      
      expect(items).toHaveLength(3);
      expect(items[2]).toEqual({ id: 3, name: 'Test Item' });
    });

    // Test: Should handle missing name in request body
    it('should handle missing name in request body', () => {
      req.body = {};
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: undefined
      });
    });

    // Test: Should generate incremental ID based on array length
    it('should generate incremental ID based on array length', () => {
      const items = require('../data/items');
      items.push({ id: 3, name: 'Item 3' });
      req.body.name = 'Item 4';
      
      itemController.createItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 4,
        name: 'Item 4'
      });
    });
  });

  describe('updateItem', () => {
    // Test: Should update existing item
    it('should update existing item', () => {
      req.params.id = '1';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Item'
      });
    });

    // Test: Should return 404 when item not found
    it('should return 404 when item not found', () => {
      req.params.id = '999';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should preserve existing name when no name provided
    it('should preserve existing name when no name provided', () => {
      req.params.id = '1';
      req.body = {};
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Item 1'
      });
    });

    // Test: Should handle null name in request body
    it('should handle null name in request body', () => {
      req.params.id = '1';
      req.body.name = null;
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Item 1'
      });
    });

    // Test: Should handle empty string name
    it('should handle empty string name', () => {
      req.params.id = '1';
      req.body.name = '';
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Item 1'
      });
    });
  });

  describe('deleteItem', () => {
    // Test: Should delete existing item
    it('should delete existing item', () => {
      req.params.id = '1';
      
      itemController.deleteItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ message: "Item deleted" });
    });

    // Test: Should remove item from items array
    it('should remove item from items array', () => {
      const items = require('../data/items');
      req.params.id = '1';
      
      itemController.deleteItem(req, res);
      
      expect(items).toHaveLength(1);
      expect(items.find(i => i.id === 1)).toBeUndefined();
    });

    // Test: Should return 404 when item not found
    it('should return 404 when item not found', () => {
      req.params.id = '999';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should handle non-numeric ID
    it('should handle non-numeric ID', () => {
      req.params.id = 'abc';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should handle negative ID
    it('should handle negative ID', () => {
      req.params.id = '-1';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });
});