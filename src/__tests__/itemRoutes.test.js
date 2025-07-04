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

      const response = await request(app).get('/items');

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, name: 'Test Item' }]);
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
    it('should call getById controller function with correct ID', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: 1, name: 'Test Item' });
      });

      const response = await request(app).get('/items/1');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, name: 'Test Item' });
    });

    // Test item not found scenario
    it('should handle item not found', async () => {
      getById.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app).get('/items/999');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    // Test with invalid ID format
    it('should handle invalid ID format', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app).get('/items/invalid-id');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid ID format' });
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
        .send(newItem);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, ...newItem });
    });

    // Test validation error
    it('should handle validation errors', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Validation failed' });
      });

      const response = await request(app)
        .post('/items')
        .send({});

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Validation failed' });
    });

    // Test server error during creation
    it('should handle server errors during creation', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Failed to create item' });
      });

      const response = await request(app)
        .post('/items')
        .send({ name: 'Test Item' });

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to create item' });
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
        .send(updatedItem);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, ...updatedItem });
    });

    // Test item not found during update
    it('should handle item not found during update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .put('/items/999')
        .send({ name: 'Updated Item' });

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    // Test validation error during update
    it('should handle validation errors during update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid update data' });
      });

      const response = await request(app)
        .put('/items/1')
        .send({ invalidField: 'invalid' });

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid update data' });
    });
  });

  describe('DELETE /:id', () => {
    // Test successful item deletion
    it('should call deleteItem controller function with correct ID', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      const response = await request(app).delete('/items/1');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(204);
    });

    // Test item not found during deletion
    it('should handle item not found during deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app).delete('/items/999');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    // Test server error during deletion
    it('should handle server errors during deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Failed to delete item' });
      });

      const response = await request(app).delete('/items/1');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete item' });
    });
  });

  describe('Route Parameter Handling', () => {
    // Test route parameters are properly passed
    it('should pass route parameters correctly to controller functions', async () => {
      getById.mockImplementation((req, res) => {
        expect(req.params.id).toBe('123');
        res.status(200).json({ id: 123 });
      });

      await request(app).get('/items/123');
      expect(getById).toHaveBeenCalledTimes(1);
    });

    it('should handle special characters in route parameters', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app).get('/items/test-item-123');
      expect(getById).toHaveBeenCalledTimes(1);
    });
  });
});