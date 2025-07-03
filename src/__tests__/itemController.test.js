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
    
    // Reset the items array to initial state
    jest.resetModules();
    const items = require('../data/items');
    items.length = 0;
    items.push(
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    );
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
      items.length = 0;
      
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

    // Test edge case with invalid ID format
    it('should return 404 when ID is not a number', () => {
      req.params.id = 'abc';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test edge case with zero ID
    it('should return 404 when ID is zero', () => {
      req.params.id = '0';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('createItem', () => {
    // Test successful item creation
    it('should create new item and return 201 status', () => {
      req.body.name = 'New Item';
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: 'New Item'
      });
    });

    // Test item creation adds to items array
    it('should add new item to items array', () => {
      const items = require('../data/items');
      const initialLength = items.length;
      req.body.name = 'Test Item';
      
      itemController.createItem(req, res);
      
      expect(items.length).toBe(initialLength + 1);
      expect(items[items.length - 1]).toEqual({
        id: 3,
        name: 'Test Item'
      });
    });

    // Test edge case with empty name
    it('should create item with undefined name when name is not provided', () => {
      req.body = {};
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: undefined
      });
    });

    // Test edge case with null name
    it('should create item with null name when name is null', () => {
      req.body.name = null;
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: null
      });
    });
  });

  describe('updateItem', () => {
    // Test successful item update
    it('should update existing item and return updated item', () => {
      req.params.id = '1';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Item'
      });
    });

    // Test 404 response when updating non-existent item
    it('should return 404 when trying to update non-existent item', () => {
      req.params.id = '999';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test partial update (name not provided)
    it('should keep existing name when name is not provided in request body', () => {
      req.params.id = '1';
      req.body = {};
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Item 1'
      });
    });

    // Test edge case with falsy name value
    it('should keep existing name when name is empty string', () => {
      req.params.id = '1';
      req.body.name = '';
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Item 1'
      });
    });

    // Test edge case with invalid ID format
    it('should return 404 when ID is not a number', () => {
      req.params.id = 'abc';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('deleteItem', () => {
    // Test successful item deletion
    it('should delete existing item and return success message', () => {
      req.params.id = '1';
      
      itemController.deleteItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ message: "Item deleted" });
    });

    // Test item removal from items array
    it('should remove item from items array', () => {
      const items = require('../data/items');
      const initialLength = items.length;
      req.params.id = '1';
      
      itemController.deleteItem(req, res);
      
      expect(items.length).toBe(initialLength - 1);
      expect(items.find(item => item.id === 1)).toBeUndefined();
    });

    // Test 404 response when deleting non-existent item
    it('should return 404 when trying to delete non-existent item', () => {
      req.params.id = '999';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test edge case with invalid ID format
    it('should return 404 when ID is not a number', () => {
      req.params.id = 'abc';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test edge case with zero ID
    it('should return 404 when ID is zero', () => {
      req.params.id = '0';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });
});