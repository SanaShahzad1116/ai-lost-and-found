const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
// const {
//   createItem,
//   getItems,
//   getItemById,
//   updateItemStatus,
// } = require('../controllers/itemController');

const {
  createItem,
  getItems,
  getItemById,
  updateItemStatus,
  getItemMatches,
} = require('../controllers/itemController');

router.post('/', protect, createItem);
router.get('/', getItems);
router.get('/:id', getItemById);


router.get('/:id/matches', protect, getItemMatches);
router.put('/:id/status', protect, updateItemStatus);

module.exports = router;