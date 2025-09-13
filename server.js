const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Schema for structured meeting documentation
const MinuteSchema = new mongoose.Schema({
  date: { type: String, required: true },
  participants: [String],
  actionItems: [
    {
      task: String,
      responsible: String,
      dueDate: String
    }
  ],
  decisions: [String],
  infoPoints: [String]
});

const Minute = mongoose.model('Minute', MinuteSchema);

// POST: Save meeting minutes
app.post('/api/minutes', async (req, res) => {
  try {
    const minute = new Minute(req.body);
    await minute.save();
    res.json({ message: 'Meeting minutes saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save minutes' });
  }
});

// GET: Retrieve all minutes
app.get('/api/minutes', async (req, res) => {
  try {
    const allMinutes = await Minute.find();
    res.json(allMinutes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch minutes' });
  }
});

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

