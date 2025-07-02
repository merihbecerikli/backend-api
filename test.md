const itemRoutes = require('../src/routes/itemRoutes');
const express = require('express');
const request = require('supertest'); // <-- Bu olmalı

const app = express();
app.use(express.json());
app.use('/api/items', itemRoutes);

describe("Item API Testleri", () => {
  // GET /api/items
  test("Tüm item'lar başarıyla getiriliyor", async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // GET /api/items/:id (başarılı)
  test("Geçerli ID ile item getiriliyor", async () => {
    const res = await request(app).get('/api/items/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name');
  });

  // GET /api/items/:id (başarısız)
  test("Geçersiz ID ile item getirilemiyor", async () => {
    const res = await request(app).get('/api/items/999');
    expect(res.statusCode).toBe(404);
  });

  // POST /api/items
  test("Yeni item başarıyla ekleniyor", async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: "Test Ürünü" });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Test Ürünü");
  });

  // PUT /api/items/:id
  test("Item başarıyla güncelleniyor", async () => {
    const res = await request(app)
      .put('/api/items/1')
      .send({ name: "Güncellenmiş Ürün" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Güncellenmiş Ürün");
  });

  // DELETE /api/items/:id
  test("Item başarıyla siliniyor", async () => {
    const res = await request(app).delete('/api/items/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', "Item deleted");
  });

  // DELETE başarısız
  test("Geçersiz ID ile silme işlemi başarısız", async () => {
    const res = await request(app).delete('/api/items/999');
    expect(res.statusCode).toBe(404);
  });
});
