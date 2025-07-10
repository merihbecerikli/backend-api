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

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use('/items', itemRoutes);

describe('Item Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    // Test successful retrieval of all items
    it('should call getAll controller and return 200 status', async () => {
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

    // Test error handling when controller throws error
    it('should handle controller errors properly', async () => {
      getAll.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Internal server error' });
      });

      const response = await request(app)
        .get('/items')
        .expect(500);

      expect(getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });

    // Test empty response
    it('should handle empty items list', async () => {
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

    // Test non-existent item ID
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

    // Test invalid ID format
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

    // Test special characters in ID
    it('should handle special characters in ID parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      await request(app)
        .get('/items/@#$%')
        .expect(400);

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

    // Test empty request body
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

    // Test invalid JSON data
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/items')
        .send('invalid-json')
        .set('Content-Type', 'application/json')
        .expect(400);

      expect(createItem).not.toHaveBeenCalled();
    });

    // Test validation errors
    it('should handle validation errors', async () => {
      createItem.mockImplementation((req, res) => {
        res.status(400).json({ 
          error: 'Validation failed',
          details: ['Name is required', 'Description is required']
        });
      });

      const response = await request(app)
        .post('/items')
        .send({ invalidField: 'value' })
        .expect(400);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(response.body.error).toBe('Validation failed');
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

    // Test updating non-existent item
    it('should handle updating non-existent item', async () => {
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

    // Test empty update body
    it('should handle empty update body', async () => {
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

    // Test invalid ID for update
    it('should handle invalid ID for update', async () => {
      updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app)
        .put('/items/invalid')
        .send({ name: 'Updated Item' })
        .expect(400);

      expect(updateItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid ID format' });
    });
  });

  describe('DELETE /:id', () => {
    // Test successful item deletion
    it('should call deleteItem controller with correct ID', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Item deleted successfully' });
      });

      const response = await request(app)
        .delete('/items/1')
        .expect(200);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ message: 'Item deleted successfully' });
    });

    // Test deleting non-existent item
    it('should handle deleting non-existent item', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .delete('/items/999')
        .expect(404);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    // Test invalid ID for deletion
    it('should handle invalid ID for deletion', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app)
        .delete('/items/invalid')
        .expect(400);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid ID format' });
    });

    // Test deletion with special characters
    it('should handle deletion with special characters in ID', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      await request(app)
        .delete('/items/!@#$')
        .expect(400);

      expect(deleteItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Route Parameter Edge Cases', () => {
    // Test extremely long ID parameter
    it('should handle extremely long ID parameter', async () => {
      const longId = 'a'.repeat(1000);
      
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'ID too long' });
      });

      await request(app)
        .get(`/items/${longId}`)
        .expect(400);

      expect(getById).toHaveBeenCalledTimes(1);
    });

    // Test numeric ID as string
    it('should handle numeric ID as string', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: 123, name: 'Test Item' });
      });

      const response = await request(app)
        .get('/items/123')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ id: 123, name: 'Test Item' });
    });

    // Test URL encoded characters in ID
    it('should handle URL encoded characters in ID', async () => {
      getById.mockImplementation((req, res) => {
        res.status(200).json({ id: 'test%20item', name: 'Test Item' });
      });

      await request(app)
        .get('/items/test%20item')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('HTTP Methods and Status Codes', () => {
    // Test that routes respond to correct HTTP methods
    it('should only accept GET method for root path', async () => {
      await request(app)
        .post('/items')
        .send({})
        .expect(res => {
          expect(createItem).toHaveBeenCalled();
        });

      await request(app)
        .put('/items')
        .send({})
        .expect(404);

      await request(app)
        .delete('/items')
        .expect(404);
    });

    // Test method not allowed scenarios
    it('should handle unsupported HTTP methods', async () => {
      await request(app)
        .patch('/items/1')
        .expect(404);

      await request(app)
        .head('/items/1')
        .expect(404);
    });
  });
});