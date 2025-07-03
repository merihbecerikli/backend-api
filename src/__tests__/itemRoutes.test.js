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
        res.status(200).json([{ id: 1, name: 'test item' }]);
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
        res.status(200).json({ id: req.params.id, name: 'test item' });
      });

      const response = await request(app).get('/items/123');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test with invalid ID format
    it('should handle invalid ID parameters', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID' });
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
      const newItem = { name: 'new item', description: 'test description' };
      
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ id: 1, ...req.body });
      });

      const response = await request(app)
        .post('/items')
        .send(newItem);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(201);
    });

    // Test creation with invalid data
    it('should handle invalid item data', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid item data' });
      });

      const response = await request(app)
        .post('/items')
        .send({});

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });

    // Test creation with missing required fields
    it('should handle missing required fields', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Missing required fields' });
      });

      const response = await request(app)
        .post('/items')
        .send({ description: 'incomplete item' });

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller function with correct ID', async () => {
      const updateData = { name: 'updated item' };
      
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id, ...req.body });
      });

      const response = await request(app)
        .put('/items/123')
        .send(updateData);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test update with invalid ID
    it('should handle invalid ID for update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID' });
      });

      const response = await request(app)
        .put('/items/invalid-id')
        .send({ name: 'updated item' });

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });

    // Test update with non-existent ID
    it('should handle non-existent item for update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .put('/items/999')
        .send({ name: 'updated item' });

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
    });

    // Test update with empty request body
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

    // Test deletion with invalid ID
    it('should handle invalid ID for deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID' });
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

    // Test deletion with server error
    it('should handle server errors during deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Failed to delete item' });
      });

      const response = await request(app).delete('/items/123');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(500);
    });
  });

  describe('Route mounting', () => {
    // Test that all routes are properly mounted
    it('should have all required routes mounted', () => {
      const routes = [];
      itemRoutes.stack.forEach(layer => {
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