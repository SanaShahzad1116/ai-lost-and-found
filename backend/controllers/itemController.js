const axios = require('axios');
const Notification = require('../models/Notification');
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

    // AI se background mein check karo koi high-confidence match to nahi (response ko block nahi karta)
    checkForAutoMatch(item).catch((err) => console.error('Auto-match check failed:', err.message));

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper: naye item ke liye AI service se check karo, agar strong match mile to dono users ko notify karo
const checkForAutoMatch = async (item) => {
  const response = await axios.get(`${process.env.AI_SERVICE_URL}/match/${item._id}`);
  const matches = response.data.matches || [];
  const topMatch = matches[0];

  const SIMILARITY_THRESHOLD = 0.75;

  if (topMatch && topMatch.similarity >= SIMILARITY_THRESHOLD) {
    const matchedItem = await Item.findById(topMatch.id);
    if (!matchedItem) return;

    await Notification.create({
      user: item.user,
      message: `We found a possible match for your "${item.title}" post: "${topMatch.title}"`,
      item: matchedItem._id,
    });

    await Notification.create({
      user: matchedItem.user,
      message: `Someone posted a "${item.type}" item that might match your "${matchedItem.title}" post`,
      item: item._id,
    });
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


const axios = require('axios');

// Get AI-suggested matches for an item
const getItemMatches = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.AI_SERVICE_URL}/match/${req.params.id}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch matches', error: error.message });
  }
};
// Get logged-in user's own items
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit an item (only by its owner)
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this item' });
    }

    const { title, description, category, location, imageUrl, status } = req.body;
    item.title = title ?? item.title;
    item.description = description ?? item.description;
    item.category = category ?? item.category;
    item.location = location ?? item.location;
    item.imageUrl = imageUrl ?? item.imageUrl;
    item.status = status ?? item.status;

    const updated = await item.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an item (only by its owner)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItemStatus,
  getItemMatches,
  getMyItems,
  updateItem,
  deleteItem,
};