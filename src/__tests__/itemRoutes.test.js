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
        res.status(200).json({ items: [] });
      });

      await request(app)
        .get('/items')
        .expect(200);

      expect(getAll).toHaveBeenCalledTimes(1);
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
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get('/items/123')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: '123' } }),
        expect.any(Object)
      );
    });

    // Test with special characters in ID
    it('should handle special characters in ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get('/items/test-item-123')
        .expect(200);

      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: 'test-item-123' } }),
        expect.any(Object)
      );
    });

    // Test error handling for non-existent item
    it('should handle not found error from getById controller', async () => {
      getById.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      await request(app)
        .get('/items/nonexistent')
        .expect(404);

      expect(getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /', () => {
    // Test successful item creation
    it('should call createItem controller function with request body', async () => {
      const newItem = { name: 'Test Item', description: 'Test description' };
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ id: 1, ...req.body });
      });

      await request(app)
        .post('/items')
        .send(newItem)
        .expect(201);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(createItem).toHaveBeenCalledWith(
        expect.objectContaining({ body: newItem }),
        expect.any(Object)
      );
    });

    // Test validation error handling
    it('should handle validation errors from createItem controller', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Validation failed' });
      });

      await request(app)
        .post('/items')
        .send({})
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
    });

    // Test with empty request body
    it('should handle empty request body', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Request body is required' });
      });

      await request(app)
        .post('/items')
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller function with ID and body', async () => {
      const updateData = { name: 'Updated Item' };
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id, ...req.body });
      });

      await request(app)
        .put('/items/123')
        .send(updateData)
        .expect(200);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(updateItem).toHaveBeenCalledWith(
        expect.objectContaining({ 
          params: { id: '123' },
          body: updateData
        }),
        expect.any(Object)
      );
    });

    // Test update with non-existent ID
    it('should handle not found error from updateItem controller', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      await request(app)
        .put('/items/nonexistent')
        .send({ name: 'Updated Item' })
        .expect(404);

      expect(updateItem).toHaveBeenCalledTimes(1);
    });

    // Test update with invalid data
    it('should handle validation errors from updateItem controller', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid data' });
      });

      await request(app)
        .put('/items/123')
        .send({ invalidField: 'value' })
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
      expect(deleteItem).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: '123' } }),
        expect.any(Object)
      );
    });

    // Test deletion of non-existent item
    it('should handle not found error from deleteItem controller', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      await request(app)
        .delete('/items/nonexistent')
        .expect(404);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });

    // Test deletion with invalid ID format
    it('should handle invalid ID format', async () => {
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
    // Test route parameter extraction
    it('should correctly extract and pass route parameters', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ receivedId: req.params.id });
      });

      await request(app)
        .get('/items/abc123')
        .expect(200);

      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: 'abc123' } }),
        expect.any(Object)
      );
    });

    // Test with numeric ID
    it('should handle numeric IDs as strings', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ receivedId: req.params.id });
      });

      await request(app)
        .get('/items/12345')
        .expect(200);

      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: '12345' } }),
        expect.any(Object)
      );
    });
  });
});