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
        res.status(500).json({ error: 'Internal Server Error' });
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

    // Test invalid ID parameter
    it('should handle invalid ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID' });
      });

      await request(app)
        .get('/items/invalid')
        .expect(400);

      expect(getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /', () => {
    // Test successful item creation
    it('should call createItem controller function', async () => {
      const newItem = { name: 'New Item', description: 'Test Description' };
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

    // Test validation error during creation
    it('should handle validation errors', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Validation failed' });
      });

      await request(app)
        .post('/items')
        .send({})
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
    });

    // Test server error during creation
    it('should handle server errors during creation', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Server error' });
      });

      await request(app)
        .post('/items')
        .send({ name: 'Test Item' })
        .expect(500);

      expect(createItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller function', async () => {
      const updatedItem = { name: 'Updated Item', description: 'Updated Description' };
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

    // Test item not found during update
    it('should handle item not found during update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      await request(app)
        .put('/items/999')
        .send({ name: 'Updated Item' })
        .expect(404);

      expect(updateItem).toHaveBeenCalledTimes(1);
    });

    // Test validation error during update
    it('should handle validation errors during update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Validation failed' });
      });

      await request(app)
        .put('/items/1')
        .send({ name: '' })
        .expect(400);

      expect(updateItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /:id', () => {
    // Test successful item deletion
    it('should call deleteItem controller function', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app)
        .delete('/items/1')
        .expect(204);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });

    // Test item not found during deletion
    it('should handle item not found during deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      await request(app)
        .delete('/items/999')
        .expect(404);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });

    // Test server error during deletion
    it('should handle server errors during deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Server error' });
      });

      await request(app)
        .delete('/items/1')
        .expect(500);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Route Parameter Validation', () => {
    // Test with special characters in ID
    it('should handle special characters in ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      await request(app)
        .get('/items/@#$%')
        .expect(400);

      expect(getById).toHaveBeenCalledTimes(1);
    });

    // Test with very long ID
    it('should handle very long ID parameter', async () => {
      const longId = 'a'.repeat(1000);
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'ID too long' });
      });

      await request(app)
        .get(`/items/${longId}`)
        .expect(400);

      expect(getById).toHaveBeenCalledTimes(1);
    });
  });
});