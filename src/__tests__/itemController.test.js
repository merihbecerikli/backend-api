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
    items.push({ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' });
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
    // Test: Should return item when found
    it('should return item when found', () => {
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

    // Test: Should handle invalid ID format
    it('should handle invalid ID format', () => {
      req.params.id = 'invalid';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should handle zero ID
    it('should handle zero ID', () => {
      req.params.id = '0';
      
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
      expect(res.json).toHaveBeenCalledWith({ id: 3, name: 'New Item' });
    });

    // Test: Should create item with empty name
    it('should create item with empty name', () => {
      req.body.name = '';
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 3, name: '' });
    });

    // Test: Should create item when name is undefined
    it('should create item when name is undefined', () => {
      req.body = {};
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 3, name: undefined });
    });

    // Test: Should increment ID correctly for multiple items
    it('should increment ID correctly for multiple items', () => {
      req.body.name = 'Item 3';
      itemController.createItem(req, res);
      
      req.body.name = 'Item 4';
      itemController.createItem(req, res);
      
      expect(res.json).toHaveBeenLastCalledWith({ id: 4, name: 'Item 4' });
    });
  });

  describe('updateItem', () => {
    // Test: Should update existing item
    it('should update existing item', () => {
      req.params.id = '1';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Updated Item' });
    });

    // Test: Should return 404 when item not found
    it('should return 404 when item not found', () => {
      req.params.id = '999';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should keep original name when no name provided
    it('should keep original name when no name provided', () => {
      req.params.id = '1';
      req.body = {};
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Item 1' });
    });

    // Test: Should handle empty string name
    it('should handle empty string name', () => {
      req.params.id = '1';
      req.body.name = '';
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: '' });
    });

    // Test: Should handle invalid ID format
    it('should handle invalid ID format', () => {
      req.params.id = 'invalid';
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

    // Test: Should handle invalid ID format
    it('should handle invalid ID format', () => {
      req.params.id = 'invalid';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should handle zero ID
    it('should handle zero ID', () => {
      req.params.id = '0';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should remove item from array
    it('should remove item from array', () => {
      const items = require('../data/items');
      const initialLength = items.length;
      req.params.id = '1';
      
      itemController.deleteItem(req, res);
      
      expect(items.length).toBe(initialLength - 1);
      expect(items.find(item => item.id === 1)).toBeUndefined();
    });
  });
});