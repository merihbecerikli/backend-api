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
      const mockItems = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
      getAll.mockImplementation((req, res) => {
        res.status(200).json(mockItems);
      });

      const response = await request(app)
        .get('/items')
        .expect(200);

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockItems);
    });

    // Test controller error handling
    it('should handle controller errors when GET / fails', async () => {
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
    it('should call getById controller when GET /:id is requested', async () => {
      const mockItem = { id: 1, name: 'Item 1' };
      getById.mockImplementation((req, res) => {
        res.status(200).json(mockItem);
      });

      const response = await request(app)
        .get('/items/1')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockItem);
    });

    // Test with different ID formats
    it('should handle string IDs correctly', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      const response = await request(app)
        .get('/items/abc123')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: 'abc123' });
    });

    // Test not found scenario
    it('should handle item not found when GET /:id fails', async () => {
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
    it('should call createItem controller when POST / is requested', async () => {
      const newItem = { name: 'New Item' };
      const createdItem = { id: 1, name: 'New Item' };
      
      createItem.mockImplementation((req, res) => {
        res.status(201).json(createdItem);
      });

      const response = await request(app)
        .post('/items')
        .send(newItem)
        .expect(201);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(createdItem);
    });

    // Test validation error
    it('should handle validation errors when POST / fails', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid input data' });
      });

      const response = await request(app)
        .post('/items')
        .send({})
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid input data' });
    });

    // Test with malformed JSON
    it('should handle malformed JSON in POST request', async () => {
      const response = await request(app)
        .post('/items')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(createItem).not.toHaveBeenCalled();
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller when PUT /:id is requested', async () => {
      const updateData = { name: 'Updated Item' };
      const updatedItem = { id: 1, name: 'Updated Item' };
      
      updateItem.mockImplementation((req, res) => {
        res.status(200).json(updatedItem);
      });

      const response = await request(app)
        .put('/items/1')
        .send(updateData)
        .expect(200);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(updatedItem);
    });

    // Test item not found for update
    it('should handle item not found when PUT /:id fails', async () => {
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

    // Test validation error on update
    it('should handle validation errors when PUT /:id fails', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid update data' });
      });

      const response = await request(app)
        .put('/items/1')
        .send({ invalid: 'data' })
        .expect(400);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid update data' });
    });
  });

  describe('DELETE /:id', () => {
    // Test successful item deletion
    it('should call deleteItem controller when DELETE /:id is requested', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app)
        .delete('/items/1')
        .expect(204);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });

    // Test item not found for deletion
    it('should handle item not found when DELETE /:id fails', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .delete('/items/999')
        .expect(404);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    // Test server error during deletion
    it('should handle server errors when DELETE /:id fails', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Failed to delete item' });
      });

      const response = await request(app)
        .delete('/items/1')
        .expect(500);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Failed to delete item' });
    });
  });

  describe('Route parameter handling', () => {
    // Test route parameter extraction
    it('should pass correct parameters to controllers', async () => {
      const testId = '123';
      getById.mockImplementation((req, res) => {
        expect(req.params.id).toBe(testId);
        res.status(200).json({ id: testId });
      });

      await request(app)
        .get(`/items/${testId}`)
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
    });

    // Test special characters in parameters
    it('should handle special characters in route parameters', async () => {
      const specialId = 'item-123_test';
      getById.mockImplementation((req, res) => {
        expect(req.params.id).toBe(specialId);
        res.status(200).json({ id: specialId });
      });

      await request(app)
        .get(`/items/${specialId}`)
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('HTTP method validation', () => {
    // Test unsupported HTTP methods
    it('should return 404 for unsupported methods on root path', async () => {
      await request(app)
        .patch('/items')
        .expect(404);
    });

    it('should return 404 for unsupported methods on parameterized path', async () => {
      await request(app)
        .patch('/items/1')
        .expect(404);
    });
  });
});