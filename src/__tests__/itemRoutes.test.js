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
        res.status(200).json([{ id: 1, name: 'Test Item' }]);
      });

      const response = await request(app)
        .get('/items')
        .expect(200);

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual([{ id: 1, name: 'Test Item' }]);
    });

    // Test error handling in getAll
    it('should handle errors from getAll controller', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Internal server error' });
      });

      await request(app)
        .get('/items')
        .expect(500);

      expect(getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /:id', () => {
    // Test successful retrieval of item by ID
    it('should call getById controller function with correct ID', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: 1, name: 'Test Item' });
      });

      const response = await request(app)
        .get('/items/1')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: 1, name: 'Test Item' });
    });

    // Test item not found scenario
    it('should handle item not found', async () => {
      getById.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      await request(app)
        .get('/items/999')
        .expect(404);

      expect(getById).toHaveBeenCalledTimes(1);
    });

    // Test with invalid ID format
    it('should handle invalid ID format', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      await request(app)
        .get('/items/invalid-id')
        .expect(400);

      expect(getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /', () => {
    // Test successful item creation
    it('should call createItem controller function', async () => {
      const newItem = { name: 'New Item', description: 'Test description' };
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ id: 1, ...newItem });
      });

      const response = await request(app)
        .post('/items')
        .send(newItem)
        .expect(201);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: 1, ...newItem });
    });

    // Test creation with missing required fields
    it('should handle validation errors for missing fields', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Name is required' });
      });

      await request(app)
        .post('/items')
        .send({})
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
    });

    // Test creation with invalid data
    it('should handle invalid data format', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid data format' });
      });

      await request(app)
        .post('/items')
        .send({ name: 123 })
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller function with correct ID', async () => {
      const updatedItem = { name: 'Updated Item', description: 'Updated description' };
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ id: 1, ...updatedItem });
      });

      const response = await request(app)
        .put('/items/1')
        .send(updatedItem)
        .expect(200);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: 1, ...updatedItem });
    });

    // Test update for non-existent item
    it('should handle updating non-existent item', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      await request(app)
        .put('/items/999')
        .send({ name: 'Updated Item' })
        .expect(404);

      expect(updateItem).toHaveBeenCalledTimes(1);
    });

    // Test update with invalid ID
    it('should handle invalid ID in update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      await request(app)
        .put('/items/invalid-id')
        .send({ name: 'Updated Item' })
        .expect(400);

      expect(updateItem).toHaveBeenCalledTimes(1);
    });

    // Test update with empty body
    it('should handle update with empty body', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'No data provided for update' });
      });

      await request(app)
        .put('/items/1')
        .send({})
        .expect(400);

      expect(updateItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /:id', () => {
    // Test successful item deletion
    it('should call deleteItem controller function with correct ID', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Item deleted successfully' });
      });

      const response = await request(app)
        .delete('/items/1')
        .expect(200);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ message: 'Item deleted successfully' });
    });

    // Test deletion of non-existent item
    it('should handle deleting non-existent item', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      await request(app)
        .delete('/items/999')
        .expect(404);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });

    // Test deletion with invalid ID
    it('should handle invalid ID in deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      await request(app)
        .delete('/items/invalid-id')
        .expect(400);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Route Integration', () => {
    // Test that all routes are properly mounted
    it('should have all required routes defined', () => {
      const routes = [];
      itemRoutes.stack.forEach(layer => {
        if (layer.route) {
          const path = layer.route.path;
          const methods = Object.keys(layer.route.methods);
          routes.push({ path, methods });
        }
      });

      expect(routes).toContainEqual({ path: '/', methods: ['get'] });
      expect(routes).toContainEqual({ path: '/:id', methods: ['get'] });
      expect(routes).toContainEqual({ path: '/', methods: ['post'] });
      expect(routes).toContainEqual({ path: '/:id', methods: ['put'] });
      expect(routes).toContainEqual({ path: '/:id', methods: ['delete'] });
    });
  });
});