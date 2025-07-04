const itemController = require('../controllers/itemController');

// Mock the items data module
jest.mock('../data/items', () => {
  return [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];
});

describe('Item Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    
    // Reset items data before each test
    const items = require('../data/items');
    items.length = 0;
    items.push(
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    );
  });

  describe('getAll', () => {
    // Test: Returns all items successfully
    it('should return all items', () => {
      itemController.getAll(req, res);
      
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]);
    });

    // Test: Returns empty array when no items exist
    it('should return empty array when no items exist', () => {
      const items = require('../data/items');
      items.length = 0;
      
      itemController.getAll(req, res);
      
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getById', () => {
    // Test: Returns item when valid ID is provided
    it('should return item when valid ID is provided', () => {
      req.params.id = '1';
      
      itemController.getById(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Item 1' });
    });

    // Test: Returns 404 when item is not found
    it('should return 404 when item is not found', () => {
      req.params.id = '999';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
    });

    // Test: Handles string ID that converts to valid integer
    it('should handle string ID that converts to valid integer', () => {
      req.params.id = '2';
      
      itemController.getById(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ id: 2, name: 'Item 2' });
    });

    // Test: Returns 404 for invalid ID format
    it('should return 404 for invalid ID format', () => {
      req.params.id = 'invalid';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
    });
  });

  describe('createItem', () => {
    // Test: Creates new item successfully
    it('should create new item successfully', () => {
      req.body.name = 'New Item';
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: 'New Item'
      });
    });

    // Test: Creates item with undefined name
    it('should create item with undefined name', () => {
      req.body = {};
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: undefined
      });
    });

    // Test: Increments ID based on current items length
    it('should increment ID based on current items length', () => {
      const items = require('../data/items');
      items.push({ id: 3, name: 'Item 3' });
      req.body.name = 'Fourth Item';
      
      itemController.createItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 4,
        name: 'Fourth Item'
      });
    });
  });

  describe('updateItem', () => {
    // Test: Updates existing item successfully
    it('should update existing item successfully', () => {
      req.params.id = '1';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Item'
      });
    });

    // Test: Returns 404 when item to update is not found
    it('should return 404 when item to update is not found', () => {
      req.params.id = '999';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
    });

    // Test: Keeps original name when no new name provided
    it('should keep original name when no new name provided', () => {
      req.params.id = '1';
      req.body = {};
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Item 1'
      });
    });

    // Test: Handles null name in request body
    it('should keep original name when null name provided', () => {
      req.params.id = '1';
      req.body.name = null;
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Item 1'
      });
    });

    // Test: Handles invalid ID format
    it('should return 404 for invalid ID format', () => {
      req.params.id = 'invalid';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
    });
  });

  describe('deleteItem', () => {
    // Test: Deletes existing item successfully
    it('should delete existing item successfully', () => {
      req.params.id = '1';
      
      itemController.deleteItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ message: 'Item deleted' });
    });

    // Test: Returns 404 when item to delete is not found
    it('should return 404 when item to delete is not found', () => {
      req.params.id = '999';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
    });

    // Test: Handles invalid ID format
    it('should return 404 for invalid ID format', () => {
      req.params.id = 'invalid';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
    });

    // Test: Removes item from array
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