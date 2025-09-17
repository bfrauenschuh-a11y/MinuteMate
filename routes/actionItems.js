const express = require('express');
const router = express.Router();
const ActionItem = require('../models/ActionItem');

// Create new action item
router.post('/', async (req, res) => {
  const item = new ActionItem(req.body);
  await item.save();
  res.status(201).json(item);
});

// Get all action items
router.get('/', async (req, res) => {
  const items = await ActionItem.find();
  res.json(items);
});

// Update action item
router.put('/:id', async (req, res) => {
  const item = await ActionItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

// Delete action item
router.delete('/:id', async (req, res) => {
  await ActionItem.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
