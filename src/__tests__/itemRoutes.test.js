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

    // Test when getAll controller throws error
    it('should handle controller errors', async () => {
      getAll.mockImplementation((req, res, next) => {
        const error = new Error('Database error');
        next(error);
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
        expect.objectContaining({
          params: { id: '123' }
        }),
        expect.any(Object),
        expect.any(Function)
      );
    });

    // Test with numeric ID
    it('should handle numeric ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get('/items/456')
        .expect(200);

      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: '456' }
        }),
        expect.any(Object),
        expect.any(Function)
      );
    });

    // Test when getById controller throws error
    it('should handle controller errors for getById', async () => {
      getById.mockImplementation((req, res, next) => {
        const error = new Error('Item not found');
        next(error);
      });

      await request(app)
        .get('/items/999')
        .expect(500);

      expect(getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /', () => {
    // Test successful item creation
    it('should call createItem controller function', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ id: 1, ...req.body });
      });

      const newItem = { name: 'Test Item', description: 'Test Description' };

      await request(app)
        .post('/items')
        .send(newItem)
        .expect(201);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(createItem).toHaveBeenCalledWith(
        expect.objectContaining({
          body: newItem
        }),
        expect.any(Object),
        expect.any(Function)
      );
    });

    // Test POST with empty body
    it('should handle empty request body', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ id: 1 });
      });

      await request(app)
        .post('/items')
        .send({})
        .expect(201);

      expect(createItem).toHaveBeenCalledTimes(1);
    });

    // Test when createItem controller throws error
    it('should handle controller errors for createItem', async () => {
      createItem.mockImplementation((req, res, next) => {
        const error = new Error('Validation error');
        next(error);
      });

      await request(app)
        .post('/items')
        .send({ name: 'Test' })
        .expect(500);

      expect(createItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller function with correct ID and body', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id, ...req.body });
      });

      const updateData = { name: 'Updated Item', description: 'Updated Description' };

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
        expect.any(Object),
        expect.any(Function)
      );
    });

    // Test PUT with empty body
    it('should handle empty update body', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .put('/items/123')
        .send({})
        .expect(200);

      expect(updateItem).toHaveBeenCalledTimes(1);
    });

    // Test when updateItem controller throws error
    it('should handle controller errors for updateItem', async () => {
      updateItem.mockImplementation((req, res, next) => {
        const error = new Error('Item not found');
        next(error);
      });

      await request(app)
        .put('/items/999')
        .send({ name: 'Updated' })
        .expect(500);

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
        expect.objectContaining({
          params: { id: '123' }
        }),
        expect.any(Object),
        expect.any(Function)
      );
    });

    // Test DELETE with numeric ID
    it('should handle numeric ID for deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app)
        .delete('/items/456')
        .expect(204);

      expect(deleteItem).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: '456' }
        }),
        expect.any(Object),
        expect.any(Function)
      );
    });

    // Test when deleteItem controller throws error
    it('should handle controller errors for deleteItem', async () => {
      deleteItem.mockImplementation((req, res, next) => {
        const error = new Error('Item not found');
        next(error);
      });

      await request(app)
        .delete('/items/999')
        .expect(500);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Route Parameter Validation', () => {
    // Test with special characters in ID
    it('should handle special characters in ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get('/items/test-123')
        .expect(200);

      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: 'test-123' }
        }),
        expect.any(Object),
        expect.any(Function)
      );
    });

    // Test with very long ID
    it('should handle long ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      const longId = 'a'.repeat(100);

      await request(app)
        .get(`/items/${longId}`)
        .expect(200);

      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: longId }
        }),
        expect.any(Object),
        expect.any(Function)
      );
    });
  });
});