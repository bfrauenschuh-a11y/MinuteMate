const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Define schema and model
const MinuteSchema = new mongoose.Schema({
  title: String,
  date: String,
  participants: [String],
  notes: String
});

const Minute = mongoose.model('Minute', MinuteSchema);

// API endpoint to save minutes
app.post('/api/minutes', async (req, res) => {
  try {
    const minute = new Minute(req.body);
    await minute.save();
    res.json({ message: 'Meeting minutes saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save minutes' });
  }
});

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
