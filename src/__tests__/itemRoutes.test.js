/**
 * Unit Tests for itemRoutes.js
 * 
 * Test Strategy:
 * - Test all HTTP route endpoints (GET, POST, PUT, DELETE)
 * - Verify correct controller function calls for each route
 * - Test route parameter extraction and middleware integration
 * - Test error handling and edge cases
 * - Ensure proper Express router functionality
 * - Test both success and failure scenarios
 * - Validate realistic request/response patterns
 */

const request = require('supertest');
const express = require('express');
const itemRoutes = require('../routes/itemRoutes');

// Mock the controller functions
const mockItemController = {
  getAll: jest.fn(),
  getById: jest.fn(),
  createItem: jest.fn(),
  updateItem: jest.fn(),
  deleteItem: jest.fn()
};

// Mock the controller module
jest.mock('../controllers/itemController', () => mockItemController);

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use('/api/items', itemRoutes);

describe('itemRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/items', () => {
    it('should call getAll controller function', async () => {
      mockItemController.getAll.mockImplementation((req, res) => {
        res.status(200).json([
          { id: 1, name: 'Laptop Computer', price: 999.99, category: 'Electronics' },
          { id: 2, name: 'Office Chair', price: 249.50, category: 'Furniture' }
        ]);
      });

      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(mockItemController.getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual([
        { id: 1, name: 'Laptop Computer', price: 999.99, category: 'Electronics' },
        { id: 2, name: 'Office Chair', price: 249.50, category: 'Furniture' }
      ]);
    });

    it('should handle empty results from getAll controller', async () => {
      mockItemController.getAll.mockImplementation((req, res) => {
        res.status(200).json([]);
      });

      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(mockItemController.getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual([]);
    });

    it('should handle server error from getAll controller', async () => {
      mockItemController.getAll.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Database connection failed' });
      });

      const response = await request(app)
        .get('/api/items')
        .expect(500);

      expect(mockItemController.getAll).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Database connection failed' });
    });
  });

  describe('GET /api/items/:id', () => {
    it('should call getById controller function with valid numeric id', async () => {
      mockItemController.getById.mockImplementation((req, res) => {
        res.status(200).json({
          id: 1,
          name: 'Wireless Headphones',
          price: 129.99,
          category: 'Electronics',
          description: 'High-quality wireless headphones with noise cancellation'
        });
      });

      const response = await request(app)
        .get('/api/items/1')
        .expect(200);

      expect(mockItemController.getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({
        id: 1,
        name: 'Wireless Headphones',
        price: 129.99,
        category: 'Electronics',
        description: 'High-quality wireless headphones with noise cancellation'
      });
    });

    it('should call getById controller function with string id', async () => {
      mockItemController.getById.mockImplementation((req, res) => {
        res.status(200).json({
          id: 'abc123',
          name: 'Custom Product',
          price: 59.99,
          category: 'Custom'
        });
      });

      const response = await request(app)
        .get('/api/items/abc123')
        .expect(200);

      expect(mockItemController.getById).toHaveBeenCalledTimes(1);
      expect(response.body.id).toBe('abc123');
    });

    it('should handle not found error from getById controller', async () => {
      mockItemController.getById.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .get('/api/items/999')
        .expect(404);

      expect(mockItemController.getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    it('should handle special characters in id parameter', async () => {
      mockItemController.getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid item ID format' });
      });

      const response = await request(app)
        .get('/api/items/@#$%')
        .expect(400);

      expect(mockItemController.getById).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid item ID format' });
    });

    it('should handle very long id parameter', async () => {
      const longId = 'a'.repeat(1000);
      mockItemController.getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'ID too long' });
      });

      const response = await request(app)
        .get(`/api/items/${longId}`)
        .expect(400);

      expect(mockItemController.getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/items', () => {
    it('should call createItem controller function with valid data', async () => {
      const newItem = {
        name: 'Gaming Mouse',
        price: 79.99,
        category: 'Electronics',
        description: 'High-precision gaming mouse with RGB lighting',
        stock: 25
      };

      mockItemController.createItem.mockImplementation((req, res) => {
        res.status(201).json({
          id: 3,
          ...newItem,
          createdAt: '2024-01-15T10:30:00Z'
        });
      });

      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .expect(201);

      expect(mockItemController.createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({
        id: 3,
        ...newItem,
        createdAt: '2024-01-15T10:30:00Z'
      });
    });

    it('should handle validation error from createItem controller', async () => {
      const invalidItem = {
        name: '',
        price: -10,
        category: null
      };

      mockItemController.createItem.mockImplementation((req, res) => {
        res.status(400).json({
          error: 'Validation failed',
          details: ['Name is required', 'Price must be positive', 'Category is required']
        });
      });

      const response = await request(app)
        .post('/api/items')
        .send(invalidItem)
        .expect(400);

      expect(mockItemController.createItem).toHaveBeenCalledTimes(1);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should handle empty request body', async () => {
      mockItemController.createItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Request body cannot be empty' });
      });

      const response = await request(app)
        .post('/api/items')
        .send({})
        .expect(400);

      expect(mockItemController.createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Request body cannot be empty' });
    });

    it('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/items')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      // Express middleware should catch this before reaching controller
      expect(mockItemController.createItem).not.toHaveBeenCalled();
    });

    it('should handle duplicate item creation', async () => {
      const duplicateItem = {
        name: 'Existing Product',
        price: 99.99,
        category: 'Electronics'
      };

      mockItemController.createItem.mockImplementation((req, res) => {
        res.status(409).json({ error: 'Item already exists' });
      });

      const response = await request(app)
        .post('/api/items')
        .send(duplicateItem)
        .expect(409);

      expect(mockItemController.createItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Item already exists' });
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should call updateItem controller function with valid data', async () => {
      const updateData = {
        name: 'Updated Gaming Mouse',
        price: 89.99,
        category: 'Electronics',
        description: 'Updated description with new features',
        stock: 15
      };

      mockItemController.updateItem.mockImplementation((req, res) => {
        res.status(200).json({
          id: 1,
          ...updateData,
          updatedAt: '2024-01-15T11:45:00Z'
        });
      });

      const response = await request(app)
        .put('/api/items/1')
        .send(updateData)
        .expect(200);

      expect(mockItemController.updateItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({
        id: 1,
        ...updateData,
        updatedAt: '2024-01-15T11:45:00Z'
      });
    });

    it('should handle partial update with some fields', async () => {
      const partialUpdate = {
        price: 69.99,
        stock: 30
      };

      mockItemController.updateItem.mockImplementation((req, res) => {
        res.status(200).json({
          id: 2,
          name: 'Existing Product Name',
          price: 69.99,
          category: 'Electronics',
          stock: 30,
          updatedAt: '2024-01-15T12:00:00Z'
        });
      });

      const response = await request(app)
        .put('/api/items/2')
        .send(partialUpdate)
        .expect(200);

      expect(mockItemController.updateItem).toHaveBeenCalledTimes(1);
      expect(response.body.price).toBe(69.99);
      expect(response.body.stock).toBe(30);
    });

    it('should handle not found error for non-existent item', async () => {
      const updateData = {
        name: 'Non-existent Product',
        price: 99.99
      };

      mockItemController.updateItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .put('/api/items/999')
        .send(updateData)
        .expect(404);

      expect(mockItemController.updateItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    it('should handle validation error in update', async () => {
      const invalidUpdate = {
        name: '',
        price: 'invalid_price',
        category: 123
      };

      mockItemController.updateItem.mockImplementation((req, res) => {
        res.status(400).json({
          error: 'Validation failed',
          details: ['Name cannot be empty', 'Price must be a number', 'Category must be a string']
        });
      });

      const response = await request(app)
        .put('/api/items/1')
        .send(invalidUpdate)
        .expect(400);

      expect(mockItemController.updateItem).toHaveBeenCalledTimes(1);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should handle empty update request body', async () => {
      mockItemController.updateItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'No update data provided' });
      });

      const response = await request(app)
        .put('/api/items/1')
        .send({})
        .expect(400);

      expect(mockItemController.updateItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'No update data provided' });
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should call deleteItem controller function with valid id', async () => {
      mockItemController.deleteItem.mockImplementation((req, res) => {
        res.status(200).json({
          message: 'Item deleted successfully',
          deletedId: 1
        });
      });

      const response = await request(app)
        .delete('/api/items/1')
        .expect(200);

      expect(mockItemController.deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({
        message: 'Item deleted successfully',
        deletedId: 1
      });
    });

    it('should handle not found error for non-existent item', async () => {
      mockItemController.deleteItem.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Item not found' });
      });

      const response = await request(app)
        .delete('/api/items/999')
        .expect(404);

      expect(mockItemController.deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Item not found' });
    });

    it('should handle deletion with dependencies', async () => {
      mockItemController.deleteItem.mockImplementation((req, res) => {
        res.status(409).json({
          error: 'Cannot delete item',
          reason: 'Item is referenced by existing orders'
        });
      });

      const response = await request(app)
        .delete('/api/items/1')
        .expect(409);

      expect(mockItemController.deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body.error).toBe('Cannot delete item');
    });

    it('should handle server error during deletion', async () => {
      mockItemController.deleteItem.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Internal server error during deletion' });
      });

      const response = await request(app)
        .delete('/api/items/1')
        .expect(500);

      expect(mockItemController.deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Internal server error during deletion' });
    });

    it('should handle invalid id format in delete request', async () => {
      mockItemController.deleteItem.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app)
        .delete('/api/items/invalid-id-format')
        .expect(400);

      expect(mockItemController.deleteItem).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ error: 'Invalid ID format' });
    });
  });

  describe('Route parameter extraction', () => {
    it('should properly extract id parameter for GET requests', async () => {
      mockItemController.getById.mockImplementation((req, res) => {
        expect(req.params.id).toBe('123');
        res.status(200).json({ id: '123' });
      });

      await request(app)
        .get('/api/items/123')
        .expect(200);

      expect(mockItemController.getById).toHaveBeenCalledTimes(1);
    });

    it('should properly extract id parameter for PUT requests', async () => {
      mockItemController.updateItem.mockImplementation((req, res) => {
        expect(req.params.id).toBe('456');
        res.status(200).json({ id: '456' });
      });

      await request(app)
        .put('/api/items/456')
        .send({ name: 'Test' })
        .expect(200);

      expect(mockItemController.updateItem).toHaveBeenCalledTimes(1);
    });

    it('should properly extract id parameter for DELETE requests', async () => {
      mockItemController.deleteItem.mockImplementation((req, res) => {
        expect(req.params.id).toBe('789');
        res.status(200).json({ deletedId: '789' });
      });

      await request(app)
        .delete('/api/items/789')
        .expect(200);

      expect(mockItemController.deleteItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('HTTP method validation', () => {
    it('should reject unsupported HTTP methods', async () => {
      const response = await request(app)
        .patch('/api/items/1')
        .send({ name: 'Test' })
        .expect(404);

      expect(response.status).toBe(404);
    });

    it('should reject OPTIONS method', async () => {
      const response = await request(app)
        .options('/api/items')
        .expect(404);

      expect(response.status).toBe(404);
    });

    it('should reject HEAD method', async () => {
      const response = await request(app)
        .head('/api/items')
        .expect(404);

      expect(response.status).toBe(404);
    });
  });
});