const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createItem,
  getItems,
  getItemById,
  updateItemStatus,
  getItemMatches,
  getMyItems,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');

router.post('/', protect, createItem);
router.get('/', getItems);
router.get('/mine', protect, getMyItems);
router.get('/:id', getItemById);
router.get('/:id/matches', protect, getItemMatches);
router.put('/:id/status', protect, updateItemStatus);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;