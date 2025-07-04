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

    // Test with special characters in ID
    it('should handle special characters in ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ item: { id: req.params.id } });
      });

      const response = await request(app).get('/items/abc-123_test');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test controller error for non-existent item
    it('should handle non-existent item error', async () => {
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

      const itemData = { name: 'Test Item', description: 'Test Description' };
      const response = await request(app)
        .post('/items')
        .send(itemData);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(201);
    });

    // Test creation with empty body
    it('should handle empty request body', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid request body' });
      });

      const response = await request(app)
        .post('/items')
        .send({});

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });

    // Test creation with invalid data
    it('should handle invalid data format', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Validation failed' });
      });

      const response = await request(app)
        .post('/items')
        .send('invalid data');

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

      const updateData = { name: 'Updated Item' };
      const response = await request(app)
        .put('/items/123')
        .send(updateData);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test update with empty body
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

    // Test update of non-existent item
    it('should handle non-existent item update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .put('/items/999')
        .send({ name: 'Updated Item' });

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
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

    // Test deletion of non-existent item
    it('should handle non-existent item deletion', async () => {
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
        res.status(500).json({ error: 'Internal server error' });
      });

      const response = await request(app).delete('/items/123');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(500);
    });
  });

  describe('Route Parameter Validation', () => {
    // Test route with numeric ID
    it('should handle numeric IDs correctly', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ item: { id: req.params.id } });
      });

      const response = await request(app).get('/items/12345');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test route with UUID format
    it('should handle UUID format IDs', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ item: { id: req.params.id } });
      });

      const response = await request(app).get('/items/550e8400-e29b-41d4-a716-446655440000');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });
  });
});