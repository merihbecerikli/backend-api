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
    it('should call getAll controller for GET /', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(200).json({ items: [] });
      });

      const response = await request(app)
        .get('/items')
        .expect(200);

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ items: [] });
    });

    // Test error handling in getAll
    it('should handle errors from getAll controller', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Internal server error' });
      });

      const response = await request(app)
        .get('/items')
        .expect(500);

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('GET /:id', () => {
    // Test successful retrieval of item by ID
    it('should call getById controller for GET /:id', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id, name: 'Test Item' });
      });

      const response = await request(app)
        .get('/items/123')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: '123', name: 'Test Item' });
    });

    // Test getById with special characters in ID
    it('should handle special characters in ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get('/items/test-item_123')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
    });

    // Test error handling in getById
    it('should handle errors from getById controller', async () => {
      getById.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .get('/items/999')
        .expect(404);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Item not found' });
    });
  });

  describe('POST /', () => {
    // Test successful item creation
    it('should call createItem controller for POST /', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ id: '123', ...req.body });
      });

      const newItem = { name: 'New Item', description: 'Test description' };
      const response = await request(app)
        .post('/items')
        .send(newItem)
        .expect(201);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: '123', ...newItem });
    });

    // Test POST with empty body
    it('should handle empty request body', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid request body' });
      });

      const response = await request(app)
        .post('/items')
        .send({})
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid request body' });
    });

    // Test error handling in createItem
    it('should handle errors from createItem controller', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Failed to create item' });
      });

      const response = await request(app)
        .post('/items')
        .send({ name: 'Test Item' })
        .expect(500);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Failed to create item' });
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller for PUT /:id', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id, ...req.body });
      });

      const updatedItem = { name: 'Updated Item', description: 'Updated description' };
      const response = await request(app)
        .put('/items/123')
        .send(updatedItem)
        .expect(200);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: '123', ...updatedItem });
    });

    // Test PUT with empty body
    it('should handle empty request body for update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid request body' });
      });

      const response = await request(app)
        .put('/items/123')
        .send({})
        .expect(400);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid request body' });
    });

    // Test error handling in updateItem
    it('should handle errors from updateItem controller', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .put('/items/999')
        .send({ name: 'Updated Item' })
        .expect(404);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Item not found' });
    });
  });

  describe('DELETE /:id', () => {
    // Test successful item deletion
    it('should call deleteItem controller for DELETE /:id', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app)
        .delete('/items/123')
        .expect(204);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });

    // Test deletion with non-existent ID
    it('should handle deletion of non-existent item', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .delete('/items/999')
        .expect(404);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    // Test error handling in deleteItem
    it('should handle errors from deleteItem controller', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Failed to delete item' });
      });

      const response = await request(app)
        .delete('/items/123')
        .expect(500);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Failed to delete item' });
    });
  });

  describe('Route Parameter Validation', () => {
    // Test route with numeric ID
    it('should handle numeric IDs correctly', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get('/items/12345')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
    });

    // Test route with string ID
    it('should handle string IDs correctly', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get('/items/abc123')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('HTTP Method Validation', () => {
    // Test unsupported HTTP methods
    it('should return 404 for unsupported HTTP methods', async () => {
      await request(app)
        .patch('/items/123')
        .expect(404);
    });

    it('should return 404 for HEAD requests', async () => {
      await request(app)
        .head('/items')
        .expect(404);
    });
  });
});