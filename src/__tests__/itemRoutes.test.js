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

const app = express();
app.use(express.json());
app.use('/items', itemRoutes);

describe('Item Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    // Test successful retrieval of all items
    it('should call getAll controller and return items', async () => {
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
  });

  describe('GET /:id', () => {
    // Test successful retrieval of item by ID
    it('should call getById controller with correct id parameter', async () => {
      const mockItem = { id: 1, name: 'Item 1' };
      getById.mockImplementation((req, res) => {
        res.status(200).json(mockItem);
      });

      const response = await request(app)
        .get('/items/1')
        .expect(200);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: '1' } }),
        expect.any(Object)
      );
      expect(response.body).toEqual(mockItem);
    });

    // Test getById with non-numeric ID
    it('should handle non-numeric id parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      const response = await request(app)
        .get('/items/abc')
        .expect(400);

      expect(getById).toHaveBeenCalledTimes(1);
      expect(getById).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: 'abc' } }),
        expect.any(Object)
      );
    });

    // Test getById with special characters in ID
    it('should handle special characters in id parameter', async () => {
      getById.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Invalid ID format' });
      });

      await request(app)
        .get('/items/@#$')
        .expect(400);

      expect(getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /', () => {
    // Test successful item creation
    it('should call createItem controller with request body', async () => {
      const newItem = { name: 'New Item', description: 'Test item' };
      const createdItem = { id: 1, ...newItem };
      
      createItem.mockImplementation((req, res) => {
        res.status(201).json(createdItem);
      });

      const response = await request(app)
        .post('/items')
        .send(newItem)
        .expect(201);

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(createItem).toHaveBeenCalledWith(
        expect.objectContaining({ body: newItem }),
        expect.any(Object)
      );
      expect(response.body).toEqual(createdItem);
    });

    // Test createItem with empty body
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

    // Test createItem with invalid JSON
    it('should handle malformed JSON in request body', async () => {
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
    it('should call updateItem controller with id and request body', async () => {
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
      expect(updateItem).toHaveBeenCalledWith(
        expect.objectContaining({ 
          params: { id: '1' },
          body: updateData
        }),
        expect.any(Object)
      );
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

    // Test updateItem with empty body
    it('should handle empty update data', async () => {
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
    it('should call deleteItem controller with correct id parameter', async () => {
      deleteItem.mockImplementation((req, res) => {
        res.status(204).send();
      });

      await request(app)
        .delete('/items/1')
        .expect(204);

      expect(deleteItem).toHaveBeenCalledTimes(1);
      expect(deleteItem).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: '1' } }),
        expect.any(Object)
      );
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
    it('should handle invalid id format in delete request', async () => {
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

  describe('Route Configuration', () => {
    // Test that all routes are properly configured
    it('should have all required routes configured', () => {
      const routes = [];
      itemRoutes.stack.forEach(layer => {
        if (layer.route) {
          const path = layer.route.path;
          const methods = Object.keys(layer.route.methods);
          routes.push({ path, methods });
        }
      });

      expect(routes).toContainEqual({ path: '/', methods: ['get'] });
      expect(routes).toContainEqual({ path: '/:id', methods: ['get'] });
      expect(routes).toContainEqual({ path: '/', methods: ['post'] });
      expect(routes).toContainEqual({ path: '/:id', methods: ['put'] });
      expect(routes).toContainEqual({ path: '/:id', methods: ['delete'] });
    });
  });
});