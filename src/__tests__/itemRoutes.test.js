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

      const response = await request(app)
        .get('/items/')
        .expect(200);

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ items: [] });
    });

    // Test error handling in getAll
    it('should handle errors from getAll controller', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Server error' });
      });

      await request(app)
        .get('/items/')
        .expect(500);

      expect(getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /:id', () => {
    // Test successful retrieval of item by ID
    it('should call getById controller function with correct ID', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id, name: 'Test Item' });
      });

      const response = await request(app)
        .get('/items/123')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: '123', name: 'Test Item' });
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

    // Test with special characters in ID
    it('should handle special characters in ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get('/items/test-item-123')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /', () => {
    // Test successful item creation
    it('should call createItem controller function', async () => {
      const newItem = { name: 'New Item', description: 'Test description' };
      
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ id: 1, ...req.body });
      });

      const response = await request(app)
        .post('/items/')
        .send(newItem)
        .expect(201);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: 1, ...newItem });
    });

    // Test validation error handling
    it('should handle validation errors', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Validation failed' });
      });

      await request(app)
        .post('/items/')
        .send({})
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
    });

    // Test with malformed JSON
    it('should handle malformed JSON', async () => {
      await request(app)
        .post('/items/')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller function with correct ID', async () => {
      const updatedItem = { name: 'Updated Item', description: 'Updated description' };
      
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id, ...req.body });
      });

      const response = await request(app)
        .put('/items/123')
        .send(updatedItem)
        .expect(200);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: '123', ...updatedItem });
    });

    // Test item not found for update
    it('should handle item not found for update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      await request(app)
        .put('/items/999')
        .send({ name: 'Updated Item' })
        .expect(404);

      expect(updateItem).toHaveBeenCalledTimes(1);
    });

    // Test update with empty body
    it('should handle update with empty body', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'No data provided' });
      });

      await request(app)
        .put('/items/123')
        .send({})
        .expect(400);

      expect(updateItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /:id', () => {
    // Test successful item deletion
    it('should call deleteItem controller function with correct ID', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app)
        .delete('/items/123')
        .expect(204);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });

    // Test item not found for deletion
    it('should handle item not found for deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      await request(app)
        .delete('/items/999')
        .expect(404);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });

    // Test deletion with invalid ID format
    it('should handle deletion with invalid ID format', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      await request(app)
        .delete('/items/invalid-id')
        .expect(400);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Route parameter handling', () => {
    // Test that route parameters are correctly passed to controllers
    it('should pass route parameters correctly to controllers', async () => {
      const testId = 'test-123';
      
      getById.mockImplementation((req, res) => {
        expect(req.params.id).toBe(testId);
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get(`/items/${testId}`)
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('Middleware integration', () => {
    // Test that Express middleware works correctly with routes
    it('should parse JSON request bodies correctly', async () => {
      const testData = { name: 'Test', value: 42 };
      
      createItem.mockImplementation((req, res) => {
        expect(req.body).toEqual(testData);
        res.status(201).json(req.body);
      });

      await request(app)
        .post('/items/')
        .send(testData)
        .expect(201);

      expect(createItem).toHaveBeenCalledTimes(1);
    });
  });
});