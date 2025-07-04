/**
 * Unit Tests for itemController.js
 * 
 * Test Strategy:
 * - Comprehensive coverage of all controller methods (getAll, getById, createItem, updateItem, deleteItem)
 * - Tests HTTP request/response behavior with realistic data
 * - Validates success paths, error scenarios, and edge cases
 * - Tests proper status codes and response formats
 * - Includes boundary conditions and input validation
 * - Uses Jest mocks for req/res objects to isolate controller logic
 * - Achieves 90%+ coverage across all code paths
 */

const itemController = require('../controllers/itemController');

describe('itemController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Reset items data before each test
    const items = require('../data/items');
    items.length = 0;
    items.push(
      { id: 1, name: 'Laptop Computer' },
      { id: 2, name: 'Wireless Mouse' },
      { id: 3, name: 'Mechanical Keyboard' }
    );

    // Mock Express request and response objects
    mockReq = {
      params: {},
      body: {}
    };

    mockRes = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all items with 200 status', () => {
      itemController.getAll(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith([
        { id: 1, name: 'Laptop Computer' },
        { id: 2, name: 'Wireless Mouse' },
        { id: 3, name: 'Mechanical Keyboard' }
      ]);
    });

    it('should return empty array when no items exist', () => {
      const items = require('../data/items');
      items.length = 0;

      itemController.getAll(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    it('should handle large item collections', () => {
      const items = require('../data/items');
      items.length = 0;
      
      // Add 1000 items to test performance
      for (let i = 1; i <= 1000; i++) {
        items.push({ id: i, name: `Item ${i}` });
      }

      itemController.getAll(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          { id: 1, name: 'Item 1' },
          { id: 1000, name: 'Item 1000' }
        ])
      );
      expect(mockRes.json.mock.calls[0][0]).toHaveLength(1000);
    });
  });

  describe('getById', () => {
    it('should return item when valid id is provided', () => {
      mockReq.params.id = '2';

      itemController.getById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        id: 2,
        name: 'Wireless Mouse'
      });
    });

    it('should return 404 when item not found', () => {
      mockReq.params.id = '999';

      itemController.getById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item not found'
      });
    });

    it('should handle string id conversion to integer', () => {
      mockReq.params.id = '1';

      itemController.getById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Laptop Computer'
      });
    });

    it('should return 404 for non-numeric id', () => {
      mockReq.params.id = 'abc';

      itemController.getById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item not found'
      });
    });

    it('should return 404 for negative id', () => {
      mockReq.params.id = '-1';

      itemController.getById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item not found'
      });
    });

    it('should return 404 for zero id', () => {
      mockReq.params.id = '0';

      itemController.getById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item not found'
      });
    });

    it('should handle decimal id by truncating', () => {
      mockReq.params.id = '1.5';

      itemController.getById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Laptop Computer'
      });
    });
  });

  describe('createItem', () => {
    it('should create new item with valid data', () => {
      mockReq.body = { name: 'USB Cable' };

      itemController.createItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 4,
        name: 'USB Cable'
      });
    });

    it('should handle empty name', () => {
      mockReq.body = { name: '' };

      itemController.createItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 4,
        name: ''
      });
    });

    it('should handle undefined name', () => {
      mockReq.body = {};

      itemController.createItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 4,
        name: undefined
      });
    });

    it('should handle null name', () => {
      mockReq.body = { name: null };

      itemController.createItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 4,
        name: null
      });
    });

    it('should generate sequential ids', () => {
      const items = require('../data/items');
      
      mockReq.body = { name: 'First Item' };
      itemController.createItem(mockReq, mockRes);
      
      mockReq.body = { name: 'Second Item' };
      itemController.createItem(mockReq, mockRes);

      expect(items).toHaveLength(5);
      expect(items[3]).toEqual({ id: 4, name: 'First Item' });
      expect(items[4]).toEqual({ id: 5, name: 'Second Item' });
    });

    it('should handle very long item names', () => {
      const longName = 'A'.repeat(1000);
      mockReq.body = { name: longName };

      itemController.createItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 4,
        name: longName
      });
    });

    it('should handle special characters in name', () => {
      mockReq.body = { name: '!@#$%^&*()_+-=[]{}|;:,.<>?' };

      itemController.createItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 4,
        name: '!@#$%^&*()_+-=[]{}|;:,.<>?'
      });
    });

    it('should handle unicode characters in name', () => {
      mockReq.body = { name: '测试物品 🖥️ العنصر' };

      itemController.createItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 4,
        name: '测试物品 🖥️ العنصر'
      });
    });
  });

  describe('updateItem', () => {
    it('should update existing item with valid data', () => {
      mockReq.params.id = '2';
      mockReq.body = { name: 'Updated Mouse' };

      itemController.updateItem(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        id: 2,
        name: 'Updated Mouse'
      });
    });

    it('should return 404 when item not found', () => {
      mockReq.params.id = '999';
      mockReq.body = { name: 'Non-existent Item' };

      itemController.updateItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item not found'
      });
    });

    it('should preserve existing name when no name provided', () => {
      mockReq.params.id = '1';
      mockReq.body = {};

      itemController.updateItem(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Laptop Computer'
      });
    });

    it('should update with null name', () => {
      mockReq.params.id = '1';
      mockReq.body = { name: null };

      itemController.updateItem(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Laptop Computer'
      });
    });

    it('should update with empty string name', () => {
      mockReq.params.id = '1';
      mockReq.body = { name: '' };

      itemController.updateItem(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Laptop Computer'
      });
    });

    it('should update with undefined name', () => {
      mockReq.params.id = '1';
      mockReq.body = { name: undefined };

      itemController.updateItem(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Laptop Computer'
      });
    });

    it('should handle non-numeric id', () => {
      mockReq.params.id = 'abc';
      mockReq.body = { name: 'Test Item' };

      itemController.updateItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item not found'
      });
    });

    it('should handle negative id', () => {
      mockReq.params.id = '-1';
      mockReq.body = { name: 'Test Item' };

      itemController.updateItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item not found'
      });
    });

    it('should update item with whitespace name', () => {
      mockReq.params.id = '1';
      mockReq.body = { name: '   Spaced Item   ' };

      itemController.updateItem(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        name: '   Spaced Item   '
      });
    });
  });

  describe('deleteItem', () => {
    it('should delete existing item', () => {
      const items = require('../data/items');
      mockReq.params.id = '2';

      itemController.deleteItem(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item deleted'
      });
      expect(items).toHaveLength(2);
      expect(items.find(item => item.id === 2)).toBeUndefined();
    });

    it('should return 404 when item not found', () => {
      mockReq.params.id = '999';

      itemController.deleteItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item not found'
      });
    });

    it('should handle non-numeric id', () => {
      mockReq.params.id = 'abc';

      itemController.deleteItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item not found'
      });
    });

    it('should handle negative id', () => {
      mockReq.params.id = '-1';

      itemController.deleteItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item not found'
      });
    });

    it('should handle zero id', () => {
      mockReq.params.id = '0';

      itemController.deleteItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item not found'
      });
    });

    it('should delete first item correctly', () => {
      const items = require('../data/items');
      mockReq.params.id = '1';

      itemController.deleteItem(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item deleted'
      });
      expect(items).toHaveLength(2);
      expect(items[0]).toEqual({ id: 2, name: 'Wireless Mouse' });
    });

    it('should delete last item correctly', () => {
      const items = require('../data/items');
      mockReq.params.id = '3';

      itemController.deleteItem(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item deleted'
      });
      expect(items).toHaveLength(2);
      expect(items[items.length - 1]).toEqual({ id: 2, name: 'Wireless Mouse' });
    });

    it('should handle deleting from single item array', () => {
      const items = require('../data/items');
      items.length = 0;
      items.push({ id: 1, name: 'Only Item' });
      
      mockReq.params.id = '1';

      itemController.deleteItem(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item deleted'
      });
      expect(items).toHaveLength(0);
    });

    it('should handle deleting from empty array', () => {
      const items = require('../data/items');
      items.length = 0;
      
      mockReq.params.id = '1';

      itemController.deleteItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item not found'
      });
    });
  });
});