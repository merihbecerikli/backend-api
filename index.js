const express = require('express');
require('dotenv').config();
const itemRoutes = require('./src/routes/itemRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
  res.send('Hoş geldin Emirhan!');
});

app.listen(PORT, () => {
  console.log(`🚀 Sunucu ayakta: http://localhost:${PORT}`);
});
