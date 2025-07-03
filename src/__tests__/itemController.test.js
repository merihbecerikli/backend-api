const itemController = require('../controllers/itemController');

// Mock the items data module
jest.mock('../data/items', () => [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
]);

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
    items.length = 0;
    items.push(
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    );
  });

  describe('getAll', () => {
    // Test: Should return all items successfully
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
      items.length = 0;
      
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

    // Test: Should handle non-numeric ID gracefully
    it('should handle non-numeric ID gracefully', () => {
      req.params.id = 'abc';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should handle undefined ID parameter
    it('should handle undefined ID parameter', () => {
      req.params.id = undefined;
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('createItem', () => {
    // Test: Should create new item successfully
    it('should create new item successfully', () => {
      req.body.name = 'New Item';
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: 'New Item'
      });
    });

    // Test: Should handle empty name
    it('should create item with undefined name', () => {
      req.body = {};
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: undefined
      });
    });

    // Test: Should increment ID correctly when items array is empty
    it('should create item with ID 1 when items array is empty', () => {
      const items = require('../data/items');
      items.length = 0;
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
    // Test: Should update existing item successfully
    it('should update existing item successfully', () => {
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

    // Test: Should keep existing name when no name provided
    it('should keep existing name when no name provided', () => {
      req.params.id = '1';
      req.body = {};
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Item 1'
      });
    });

    // Test: Should handle non-numeric ID
    it('should handle non-numeric ID', () => {
      req.params.id = 'abc';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('deleteItem', () => {
    // Test: Should delete existing item successfully
    it('should delete existing item successfully', () => {
      req.params.id = '1';
      
      itemController.deleteItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ message: "Item deleted" });
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

    // Test: Should actually remove item from array
    it('should actually remove item from array', () => {
      const items = require('../data/items');
      const initialLength = items.length;
      req.params.id = '1';
      
      itemController.deleteItem(req, res);
      
      expect(items.length).toBe(initialLength - 1);
      expect(items.find(item => item.id === 1)).toBeUndefined();
    });
  });
});