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
    it('should handle item not found from getById controller', async () => {
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

      const response = await request(app).get('/items/invalid');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });
  });

  describe('POST /', () => {
    // Test successful item creation
    it('should call createItem controller function with request body', async () => {
      const newItem = { name: 'New Item', description: 'Test description' };
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

    // Test validation errors in createItem
    it('should handle validation errors from createItem controller', async () => {
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

    // Test empty request body
    it('should handle empty request body', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Request body is required' });
      });

      const response = await request(app).post('/items');

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller function with ID and request body', async () => {
      const updatedItem = { name: 'Updated Item', description: 'Updated description' };
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

    // Test item not found during update
    it('should handle item not found from updateItem controller', async () => {
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

    // Test validation errors in updateItem
    it('should handle validation errors from updateItem controller', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Validation failed' });
      });

      const response = await request(app)
        .put('/items/1')
        .send({ name: '' });

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

      const response = await request(app).delete('/items/1');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Item deleted successfully' });
    });

    // Test item not found during deletion
    it('should handle item not found from deleteItem controller', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app).delete('/items/999');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    // Test internal server error during deletion
    it('should handle server errors from deleteItem controller', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Failed to delete item' });
      });

      const response = await request(app).delete('/items/1');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete item' });
    });
  });

  describe('Route Parameters', () => {
    // Test route parameter extraction
    it('should pass correct route parameters to controllers', async () => {
      getById.mockImplementation((req, res) => {
        expect(req.params.id).toBe('123');
        res.status(200).json({ id: 123 });
      });

      await request(app).get('/items/123');
      expect(getById).toHaveBeenCalledTimes(1);
    });

    // Test special characters in route parameters
    it('should handle special characters in route parameters', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      const response = await request(app).get('/items/test-item-1');
      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });
  });
});