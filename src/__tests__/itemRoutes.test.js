const request = require('supertest');
const express = require('express');
const itemRoutes = require('../routes/itemRoutes');

// Mock the item controller
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

describe('Item Routes', () => {
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

      await request(app)
        .get('/items')
        .expect(200);

      expect(getAll).toHaveBeenCalledTimes(1);
    });

    // Test route parameter passing
    it('should pass req and res to getAll controller', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(200).json([]);
      });

      await request(app).get('/items');

      expect(getAll).toHaveBeenCalledWith(
        expect.any(Object),
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

      await request(app)
        .get('/items/123')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: '123' } }),
        expect.any(Object)
      );
    });

    // Test edge case with special characters in ID
    it('should handle special characters in ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get('/items/abc-123_test')
        .expect(200);

      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: 'abc-123_test' } }),
        expect.any(Object)
      );
    });

    // Test edge case with numeric ID
    it('should handle numeric ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get('/items/999')
        .expect(200);

      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: '999' } }),
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
        .send(newItem)
        .expect(201);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(createItem).toHaveBeenCalledWith(
        expect.objectContaining({ body: newItem }),
        expect.any(Object)
      );
    });

    // Test POST with empty body
    it('should handle empty request body', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid data' });
      });

      await request(app)
        .post('/items')
        .send({})
        .expect(400);

      expect(createItem).toHaveBeenCalledWith(
        expect.objectContaining({ body: {} }),
        expect.any(Object)
      );
    });

    // Test POST with invalid JSON
    it('should handle malformed JSON', async () => {
      await request(app)
        .post('/items')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
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
        .put('/items/123')
        .send(updateData)
        .expect(200);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(updateItem).toHaveBeenCalledWith(
        expect.objectContaining({ 
          params: { id: '123' },
          body: updateData
        }),
        expect.any(Object)
      );
    });

    // Test PUT with empty body
    it('should handle empty update data', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'No data provided' });
      });

      await request(app)
        .put('/items/123')
        .send({})
        .expect(400);

      expect(updateItem).toHaveBeenCalledWith(
        expect.objectContaining({ 
          params: { id: '123' },
          body: {}
        }),
        expect.any(Object)
      );
    });

    // Test PUT with complex ID
    it('should handle complex ID in update route', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .put('/items/uuid-123-abc')
        .send({ name: 'Test' })
        .expect(200);

      expect(updateItem).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: 'uuid-123-abc' } }),
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

      await request(app)
        .delete('/items/123')
        .expect(204);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(deleteItem).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: '123' } }),
        expect.any(Object)
      );
    });

    // Test DELETE with non-existent ID
    it('should handle deletion of non-existent item', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      await request(app)
        .delete('/items/nonexistent')
        .expect(404);

      expect(deleteItem).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: 'nonexistent' } }),
        expect.any(Object)
      );
    });

    // Test DELETE with special characters in ID
    it('should handle special characters in delete ID', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app)
        .delete('/items/test@123.com')
        .expect(204);

      expect(deleteItem).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: 'test@123.com' } }),
        expect.any(Object)
      );
    });
  });

  describe('Route Integration', () => {
    // Test that all routes are properly mounted
    it('should have all required routes registered', () => {
      const routes = [];
      itemRoutes.stack.forEach(layer => {
        if (layer.route) {
          routes.push({
            path: layer.route.path,
            methods: Object.keys(layer.route.methods)
          });
        }
      });

      expect(routes).toHaveLength(5);
      expect(routes).toContainEqual({ path: '/', methods: ['get'] });
      expect(routes).toContainEqual({ path: '/:id', methods: ['get'] });
      expect(routes).toContainEqual({ path: '/', methods: ['post'] });
      expect(routes).toContainEqual({ path: '/:id', methods: ['put'] });
      expect(routes).toContainEqual({ path: '/:id', methods: ['delete'] });
    });

    // Test middleware order and execution
    it('should execute middleware in correct order', async () => {
      const middlewareCalls = [];
      
      getAll.mockImplementation((req, res) => {
        middlewareCalls.push('getAll');
        res.status(200).json([]);
      });

      await request(app).get('/items');

      expect(middlewareCalls).toEqual(['getAll']);
    });
  });
});