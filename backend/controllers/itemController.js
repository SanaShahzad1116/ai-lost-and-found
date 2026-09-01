const Item = require('../models/Item');

// Create new lost/found item
const createItem = async (req, res) => {
  try {
    const { type, title, description, category, location, imageUrl } = req.body;

    const item = await Item.create({
      type,
      title,
      description,
      category,
      location,
      imageUrl,
      user: req.user.id,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all items (with optional filters)
const getItems = async (req, res) => {
  try {
    const { type, category, location } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (location) filter.location = location;

    const items = await Item.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item status
const updateItemStatus = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.status = req.body.status || item.status;
    const updatedItem = await item.save();

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createItem, getItems, getItemById, updateItemStatus };