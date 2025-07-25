
it('tüm öğeleri başarıyla getirmeli', async () => {
  // GET / endpoint'ine istek gönder
  const response = await request(app)
    .get('/items')
    .expect(200);

  // Yanıtın array olduğunu kontrol et
  expect(Array.isArray(response.body)).toBe(true);
  
  // Controller'ın çağrıldığını doğrula
  expect(response.status).toBe(200);
});
it('geçerli ID ile item getirmeli', async () => {
  // Mock controller fonksiyonu
  const mockItem = { id: 1, name: 'Test Item' };
  getById.mockResolvedValue(mockItem);
  
  // GET isteği gönder
  const response = await request(app)
    .get('/items/1')
    .expect(200);
  
  // Sonucu kontrol et
  expect(response.body).toEqual(mockItem);
  expect(getById).toHaveBeenCalledWith(expect.objectContaining({
    params: { id: '1' }
  }), expect.any(Object));
});
it('var olmayan ID ile item istendiğinde 404 döndürmeli', async () => {
  // Var olmayan ID ile GET isteği gönder
  const response = await request(app)
    .get('/items/999999')
    .expect(404);
  
  // Response body'de hata mesajı olmalı
  expect(response.body).toHaveProperty('message');
});
it('geçerli veri ile yeni öğe oluşturmalı', async () => {
  // Test verisi hazırla
  const newItem = {
    name: 'Test Öğesi',
    description: 'Test açıklaması',
    price: 100
  };

  // POST isteği gönder
  const response = await request(app)
    .post('/api/items')
    .send(newItem)
    .expect(201);

  // Yanıt kontrolü
  expect(response.body).toHaveProperty('id');
  expect(response.body.name).toBe(newItem.name);
  expect(response.body.description).toBe(newItem.description);
  expect(response.body.price).toBe(newItem.price);
});
it('geçerli ID ve veri ile mevcut öğeyi güncellemelidir', async () => {
  // Test verisi hazırlama
  const itemId = '123';
  const updateData = {
    name: 'Güncellenmiş Öğe',
    description: 'Güncellenmiş açıklama'
  };
  const updatedItem = { id: itemId, ...updateData };

  // Controller mock fonksiyonunu ayarlama
  updateItem.mockResolvedValue(updatedItem);

  // PUT isteği gönderme
  const response = await request(app)
    .put(`/items/${itemId}`)
    .send(updateData)
    .expect(200);

  // Yanıtı doğrulama
  expect(response.body).toEqual(updatedItem);
  expect(updateItem).toHaveBeenCalledWith(
    expect.objectContaining({
      params: { id: itemId },
      body: updateData
    }),
    expect.any(Object)
  );
});
it('geçerli ID ile öğe silmelidir', async () => {
  // Test verisi hazırla
  const itemId = '123';
  
  // DELETE isteği gönder
  const response = await request(app)
    .delete(`/items/${itemId}`)
    .expect(200);
  
  // Yanıtın başarılı olduğunu doğrula
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('message');
});