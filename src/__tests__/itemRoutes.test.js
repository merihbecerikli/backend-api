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
    it('should call getAll controller when GET / is requested', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(200).json([{ id: 1, name: 'test item' }]);
      });

      const response = await request(app).get('/items');

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, name: 'test item' }]);
    });

    // Test error handling in getAll
    it('should handle errors from getAll controller', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Internal server error' });
      });

      const response = await request(app).get('/items');

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('GET /:id', () => {
    // Test successful retrieval of item by ID
    it('should call getById controller with correct ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: 1, name: 'test item' });
      });

      const response = await request(app).get('/items/1');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, name: 'test item' });
    });

    // Test getById with non-numeric ID
    it('should handle non-numeric ID parameters', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app).get('/items/abc');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });

    // Test getById with non-existent ID
    it('should handle non-existent item ID', async () => {
      getById.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app).get('/items/999');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Item not found' });
    });
  });

  describe('POST /', () => {
    // Test successful item creation
    it('should call createItem controller with request body', async () => {
      const newItem = { name: 'new item', description: 'test description' };
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ id: 1, ...req.body });
      });

      const response = await request(app)
        .post('/items')
        .send(newItem);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, ...newItem });
    });

    // Test createItem with empty body
    it('should handle empty request body', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Request body is required' });
      });

      const response = await request(app)
        .post('/items')
        .send({});

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });

    // Test createItem with invalid data
    it('should handle invalid item data', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid item data' });
      });

      const response = await request(app)
        .post('/items')
        .send({ invalid: 'data' });

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller with ID and request body', async () => {
      const updatedItem = { name: 'updated item', description: 'updated description' };
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ id: 1, ...req.body });
      });

      const response = await request(app)
        .put('/items/1')
        .send(updatedItem);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, ...updatedItem });
    });

    // Test updateItem with non-existent ID
    it('should handle non-existent item ID for update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .put('/items/999')
        .send({ name: 'updated item' });

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
    });

    // Test updateItem with empty body
    it('should handle empty update data', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Update data is required' });
      });

      const response = await request(app)
        .put('/items/1')
        .send({});

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /:id', () => {
    // Test successful item deletion
    it('should call deleteItem controller with correct ID parameter', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Item deleted successfully' });
      });

      const response = await request(app).delete('/items/1');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Item deleted successfully' });
    });

    // Test deleteItem with non-existent ID
    it('should handle non-existent item ID for deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app).delete('/items/999');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    // Test deleteItem with invalid ID format
    it('should handle invalid ID format for deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app).delete('/items/invalid-id');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });
  });

  describe('Route Configuration', () => {
    // Test that all routes are properly configured
    it('should have all required routes configured', () => {
      const routes = [];
      itemRoutes.stack.forEach((layer) => {
        if (layer.route) {
          const methods = Object.keys(layer.route.methods);
          routes.push({
            path: layer.route.path,
            methods: methods
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
  });
});