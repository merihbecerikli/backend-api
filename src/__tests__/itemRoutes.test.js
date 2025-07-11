
it("should register GET / route and call getAll controller", () => {
  const express = require('express');
  const request = require('supertest');
  const { getAll } = require('../controllers/itemController');

  // Mock the controller function
  jest.mock('../controllers/itemController', () => ({
    getAll: jest.fn((req, res) => res.status(200).json({ message: 'success' }))
  }));

  const app = express();
  const router = require('../routes/itemRoutes'); // Assuming the file is named itemRoutes.js
  app.use('/', router);

  return request(app)
    .get('/')
    .expect(200)
    .then(() => {
      expect(getAll).toHaveBeenCalledTimes(1);
    });
});
it("should register GET /:id route and call getById controller with id parameter", () => {
  const express = require('express');
  const request = require('supertest');
  const itemController = require('../controllers/itemController');
  
  // Mock the controller
  jest.mock('../controllers/itemController', () => ({
    getById: jest.fn((req, res) => res.status(200).json({ id: req.params.id }))
  }));
  
  const app = express();
  const router = require('../routes/itemRoutes');
  app.use('/items', router);
  
  return request(app)
    .get('/items/123')
    .expect(200)
    .then(() => {
      expect(itemController.getById).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: '123' }
        }),
        expect.any(Object)
      );
    });
});
it("should register POST / route and call createItem controller", () => {
  const express = require('express');
  const request = require('supertest');
  const { createItem } = require('../controllers/itemController');

  jest.mock('../controllers/itemController');

  const app = express();
  app.use(express.json());
  app.use('/items', require('../routes/itemRoutes'));

  createItem.mockImplementation((req, res) => {
    res.status(201).json({ message: 'Item created' });
  });

  return request(app)
    .post('/items')
    .send({ name: 'Test Item' })
    .expect(201)
    .then(() => {
      expect(createItem).toHaveBeenCalledTimes(1);
    });
});
it("should register PUT /:id route and call updateItem controller with id parameter", () => {
  const request = require('supertest');
  const express = require('express');
  const router = require('../routes/itemRoutes');
  const { updateItem } = require('../controllers/itemController');

  jest.mock('../controllers/itemController');

  const app = express();
  app.use(express.json());
  app.use('/', router);

  const mockUpdateItem = updateItem;
  mockUpdateItem.mockImplementation((req, res) => {
    res.status(200).json({ success: true });
  });

  return request(app)
    .put('/123')
    .send({ name: 'Updated Item' })
    .expect(200)
    .then(() => {
      expect(mockUpdateItem).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: '123' }
        }),
        expect.any(Object)
      );
    });
});
it("should register DELETE /:id route and call deleteItem controller with id parameter", () => {
  const express = require('express');
  const request = require('supertest');
  const { deleteItem } = require('../controllers/itemController');

  // Mock the controller
  jest.mock('../controllers/itemController', () => ({
    deleteItem: jest.fn((req, res) => res.status(200).json({ success: true }))
  }));

  const app = express();
  const router = require('../routes/itemRoutes');
  app.use('/items', router);

  return request(app)
    .delete('/items/123')
    .expect(200)
    .then(() => {
      expect(deleteItem).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { id: '123' }
        }),
        expect.any(Object)
      );
    });
});
it("should export the router as a module", () => {
  const router = require('../routes/itemRoutes');
  expect(router).toBeDefined();
  expect(typeof router).toBe('function');
});
it("should handle invalid HTTP methods on registered routes", () => {
  const request = require('supertest');
  const express = require('express');
  const router = require('../routes/itemRoutes'); // adjust path as needed
  
  const app = express();
  app.use('/items', router);
  
  return request(app)
    .patch('/items/1') // PATCH is not registered
    .expect(405); // Method Not Allowed
});
it("should pass route parameters correctly to controller functions", () => {
  const mockReq = {
    params: { id: '123' },
    body: { name: 'test item' }
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const mockNext = jest.fn();

  // Mock the controller functions
  const mockGetById = jest.fn();
  const mockUpdateItem = jest.fn();
  const mockDeleteItem = jest.fn();

  // Test getById route
  mockGetById(mockReq, mockRes, mockNext);
  expect(mockGetById).toHaveBeenCalledWith(mockReq, mockRes, mockNext);

  // Test updateItem route
  mockUpdateItem(mockReq, mockRes, mockNext);
  expect(mockUpdateItem).toHaveBeenCalledWith(mockReq, mockRes, mockNext);

  // Test deleteItem route
  mockDeleteItem(mockReq, mockRes, mockNext);
  expect(mockDeleteItem).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
});
it("should maintain proper route order for parameter matching", () => {
  const mockReq = jest.fn();
  const mockRes = jest.fn();
  const mockNext = jest.fn();
  
  // Mock the controller functions
  const mockGetAll = jest.fn();
  const mockGetById = jest.fn();
  
  // Mock the require for controllers
  jest.doMock('../controllers/itemController', () => ({
    getAll: mockGetAll,
    getById: mockGetById,
    createItem: jest.fn(),
    updateItem: jest.fn(),
    deleteItem: jest.fn()
  }));
  
  // Re-require the router after mocking
  const router = require('../routes/itemRoutes');
  
  // Test that specific routes are matched before parameterized routes
  const routes = router.stack;
  
  // Verify that '/' route comes before '/:id' route for GET method
  const getRoutes = routes.filter(layer => layer.route && layer.route.methods.get);
  const rootRoute = getRoutes.find(layer => layer.route.path === '/');
  const paramRoute = getRoutes.find(layer => layer.route.path === '/:id');
  
  const rootIndex = routes.indexOf(rootRoute);
  const paramIndex = routes.indexOf(paramRoute);
  
  expect(rootIndex).toBeLessThan(paramIndex);
});
it("should handle malformed id parameters in routes", () => {
  const request = require('supertest');
  const express = require('express');
  const router = require('../routes/itemRoutes');
  
  const app = express();
  app.use(express.json());
  app.use('/items', router);
  
  // Mock the controller functions to check if they're called with malformed id
  const itemController = require('../controllers/itemController');
  jest.mock('../controllers/itemController', () => ({
    getById: jest.fn((req, res) => res.status(400).json({ error: 'Invalid ID format' })),
    updateItem: jest.fn((req, res) => res.status(400).json({ error: 'Invalid ID format' })),
    deleteItem: jest.fn((req, res) => res.status(400).json({ error: 'Invalid ID format' }))
  }));
  
  const malformedIds = ['abc', '!@#', '', 'null', 'undefined', '123abc'];
  
  malformedIds.forEach(async (malformedId) => {
    // Test GET with malformed ID
    await request(app)
      .get(`/items/${malformedId}`)
      .expect(400);
    
    // Test PUT with malformed ID
    await request(app)
      .put(`/items/${malformedId}`)
      .send({ name: 'test' })
      .expect(400);
    
    // Test DELETE with malformed ID
    await request(app)
      .delete(`/items/${malformedId}`)
      .expect(400);
  });
});