const request = require('supertest');
const express = require('express');
const itemRoutes = require('../routes/itemRoutes');

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
    it('should call getAll controller for GET /', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(200).json({ success: true });
      });

      const response = await request(app).get('/items');

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test error handling in getAll route
    it('should handle errors in getAll controller', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Internal server error' });
      });

      const response = await request(app).get('/items');

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(500);
    });
  });

  describe('GET /:id', () => {
    // Test successful retrieval of item by ID
    it('should call getById controller for GET /:id', async () => {
      const itemId = '123';
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id, success: true });
      });

      const response = await request(app).get(`/items/${itemId}`);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test getById with special characters in ID
    it('should handle special characters in item ID', async () => {
      const itemId = 'test-item_123';
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      const response = await request(app).get(`/items/${itemId}`);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test getById with non-existent ID
    it('should handle non-existent item ID', async () => {
      getById.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app).get('/items/non-existent');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
    });
  });

  describe('POST /', () => {
    // Test successful item creation
    it('should call createItem controller for POST /', async () => {
      const newItem = { name: 'Test Item', description: 'Test Description' };
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ id: '123', ...req.body });
      });

      const response = await request(app)
        .post('/items')
        .send(newItem);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(201);
    });

    // Test item creation with empty body
    it('should handle empty request body in POST', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid request body' });
      });

      const response = await request(app)
        .post('/items')
        .send({});

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });

    // Test item creation with invalid JSON
    it('should handle malformed JSON in POST request', async () => {
      const response = await request(app)
        .post('/items')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller for PUT /:id', async () => {
      const itemId = '123';
      const updateData = { name: 'Updated Item' };
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id, ...req.body });
      });

      const response = await request(app)
        .put(`/items/${itemId}`)
        .send(updateData);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test update with empty body
    it('should handle empty request body in PUT', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'No update data provided' });
      });

      const response = await request(app)
        .put('/items/123')
        .send({});

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });

    // Test update with non-existent ID
    it('should handle updating non-existent item', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .put('/items/non-existent')
        .send({ name: 'Updated' });

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /:id', () => {
    // Test successful item deletion
    it('should call deleteItem controller for DELETE /:id', async () => {
      const itemId = '123';
      deleteItem.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Item deleted successfully' });
      });

      const response = await request(app).delete(`/items/${itemId}`);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test deletion of non-existent item
    it('should handle deleting non-existent item', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app).delete('/items/non-existent');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
    });

    // Test deletion with special characters in ID
    it('should handle deletion with special characters in ID', async () => {
      const itemId = 'test-item_456';
      deleteItem.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Item deleted' });
      });

      const response = await request(app).delete(`/items/${itemId}`);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });
  });

  describe('Route middleware and integration', () => {
    // Test that all routes are properly mounted
    it('should have all CRUD routes properly configured', () => {
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
      expect(routes.some(r => r.path === '/' && r.methods.includes('get'))).toBe(true);
      expect(routes.some(r => r.path === '/:id' && r.methods.includes('get'))).toBe(true);
      expect(routes.some(r => r.path === '/' && r.methods.includes('post'))).toBe(true);
      expect(routes.some(r => r.path === '/:id' && r.methods.includes('put'))).toBe(true);
      expect(routes.some(r => r.path === '/:id' && r.methods.includes('delete'))).toBe(true);
    });

    // Test that router is properly exported
    it('should export router instance', () => {
      expect(itemRoutes).toBeDefined();
      expect(typeof itemRoutes).toBe('function');
      expect(itemRoutes.stack).toBeDefined();
    });
  });
});