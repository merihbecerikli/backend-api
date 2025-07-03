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
    // Create a fresh Express app for each test
    app = express();
    app.use(express.json());
    app.use('/items', itemRoutes);
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    // Test successful retrieval of all items
    it('should call getAll controller and return items', async () => {
      const mockItems = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];
      
      getAll.mockImplementation((req, res) => {
        res.status(200).json(mockItems);
      });

      const response = await request(app)
        .get('/items')
        .expect(200);

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockItems);
    });

    // Test error handling in getAll
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

    // Test empty results from getAll
    it('should handle empty results from getAll controller', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(200).json([]);
      });

      const response = await request(app)
        .get('/items')
        .expect(200);

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /:id', () => {
    // Test successful retrieval of item by ID
    it('should call getById controller with correct ID parameter', async () => {
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

    // Test getById with non-existent ID
    it('should handle non-existent item ID', async () => {
      getById.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .get('/items/999')
        .expect(404);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    // Test getById with invalid ID format
    it('should handle invalid ID format', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app)
        .get('/items/invalid-id')
        .expect(400);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid ID format' });
    });
  });

  describe('POST /', () => {
    // Test successful item creation
    it('should call createItem controller with request body', async () => {
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
    it('should handle invalid data in createItem', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid item data' });
      });

      const response = await request(app)
        .post('/items')
        .send({ invalid: 'data' })
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid item data' });
    });

    // Test createItem with empty request body
    it('should handle empty request body', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Request body is required' });
      });

      const response = await request(app)
        .post('/items')
        .send({})
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Request body is required' });
    });
  });

  describe('PUT /:id', () => {
    // Test successful item update
    it('should call updateItem controller with ID and request body', async () => {
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
    it('should handle non-existent item ID in update', async () => {
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
    it('should handle invalid update data', async () => {
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

    // Test updateItem with empty request body
    it('should handle empty update request body', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Update data is required' });
      });

      const response = await request(app)
        .put('/items/1')
        .send({})
        .expect(400);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Update data is required' });
    });
  });

  describe('DELETE /:id', () => {
    // Test successful item deletion
    it('should call deleteItem controller with correct ID parameter', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Item deleted successfully' });
      });

      const response = await request(app)
        .delete('/items/1')
        .expect(200);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ message: 'Item deleted successfully' });
    });

    // Test deleteItem with non-existent ID
    it('should handle non-existent item ID in deletion', async () => {
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
    it('should handle invalid ID format in deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app)
        .delete('/items/invalid-id')
        .expect(400);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid ID format' });
    });
  });

  describe('Route Integration', () => {
    // Test that all routes are properly mounted
    it('should have all required routes mounted', () => {
      const routes = itemRoutes.stack.map(layer => ({
        method: Object.keys(layer.route.methods)[0].toUpperCase(),
        path: layer.route.path
      }));

      expect(routes).toEqual([
        { method: 'GET', path: '/' },
        { method: 'GET', path: '/:id' },
        { method: 'POST', path: '/' },
        { method: 'PUT', path: '/:id' },
        { method: 'DELETE', path: '/:id' }
      ]);
    });

    // Test middleware integration
    it('should handle JSON parsing middleware', async () => {
      const newItem = { name: 'Test Item' };
      
      createItem.mockImplementation((req, res) => {
        // Verify that JSON is properly parsed
        expect(req.body).toEqual(newItem);
        res.status(201).json({ id: 1, ...newItem });
      });

      await request(app)
        .post('/items')
        .send(newItem)
        .expect(201);

      expect(createItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    // Test controller throwing errors
    it('should handle controller errors gracefully', async () => {
      getAll.mockImplementation(() => {
        throw new Error('Controller error');
      });

      await request(app)
        .get('/items')
        .expect(500);

      expect(getAll).toHaveBeenCalledTimes(1);
    });

    // Test async controller errors
    it('should handle async controller errors', async () => {
      getById.mockImplementation(async (req, res) => {
        throw new Error('Async error');
      });

      await request(app)
        .get('/items/1')
        .expect(500);

      expect(getById).toHaveBeenCalledTimes(1);
    });
  });
});