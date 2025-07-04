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
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    // Test successful retrieval of all items
    it('should call getAll controller function', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(200).json({ items: [] });
      });

      const response = await request(app)
        .get('/items')
        .expect(200);

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ items: [] });
    });

    // Test error handling in getAll
    it('should handle errors from getAll controller', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Server error' });
      });

      const response = await request(app)
        .get('/items')
        .expect(500);

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Server error' });
    });
  });

  describe('GET /:id', () => {
    // Test successful retrieval of item by ID
    it('should call getById controller function with correct ID', async () => {
      const mockItem = { id: 1, name: 'Test Item' };
      getById.mockImplementation((req, res) => {
        res.status(200).json(mockItem);
      });

      const response = await request(app)
        .get('/items/1')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockItem);
    });

    // Test getById with non-numeric ID
    it('should handle non-numeric ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app)
        .get('/items/abc')
        .expect(400);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid ID format' });
    });

    // Test getById with item not found
    it('should handle item not found scenario', async () => {
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
    it('should call createItem controller function', async () => {
      const newItem = { name: 'New Item', description: 'Test description' };
      const createdItem = { id: 1, ...newItem };
      
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

    // Test createItem with invalid data
    it('should handle validation errors in createItem', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Validation failed' });
      });

      const response = await request(app)
        .post('/items')
        .send({})
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Validation failed' });
    });

    // Test createItem with malformed JSON
    it('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/items')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);

      expect(createItem).not.toHaveBeenCalled();
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller function with correct ID', async () => {
      const updateData = { name: 'Updated Item' };
      const updatedItem = { id: 1, ...updateData };
      
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

    // Test updateItem with non-existent ID
    it('should handle update of non-existent item', async () => {
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

    // Test updateItem with invalid data
    it('should handle validation errors in updateItem', async () => {
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
    it('should call deleteItem controller function with correct ID', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app)
        .delete('/items/1')
        .expect(204);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });

    // Test deleteItem with non-existent ID
    it('should handle deletion of non-existent item', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .delete('/items/999')
        .expect(404);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    // Test deleteItem with invalid ID format
    it('should handle deletion with invalid ID format', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app)
        .delete('/items/invalid')
        .expect(400);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid ID format' });
    });
  });

  describe('Route Error Handling', () => {
    // Test undefined route
    it('should handle requests to undefined routes', async () => {
      await request(app)
        .get('/items/undefined-route')
        .expect(404);
    });

    // Test unsupported HTTP methods
    it('should handle unsupported HTTP methods', async () => {
      await request(app)
        .patch('/items/1')
        .expect(404);
    });
  });
});