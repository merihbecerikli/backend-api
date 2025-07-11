
it('should get all items successfully', async () => {
  const response = await request(app)
    .get('/items')
    .expect(200);
  
  expect(response.body).toBeDefined();
  expect(Array.isArray(response.body)).toBe(true);
});
it('should get item by id when item exists', async () => {
  const mockItem = { id: 1, name: 'Test Item', description: 'Test Description' };
  const mockGetById = jest.fn().mockResolvedValue(mockItem);
  
  jest.doMock('../controllers/itemController', () => ({
    getById: mockGetById
  }));
  
  const response = await request(app)
    .get('/items/1')
    .expect(200);
    
  expect(response.body).toEqual(mockItem);
  expect(mockGetById).toHaveBeenCalledWith(expect.objectContaining({
    params: { id: '1' }
  }), expect.any(Object));
});
it('should return 404 when getting item by non-existent id', async () => {
  const response = await request(app)
    .get('/api/items/999')
    .expect(404);
});
it('should create new item with valid data', async () => {
  const newItem = {
    name: 'Test Item',
    description: 'Test Description'
  };

  const response = await request(app)
    .post('/api/items')
    .send(newItem)
    .expect(201);

  expect(response.body).toHaveProperty('id');
  expect(response.body.name).toBe(newItem.name);
  expect(response.body.description).toBe(newItem.description);
});
it('should update existing item with valid data', async () => {
  const itemId = 1;
  const updatedData = { name: 'Updated Item', description: 'Updated description' };
  const mockUpdatedItem = { id: itemId, ...updatedData };

  require('../controllers/itemController').updateItem.mockResolvedValue(mockUpdatedItem);

  const response = await request(app)
    .put(`/items/${itemId}`)
    .send(updatedData)
    .expect(200);

  expect(response.body).toEqual(mockUpdatedItem);
  expect(require('../controllers/itemController').updateItem).toHaveBeenCalledWith(
    expect.objectContaining({
      params: { id: itemId.toString() },
      body: updatedData
    }),
    expect.any(Object)
  );
});
it('should delete item by id when item exists', async () => {
  const mockDeleteItem = jest.fn().mockResolvedValue({ success: true });
  const mockReq = {
    params: { id: '123' }
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  require('../controllers/itemController').deleteItem = mockDeleteItem;

  await request(app)
    .delete('/items/123')
    .expect(200);

  expect(mockDeleteItem).toHaveBeenCalledWith(mockReq, mockRes);
});