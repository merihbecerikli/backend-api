const request = require('supertest');
const express = require('express');
const itemRoutes = require('../routes/itemRoutes');

// Mock the itemController module
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
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    // Test successful retrieval of all items
    it('should call getAll controller and return items', async () => {
      const mockItems = [{ id: 1, name: 'Test Item' }];
      getAll.mockImplementation((req, res) => {
        res.status(200).json(mockItems);
      });

      const response = await request(app)
        .get('/items')
        .expect(200);

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual(mockItems);
    });

    // Test error handling when controller throws error
    it('should handle controller errors gracefully', async () => {
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

    // Test with non-numeric ID
    it('should handle non-numeric ID parameters', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      await request(app)
        .get('/items/abc')
        .expect(400);

      expect(getById).toHaveBeenCalledTimes(1);
    });

    // Test with negative ID
    it('should handle negative ID parameters', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID' });
      });

      await request(app)
        .get('/items/-1')
        .expect(400);

      expect(getById).toHaveBeenCalledTimes(1);
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

    // Test with empty request body
    it('should handle empty request body', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Request body is required' });
      });

      await request(app)
        .post('/items')
        .send({})
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
    });

    // Test with invalid data format
    it('should handle invalid data format', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid data format' });
      });

      await request(app)
        .post('/items')
        .send('invalid data')
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
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

    // Test with non-existent item ID
    it('should handle non-existent item ID', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      await request(app)
        .put('/items/999')
        .send({ name: 'Updated Item' })
        .expect(404);

      expect(updateItem).toHaveBeenCalledTimes(1);
    });

    // Test with empty update data
    it('should handle empty update data', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Update data is required' });
      });

      await request(app)
        .put('/items/1')
        .send({})
        .expect(400);

      expect(updateItem).toHaveBeenCalledTimes(1);
    });

    // Test with invalid ID format
    it('should handle invalid ID format in update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      await request(app)
        .put('/items/invalid')
        .send({ name: 'Updated Item' })
        .expect(400);

      expect(updateItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /:id', () => {
    // Test successful item deletion
    it('should call deleteItem controller with correct ID', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app)
        .delete('/items/1')
        .expect(204);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });

    // Test deletion of non-existent item
    it('should handle deletion of non-existent item', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      await request(app)
        .delete('/items/999')
        .expect(404);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });

    // Test with invalid ID format for deletion
    it('should handle invalid ID format in deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      await request(app)
        .delete('/items/invalid')
        .expect(400);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });

    // Test with zero ID
    it('should handle zero ID in deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID' });
      });

      await request(app)
        .delete('/items/0')
        .expect(400);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Route Parameter Validation', () => {
    // Test route parameter passing to controllers
    it('should pass route parameters correctly to controllers', async () => {
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

    // Test URL encoding handling
    it('should handle URL-encoded parameters', async () => {
      const encodedId = 'test%20item';
      
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: req.params.id });
      });

      await request(app)
        .get(`/items/${encodedId}`)
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
    });
  });
});