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
    items.length = 0;
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
      items.length = 0;
      
      itemController.getAll(req, res);
      
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getById', () => {
    // Test: Should return item when valid id is provided
    it('should return item when valid id is provided', () => {
      req.params.id = '1';
      
      itemController.getById(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Item 1' });
    });

    // Test: Should return 404 when item not found
    it('should return 404 when item not found', () => {
      req.params.id = '999';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should handle string id that converts to valid number
    it('should handle string id that converts to valid number', () => {
      req.params.id = '2';
      
      itemController.getById(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ id: 2, name: 'Item 2' });
    });

    // Test: Should return 404 for invalid id format
    it('should return 404 for invalid id format', () => {
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

    // Test: Should create item with undefined name
    it('should create item with undefined name', () => {
      req.body = {};
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: undefined
      });
    });

    // Test: Should increment id correctly when items exist
    it('should increment id correctly when items exist', () => {
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

    // Test: Should keep existing name when no new name provided
    it('should keep existing name when no new name provided', () => {
      req.params.id = '1';
      req.body = {};
      
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

    // Test: Should handle invalid id format
    it('should return 404 for invalid id format', () => {
      req.params.id = 'abc';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('deleteItem', () => {
    // Test: Should delete existing item
    it('should delete existing item', () => {
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

    // Test: Should handle invalid id format
    it('should return 404 for invalid id format', () => {
      req.params.id = 'abc';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should remove item from array
    it('should remove item from array', () => {
      const items = require('../data/items');
      req.params.id = '1';
      
      itemController.deleteItem(req, res);
      
      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({ id: 2, name: 'Item 2' });
    });
  });
});