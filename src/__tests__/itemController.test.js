const itemController = require('../controllers/itemController');

// Mock the items data module
jest.mock('../data/items', () => [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
]);

describe('ItemController', () => {
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

    // Test: Should handle string ID parameter correctly
    it('should handle string ID parameter correctly', () => {
      req.params.id = '2';
      
      itemController.getById(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ id: 2, name: 'Item 2' });
    });

    // Test: Should handle invalid ID format
    it('should handle invalid ID format', () => {
      req.params.id = 'invalid';
      
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
      req.body.name = 'Another Item';
      const items = require('../data/items');
      const initialLength = items.length;
      
      itemController.createItem(req, res);
      
      expect(items.length).toBe(initialLength + 1);
      expect(items[items.length - 1]).toEqual({
        id: 3,
        name: 'Another Item'
      });
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

    // Test: Should generate correct ID based on current items length
    it('should generate correct ID based on current items length', () => {
      const items = require('../data/items');
      items.push({ id: 3, name: 'Extra Item' });
      req.body.name = 'Test Item';
      
      itemController.createItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 4,
        name: 'Test Item'
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

    // Test: Should handle partial updates
    it('should handle partial updates', () => {
      req.params.id = '2';
      req.body.name = 'Partially Updated';
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 2,
        name: 'Partially Updated'
      });
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

    // Test: Should remove item from items array
    it('should remove item from items array', () => {
      req.params.id = '1';
      const items = require('../data/items');
      const initialLength = items.length;
      
      itemController.deleteItem(req, res);
      
      expect(items.length).toBe(initialLength - 1);
      expect(items.find(item => item.id === 1)).toBeUndefined();
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

    // Test: Should handle deletion of last item
    it('should handle deletion of last item', () => {
      const items = require('../data/items');
      items.length = 0;
      items.push({ id: 1, name: 'Last Item' });
      req.params.id = '1';
      
      itemController.deleteItem(req, res);
      
      expect(items.length).toBe(0);
      expect(res.json).toHaveBeenCalledWith({ message: "Item deleted" });
    });
  });
});