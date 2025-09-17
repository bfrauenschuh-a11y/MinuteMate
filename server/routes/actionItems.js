const express = require('express');
const router = express.Router();
const ActionItem = require('../models/ActionItem');

// Create
router.post('/', async (req, res) => {
  const count = await ActionItem.countDocuments();
  const item = new ActionItem({ ...req.body, number: count + 1 });
  await item.save();
  res.status(201).json(item);
});

// Read all
router.get('/', async (req, res) => {
  const items = await ActionItem.find();
  res.json(items);
});

// Search
router.get('/search', async (req, res) => {
  const { q } = req.query;
  const items = await ActionItem.find({ $text: { $search: q } });
  res.json(items);
});

// Update
router.put('/:id', async (req, res) => {
  const item = await ActionItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

// Delete
router.delete('/:id', async (req, res) => {
  await ActionItem.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
