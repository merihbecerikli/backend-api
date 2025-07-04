const request = require('supertest');
const express = require('express');
const itemRoutes = require('../routes/itemRoutes');

// Mock the itemController
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
    // Test basic functionality of getting all items
    it('should call getAll controller when GET / is requested', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(200).json({ items: [] });
      });

      const response = await request(app).get('/items');

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test that controller receives correct req and res objects
    it('should pass correct req and res objects to getAll controller', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(200).json({ success: true });
      });

      await request(app).get('/items');

      expect(getAll).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'GET' }),
        expect.objectContaining({ status: expect.any(Function) })
      );
    });
  });

  describe('GET /:id', () => {
    // Test basic functionality of getting item by ID
    it('should call getById controller when GET /:id is requested', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ item: { id: req.params.id } });
      });

      const response = await request(app).get('/items/123');

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test that ID parameter is correctly passed
    it('should pass correct ID parameter to getById controller', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app).get('/items/456');

      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: '456' } }),
        expect.objectContaining({ status: expect.any(Function) })
      );
    });

    // Test with special characters in ID
    it('should handle special characters in ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app).get('/items/abc-123_def');

      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: 'abc-123_def' } }),
        expect.objectContaining({ status: expect.any(Function) })
      );
    });
  });

  describe('POST /', () => {
    // Test basic functionality of creating item
    it('should call createItem controller when POST / is requested', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ item: req.body });
      });

      const newItem = { name: 'Test Item', description: 'Test Description' };
      const response = await request(app)
        .post('/items')
        .send(newItem);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(201);
    });

    // Test that request body is correctly passed
    it('should pass correct request body to createItem controller', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(201).json({ success: true });
      });

      const newItem = { name: 'Test Item', price: 100 };
      await request(app)
        .post('/items')
        .send(newItem);

      expect(createItem).toHaveBeenCalledWith(
        expect.objectContaining({ body: newItem }),
        expect.objectContaining({ status: expect.any(Function) })
      );
    });

    // Test with empty request body
    it('should handle empty request body', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid data' });
      });

      const response = await request(app)
        .post('/items')
        .send({});

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(createItem).toHaveBeenCalledWith(
        expect.objectContaining({ body: {} }),
        expect.objectContaining({ status: expect.any(Function) })
      );
    });
  });

  describe('PUT /:id', () => {
    // Test basic functionality of updating item
    it('should call updateItem controller when PUT /:id is requested', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ item: { ...req.body, id: req.params.id } });
      });

      const updateData = { name: 'Updated Item' };
      const response = await request(app)
        .put('/items/123')
        .send(updateData);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
    });

    // Test that ID parameter and request body are correctly passed
    it('should pass correct ID parameter and request body to updateItem controller', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ success: true });
      });

      const updateData = { name: 'Updated Item', price: 200 };
      await request(app)
        .put('/items/789')
        .send(updateData);

      expect(updateItem).toHaveBeenCalledWith(
        expect.objectContaining({ 
          params: { id: '789' },
          body: updateData 
        }),
        expect.objectContaining({ status: expect.any(Function) })
      );
    });

    // Test with partial update data
    it('should handle partial update data', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(200).json({ updated: true });
      });

      const partialData = { price: 150 };
      await request(app)
        .put('/items/456')
        .send(partialData);

      expect(updateItem).toHaveBeenCalledWith(
        expect.objectContaining({ 
          params: { id: '456' },
          body: partialData 
        }),
        expect.objectContaining({ status: expect.any(Function) })
      );
    });
  });

  describe('DELETE /:id', () => {
    // Test basic functionality of deleting item
    it('should call deleteItem controller when DELETE /:id is requested', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      const response = await request(app).delete('/items/123');

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(204);
    });

    // Test that ID parameter is correctly passed
    it('should pass correct ID parameter to deleteItem controller', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app).delete('/items/999');

      expect(deleteItem).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: '999' } }),
        expect.objectContaining({ status: expect.any(Function) })
      );
    });

    // Test with numeric ID
    it('should handle numeric ID parameter', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app).delete('/items/12345');

      expect(deleteItem).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: '12345' } }),
        expect.objectContaining({ status: expect.any(Function) })
      );
    });
  });

  describe('Route integration', () => {
    // Test that all routes are properly mounted
    it('should have all required routes defined', () => {
      const routes = itemRoutes.stack.map(layer => ({
        method: Object.keys(layer.route.methods)[0].toUpperCase(),
        path: layer.route.path
      }));

      expect(routes).toContainEqual({ method: 'GET', path: '/' });
      expect(routes).toContainEqual({ method: 'GET', path: '/:id' });
      expect(routes).toContainEqual({ method: 'POST', path: '/' });
      expect(routes).toContainEqual({ method: 'PUT', path: '/:id' });
      expect(routes).toContainEqual({ method: 'DELETE', path: '/:id' });
    });

    // Test that router is properly exported
    it('should export Express router instance', () => {
      expect(itemRoutes).toBeDefined();
      expect(typeof itemRoutes).toBe('function');
      expect(itemRoutes.stack).toBeDefined();
    });
  });
});