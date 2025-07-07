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
        res.status(200).json({ items: [] });
      });

      const response = await request(app).get('/items');

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test error handling in getAll
    it('should handle errors from getAll controller', async () => {
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
    it('should call getById controller function with correct ID', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id, name: 'Test Item' });
      });

      const response = await request(app).get('/items/123');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test getById with invalid ID format
    it('should handle invalid ID format', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app).get('/items/invalid-id');

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
    });
  });

  describe('POST /', () => {
    // Test successful item creation
    it('should call createItem controller function', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ id: 1, ...req.body });
      });

      const newItem = { name: 'New Item', description: 'Test description' };
      const response = await request(app)
        .post('/items')
        .send(newItem);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(201);
    });

    // Test createItem with invalid data
    it('should handle invalid data in createItem', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid data' });
      });

      const response = await request(app)
        .post('/items')
        .send({});

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });

    // Test createItem with missing required fields
    it('should handle missing required fields', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(422).json({ error: 'Missing required fields' });
      });

      const response = await request(app)
        .post('/items')
        .send({ description: 'Only description' });

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(422);
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller function with correct ID', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id, ...req.body });
      });

      const updateData = { name: 'Updated Item' };
      const response = await request(app)
        .put('/items/123')
        .send(updateData);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test updateItem with invalid ID
    it('should handle invalid ID in updateItem', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app)
        .put('/items/invalid-id')
        .send({ name: 'Updated Item' });

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });

    // Test updateItem with non-existent ID
    it('should handle non-existent item in updateItem', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .put('/items/999')
        .send({ name: 'Updated Item' });

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
    });

    // Test updateItem with empty body
    it('should handle empty update data', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'No update data provided' });
      });

      const response = await request(app)
        .put('/items/123')
        .send({});

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /:id', () => {
    // Test successful item deletion
    it('should call deleteItem controller function with correct ID', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      const response = await request(app).delete('/items/123');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(204);
    });

    // Test deleteItem with invalid ID
    it('should handle invalid ID in deleteItem', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app).delete('/items/invalid-id');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });

    // Test deleteItem with non-existent ID
    it('should handle non-existent item in deleteItem', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app).delete('/items/999');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
    });
  });

  describe('Route mounting', () => {
    // Test that routes are properly mounted
    it('should mount all routes correctly', () => {
      const routes = itemRoutes.stack.map(layer => ({
        method: Object.keys(layer.route.methods)[0].toUpperCase(),
        path: layer.route.path
      }));

      expect(routes).toContainEqual({ method: 'GET', path: '/' });
      expect(routes).toContainEqual({ method: 'GET', path: '/:id' });
      expect(routes).toContainEqual({ method: 'POST', path: '/' });
      expect(routes).toContainEqual({ method: 'PUT', path: '/:id' });
      expect(routes).toContainEqual({ method: 'DELETE', path: '/:id' });
    });
  });
});