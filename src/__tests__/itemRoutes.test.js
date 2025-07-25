
it('should get all items successfully', async () => {
  const mockItems = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];
  
  const getAll = require('../controllers/itemController').getAll;
  getAll.mockResolvedValue(mockItems);
  
  const response = await request(app)
    .get('/')
    .expect(200);
    
  expect(response.body).toEqual(mockItems);
  expect(getAll).toHaveBeenCalledTimes(1);
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
    
  expect(mockGetById).toHaveBeenCalledWith(expect.objectContaining({
    params: { id: '1' }
  }), expect.any(Object));
  expect(response.body).toEqual(mockItem);
});
it('should return 404 when getting item by non-existent id', async () => {
  const response = await request(app)
    .get('/items/999')
    .expect(404);
});
it('should create new item with valid data', async () => {
  const newItem = {
    name: 'Test Item',
    description: 'Test Description',
    price: 29.99
  };

  const response = await request(app)
    .post('/items')
    .send(newItem)
    .expect(201);

  expect(response.body).toHaveProperty('id');
  expect(response.body.name).toBe(newItem.name);
  expect(response.body.description).toBe(newItem.description);
  expect(response.body.price).toBe(newItem.price);
});
it('should return 400 when creating item with invalid data', async () => {
  const invalidData = { name: '', price: -1 };
  
  const response = await request(app)
    .post('/api/items')
    .send(invalidData)
    .expect(400);
    
  expect(response.body).toHaveProperty('error');
});
it('should update existing item successfully', async () => {
  const itemId = '123';
  const updateData = { name: 'Updated Item', description: 'Updated description' };
  const updatedItem = { id: itemId, ...updateData };

  const mockUpdateItem = jest.fn().mockResolvedValue(updatedItem);
  require('../controllers/itemController').updateItem = mockUpdateItem;

  const response = await request(app)
    .put(`/api/items/${itemId}`)
    .send(updateData)
    .expect(200);

  expect(mockUpdateItem).toHaveBeenCalledWith(
    expect.objectContaining({
      params: { id: itemId },
      body: updateData
    }),
    expect.any(Object)
  );
  expect(response.body).toEqual(updatedItem);
});
it('should return 404 when updating non-existent item', async () => {
  const response = await request(app)
    .put('/items/999999')
    .send({ name: 'Updated Item' });
  
  expect(response.status).toBe(404);
});
it('should delete existing item successfully', async () => {
  const itemId = '123';
  const mockDeletedItem = { id: itemId, name: 'Test Item' };
  
  const mockDeleteItem = jest.fn().mockResolvedValue(mockDeletedItem);
  
  jest.doMock('../controllers/itemController', () => ({
    deleteItem: mockDeleteItem
  }));
  
  const response = await request(app)
    .delete(`/items/${itemId}`)
    .expect(200);
  
  expect(mockDeleteItem).toHaveBeenCalledTimes(1);
  expect(response.body).toEqual(mockDeletedItem);
});
it('should return 404 when deleting non-existent item', async () => {
  const response = await request(app)
    .delete('/items/999')
    .expect(404);
    
  expect(response.body).toHaveProperty('error');
  expect(response.body.error).toMatch(/not found|does not exist/i);
});