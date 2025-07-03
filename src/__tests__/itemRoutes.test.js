const request = require('supertest');
const express = require('express');
const itemRoutes = require('../routes/itemRoutes');

// Mock the controller functions
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
        res.status(200).json({ items: [] });
      });

      const response = await request(app).get('/items');

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test controller error handling
    it('should handle controller errors', async () => {
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
        res.status(200).json({ item: { id: req.params.id } });
      });

      const response = await request(app).get('/items/123');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test with invalid ID format
    it('should handle invalid ID format', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app).get('/items/invalid-id');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });

    // Test with non-existent ID
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
        res.status(201).json({ item: { id: 1, ...req.body } });
      });

      const newItem = { name: 'Test Item', description: 'Test Description' };
      const response = await request(app)
        .post('/items')
        .send(newItem);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(201);
    });

    // Test creation with empty body
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

    // Test creation with invalid data
    it('should handle invalid item data', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid item data' });
      });

      const invalidItem = { name: '', description: null };
      const response = await request(app)
        .post('/items')
        .send(invalidItem);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller function with correct ID', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ item: { id: req.params.id, ...req.body } });
      });

      const updateData = { name: 'Updated Item', description: 'Updated Description' };
      const response = await request(app)
        .put('/items/123')
        .send(updateData);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test update with invalid ID
    it('should handle invalid ID for update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const updateData = { name: 'Updated Item' };
      const response = await request(app)
        .put('/items/invalid-id')
        .send(updateData);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });

    // Test update with non-existent ID
    it('should handle non-existent item for update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const updateData = { name: 'Updated Item' };
      const response = await request(app)
        .put('/items/999')
        .send(updateData);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
    });

    // Test update with empty body
    it('should handle empty update data', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Update data is required' });
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
        res.status(200).json({ message: 'Item deleted successfully' });
      });

      const response = await request(app).delete('/items/123');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test deletion with invalid ID
    it('should handle invalid ID for deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app).delete('/items/invalid-id');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });

    // Test deletion with non-existent ID
    it('should handle non-existent item for deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app).delete('/items/999');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
    });
  });

  describe('Route Configuration', () => {
    // Test that all routes are properly configured
    it('should have all required routes configured', () => {
      const routes = itemRoutes.stack.map(layer => ({
        method: Object.keys(layer.route.methods)[0].toUpperCase(),
        path: layer.route.path
      }));

      expect(routes).toEqual([
        { method: 'GET', path: '/' },
        { method: 'GET', path: '/:id' },
        { method: 'POST', path: '/' },
        { method: 'PUT', path: '/:id' },
        { method: 'DELETE', path: '/:id' }
      ]);
    });
  });
});