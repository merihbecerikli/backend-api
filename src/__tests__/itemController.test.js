const itemController = require('../controllers/itemController');

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
      status: jest.fn().mockReturnThis()
    };
  });

  describe('getAll', () => {
    // Test: Returns all items from the data store
    it('should return all items', () => {
      itemController.getAll(req, res);
      
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]);
    });
  });

  describe('getById', () => {
    // Test: Returns specific item when valid ID is provided
    it('should return item when valid id is provided', () => {
      req.params.id = '1';
      
      itemController.getById(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Item 1' });
    });

    // Test: Returns 404 when item is not found
    it('should return 404 when item is not found', () => {
      req.params.id = '999';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Handles non-numeric ID parameters
    it('should return 404 when id is not numeric', () => {
      req.params.id = 'abc';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('createItem', () => {
    // Test: Creates new item with valid data
    it('should create new item with valid data', () => {
      req.body.name = 'New Item';
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: 'New Item'
      });
    });

    // Test: Creates item even when name is undefined
    it('should create item even when name is undefined', () => {
      req.body = {};
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: undefined
      });
    });
  });

  describe('updateItem', () => {
    // Test: Updates existing item with new name
    it('should update existing item with new name', () => {
      req.params.id = '1';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Item'
      });
    });

    // Test: Returns 404 when trying to update non-existent item
    it('should return 404 when item does not exist', () => {
      req.params.id = '999';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Preserves original name when new name is not provided
    it('should preserve original name when new name is not provided', () => {
      req.params.id = '1';
      req.body = {};
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Item 1'
      });
    });

    // Test: Handles non-numeric ID parameters
    it('should return 404 when id is not numeric', () => {
      req.params.id = 'abc';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('deleteItem', () => {
    // Test: Deletes existing item successfully
    it('should delete existing item', () => {
      req.params.id = '1';
      
      itemController.deleteItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ message: "Item deleted" });
    });

    // Test: Returns 404 when trying to delete non-existent item
    it('should return 404 when item does not exist', () => {
      req.params.id = '999';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Handles non-numeric ID parameters
    it('should return 404 when id is not numeric', () => {
      req.params.id = 'abc';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });
});