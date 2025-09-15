const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Replace <db_password> with your actual password
const mongoURI = 'mongodb+srv://bfrauenschuh_db_user:<db_password>@minutemate.pkk3g7t.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const actionItemSchema = new mongoose.Schema({
  task: String,
  responsible: String,
  dueDate: String,
  status: String,
  tag: String,
  meetingDate: String
});

const ActionItem = mongoose.model('ActionItem', actionItemSchema);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Save action items
app.post('/api/action-items', async (req, res) => {
  try {
    const items = await ActionItem.insertMany(req.body);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all action items
app.get('/api/action-items', async (req, res) => {
  const items = await ActionItem.find();
  res.json(items);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

