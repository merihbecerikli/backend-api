// Mock the items data module to control test data
jest.mock('../data/items', () => [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
]);

const itemController = require('../controllers/itemController');

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
      status: jest.fn(() => res)
    };
  });

  describe('getAll', () => {
    // Test successful retrieval of all items
    it('should return all items', () => {
      itemController.getAll(req, res);
      
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ]);
    });

    // Test that res.json is called exactly once
    it('should call res.json exactly once', () => {
      itemController.getAll(req, res);
      
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    // Test successful retrieval of item by valid ID
    it('should return item when valid ID is provided', () => {
      req.params.id = '1';
      
      itemController.getById(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Item 1' });
    });

    // Test retrieval with string ID that converts to valid number
    it('should return item when string ID converts to valid number', () => {
      req.params.id = '2';
      
      itemController.getById(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ id: 2, name: 'Item 2' });
    });

    // Test 404 response when item is not found
    it('should return 404 when item is not found', () => {
      req.params.id = '999';
      
      itemController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test edge case with non-numeric ID
    it('should return 404 when ID is not a valid number', () => {
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
    // Test successful creation of new item
    it('should create a new item and return it with 201 status', () => {
      req.body.name = 'New Item';
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 4,
        name: 'New Item'
      });
    });

    // Test creation with empty name
    it('should create item with empty name when no name provided', () => {
      req.body = {};
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 4,
        name: undefined
      });
    });

    // Test creation with null name
    it('should create item with null name', () => {
      req.body.name = null;
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 4,
        name: null
      });
    });

    // Test creation with whitespace name
    it('should create item with whitespace name', () => {
      req.body.name = '   ';
      
      itemController.createItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 4,
        name: '   '
      });
    });
  });

  describe('updateItem', () => {
    // Test successful update of existing item
    it('should update existing item and return it', () => {
      req.params.id = '1';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Item'
      });
    });

    // Test update with no name provided (should keep existing name)
    it('should keep existing name when no name provided in update', () => {
      req.params.id = '2';
      req.body = {};
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 2,
        name: 'Item 2'
      });
    });

    // Test update with empty string name
    it('should keep existing name when empty string provided', () => {
      req.params.id = '2';
      req.body.name = '';
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 2,
        name: 'Item 2'
      });
    });

    // Test update with null name
    it('should keep existing name when null provided', () => {
      req.params.id = '2';
      req.body.name = null;
      
      itemController.updateItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({
        id: 2,
        name: 'Item 2'
      });
    });

    // Test 404 response when trying to update non-existent item
    it('should return 404 when trying to update non-existent item', () => {
      req.params.id = '999';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test update with invalid ID
    it('should return 404 when ID is not a valid number', () => {
      req.params.id = 'abc';
      req.body.name = 'Updated Item';
      
      itemController.updateItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });

  describe('deleteItem', () => {
    // Test successful deletion of existing item
    it('should delete existing item and return success message', () => {
      req.params.id = '1';
      
      itemController.deleteItem(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ message: "Item deleted" });
    });

    // Test 404 response when trying to delete non-existent item
    it('should return 404 when trying to delete non-existent item', () => {
      req.params.id = '999';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test deletion with invalid ID
    it('should return 404 when ID is not a valid number', () => {
      req.params.id = 'abc';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test deletion with zero ID
    it('should return 404 when ID is zero', () => {
      req.params.id = '0';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test deletion with negative ID
    it('should return 404 when ID is negative', () => {
      req.params.id = '-1';
      
      itemController.deleteItem(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });
});