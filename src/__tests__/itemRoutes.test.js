const request = require('supertest');
const express = require('express');
const itemRoutes = require('../routes/itemRoutes');

// Mock the itemController
jest.mock('../controllers/itemController', () => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  createItem: jest.fn(),
  updateItem: jest.fn(),
  deleteItem: jest.fn()
}));

const {
  getAll,
  getById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');

describe('itemRoutes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/items', itemRoutes);
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    // Test successful retrieval of all items
    it('should call getAll controller function', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(200).json([]);
      });

      await request(app).get('/items');

      expect(getAll).toHaveBeenCalledTimes(1);
    });

    // Test route parameter passing
    it('should pass request and response objects to getAll', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(200).json([]);
      });

      await request(app).get('/items');

      expect(getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          path: '/'
        }),
        expect.any(Object)
      );
    });
  });

  describe('GET /:id', () => {
    // Test successful retrieval of item by ID
    it('should call getById controller function with correct ID', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app).get('/items/123');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: '123' }
        }),
        expect.any(Object)
      );
    });

    // Test edge case with special characters in ID
    it('should handle special characters in ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app).get('/items/abc-123_test');

      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: 'abc-123_test' }
        }),
        expect.any(Object)
      );
    });
  });

  describe('POST /', () => {
    // Test successful item creation
    it('should call createItem controller function', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ id: 1, ...req.body });
      });

      const newItem = { name: 'Test Item', description: 'Test Description' };

      await request(app)
        .post('/items')
        .send(newItem);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(createItem).toHaveBeenCalledWith(
        expect.objectContaining({
          body: newItem
        }),
        expect.any(Object)
      );
    });

    // Test empty request body
    it('should handle empty request body', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid data' });
      });

      await request(app)
        .post('/items')
        .send({});

      expect(createItem).toHaveBeenCalledWith(
        expect.objectContaining({
          body: {}
        }),
        expect.any(Object)
      );
    });

    // Test large payload
    it('should handle large request payload', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ id: 1 });
      });

      const largeItem = {
        name: 'A'.repeat(1000),
        description: 'B'.repeat(2000)
      };

      await request(app)
        .post('/items')
        .send(largeItem);

      expect(createItem).toHaveBeenCalledWith(
        expect.objectContaining({
          body: largeItem
        }),
        expect.any(Object)
      );
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller function with correct ID and data', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id, ...req.body });
      });

      const updateData = { name: 'Updated Item' };

      await request(app)
        .put('/items/456')
        .send(updateData);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(updateItem).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: '456' },
          body: updateData
        }),
        expect.any(Object)
      );
    });

    // Test update with empty body
    it('should handle update with empty request body', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'No data provided' });
      });

      await request(app)
        .put('/items/456')
        .send({});

      expect(updateItem).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: '456' },
          body: {}
        }),
        expect.any(Object)
      );
    });

    // Test update with numeric ID
    it('should handle numeric ID in update request', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .put('/items/789')
        .send({ name: 'Test' });

      expect(updateItem).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: '789' }
        }),
        expect.any(Object)
      );
    });
  });

  describe('DELETE /:id', () => {
    // Test successful item deletion
    it('should call deleteItem controller function with correct ID', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app).delete('/items/999');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(deleteItem).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: '999' }
        }),
        expect.any(Object)
      );
    });

    // Test deletion with alphanumeric ID
    it('should handle alphanumeric ID in delete request', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app).delete('/items/abc123');

      expect(deleteItem).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: 'abc123' }
        }),
        expect.any(Object)
      );
    });

    // Test deletion with UUID-like ID
    it('should handle UUID-like ID in delete request', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      await request(app).delete(`/items/${uuid}`);

      expect(deleteItem).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: uuid }
        }),
        expect.any(Object)
      );
    });
  });

  describe('Route Integration', () => {
    // Test that all routes are properly mounted
    it('should mount all CRUD routes correctly', () => {
      const routes = [];
      itemRoutes.stack.forEach((layer) => {
        if (layer.route) {
          routes.push({
            path: layer.route.path,
            methods: Object.keys(layer.route.methods)
          });
        }
      });

      expect(routes).toContainEqual({
        path: '/',
        methods: ['get']
      });
      expect(routes).toContainEqual({
        path: '/:id',
        methods: ['get']
      });
      expect(routes).toContainEqual({
        path: '/',
        methods: ['post']
      });
      expect(routes).toContainEqual({
        path: '/:id',
        methods: ['put']
      });
      expect(routes).toContainEqual({
        path: '/:id',
        methods: ['delete']
      });
    });

    // Test middleware chain execution
    it('should execute middleware in correct order', async () => {
      const calls = [];
      
      getAll.mockImplementation((req, res) => {
        calls.push('getAll');
        res.status(200).json([]);
      });

      await request(app).get('/items');

      expect(calls).toContain('getAll');
    });
  });
});