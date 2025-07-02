const itemController = require('../controllers/itemController');

// Mock the items data module
jest.mock('../data/items', () => [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
]);

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    // Test: Should return all items successfully
    it('should return all items', () => {
      itemController.getAll(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ]);
    });
  });

  describe('getById', () => {
    // Test: Should return item when valid ID is provided
    it('should return item when valid id is provided', () => {
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

    // Test: Should handle string ID conversion to integer
    it('should handle string id conversion', () => {
      req.params.id = '2';

      itemController.getById(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: 2, name: 'Item 2' });
    });

    // Test: Should return 404 for invalid ID format
    it('should return 404 for invalid id format', () => {
      req.params.id = 'invalid';

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
        id: 4,
        name: 'New Item'
      });
    });

    // Test: Should handle missing name in request body
    it('should create item with undefined name when name is missing', () => {
      req.body = {};

      itemController.createItem(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 4,
        name: undefined
      });
    });

    // Test: Should increment ID correctly for multiple items
    it('should increment id correctly for multiple items', () => {
      req.body.name = 'Item A';
      itemController.createItem(req, res);

      req.body.name = 'Item B';
      itemController.createItem(req, res);

      expect(res.json).toHaveBeenLastCalledWith({
        id: 5,
        name: 'Item B'
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

    // Test: Should return 404 when trying to update non-existent item
    it('should return 404 when item to update is not found', () => {
      req.params.id = '999';
      req.body.name = 'Updated Item';

      itemController.updateItem(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should keep existing name when no name provided in update
    it('should keep existing name when no name provided', () => {
      req.params.id = '2';
      req.body = {};

      itemController.updateItem(req, res);

      expect(res.json).toHaveBeenCalledWith({
        id: 2,
        name: 'Item 2'
      });
    });

    // Test: Should handle partial updates with empty string
    it('should handle empty string name update', () => {
      req.params.id = '1';
      req.body.name = '';

      itemController.updateItem(req, res);

      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: ''
      });
    });
  });

  describe('deleteItem', () => {
    // Test: Should delete existing item successfully
    it('should delete existing item successfully', () => {
      req.params.id = '1';

      itemController.deleteItem(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Item deleted" });
    });

    // Test: Should return 404 when trying to delete non-existent item
    it('should return 404 when item to delete is not found', () => {
      req.params.id = '999';

      itemController.deleteItem(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });

    // Test: Should handle string ID conversion for deletion
    it('should handle string id conversion for deletion', () => {
      req.params.id = '2';

      itemController.deleteItem(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Item deleted" });
    });

    // Test: Should handle invalid ID format for deletion
    it('should return 404 for invalid id format during deletion', () => {
      req.params.id = 'invalid';

      itemController.deleteItem(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Item not found" });
    });
  });
});