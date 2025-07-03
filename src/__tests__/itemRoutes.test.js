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
    it('should call getAll controller when GET / is requested', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(200).json({ items: [] });
      });

      const response = await request(app)
        .get('/items')
        .expect(200);

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ items: [] });
    });

    // Test controller error handling
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
    it('should call getById controller with correct ID parameter', async () => {
      const mockId = '123';
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id, name: 'Test Item' });
      });

      const response = await request(app)
        .get(`/items/${mockId}`)
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: mockId, name: 'Test Item' });
    });

    // Test with special characters in ID
    it('should handle special characters in ID parameter', async () => {
      const mockId = 'test-123_special';
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get(`/items/${mockId}`)
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
    });

    // Test not found scenario
    it('should handle item not found from getById controller', async () => {
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
    it('should call createItem controller with request body', async () => {
      const mockItem = { name: 'New Item', description: 'Test description' };
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ id: 1, ...req.body });
      });

      const response = await request(app)
        .post('/items')
        .send(mockItem)
        .expect(201);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: 1, ...mockItem });
    });

    // Test creation with empty body
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

    // Test creation validation error
    it('should handle validation errors from createItem controller', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Validation failed' });
      });

      const response = await request(app)
        .post('/items')
        .send({ name: '' })
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Validation failed' });
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller with ID and request body', async () => {
      const mockId = '123';
      const mockUpdate = { name: 'Updated Item' };
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id, ...req.body });
      });

      const response = await request(app)
        .put(`/items/${mockId}`)
        .send(mockUpdate)
        .expect(200);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: mockId, ...mockUpdate });
    });

    // Test update with non-existent ID
    it('should handle item not found during update', async () => {
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

    // Test update validation error
    it('should handle validation errors during update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid update data' });
      });

      const response = await request(app)
        .put('/items/123')
        .send({ name: '' })
        .expect(400);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid update data' });
    });
  });

  describe('DELETE /:id', () => {
    // Test successful item deletion
    it('should call deleteItem controller with correct ID parameter', async () => {
      const mockId = '123';
      deleteItem.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Item deleted successfully' });
      });

      const response = await request(app)
        .delete(`/items/${mockId}`)
        .expect(200);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ message: 'Item deleted successfully' });
    });

    // Test deletion of non-existent item
    it('should handle item not found during deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .delete('/items/999')
        .expect(404);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    // Test deletion server error
    it('should handle server errors during deletion', async () => {
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
    // Test route with encoded special characters
    it('should handle URL encoded parameters', async () => {
      const encodedId = encodeURIComponent('test@123');
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get(`/items/${encodedId}`)
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
    });

    // Test route with very long ID
    it('should handle long ID parameters', async () => {
      const longId = 'a'.repeat(100);
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get(`/items/${longId}`)
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
    });
  });
});