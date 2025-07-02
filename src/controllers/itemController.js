let items = require('../data/items');

const getAll = (req, res) => {
  res.json(items);
};

const getById = (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  item ? res.json(item) : res.status(404).json({ message: "Item not found" });
};

const createItem = (req, res) => {
  const newItem = {
    id: items.length + 1,
    name: req.body.name
  };
  items.push(newItem);
  res.status(201).json(newItem);
};

const updateItem = (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (item) {
    item.name = req.body.name || item.name;
    res.json(item);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
};

const deleteItem = (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    res.json({ message: "Item deleted" });
  } else {
    res.status(404).json({ message: "Item not found" });
  }
};

module.exports = {
  getAll,
  getById,
  createItem,
  updateItem,
  deleteItem
};
