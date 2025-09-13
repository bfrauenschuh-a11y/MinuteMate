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

const puppeteer = require('puppeteer');

app.get('/api/minutes/:id/pdf', async (req, res) => {
  const minute = await Minute.findById(req.params.id);
  if (!minute) return res.status(404).send('Minute not found');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { display: flex; align-items: center; margin-bottom: 20px; }
        .logo { height: 60px; margin-right: 20px; }
        h1 { font-size: 24px; margin: 0; }
        .section { margin-top: 20px; }
        .section h2 { font-size: 18px; margin-bottom: 5px; }
        .section p, .section ul { margin: 0; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://yourdomain.com/logo.png" class="logo" />
        <h1>Meeting Minutes – ${minute.date}</h1>
      </div>

      <div class="section">
        <h2>Participants</h2>
        <p>${minute.participants.join(', ')}</p>
      </div>

      <div class="section">
        <h2>Action Items</h2>
        <ul>
          ${minute.actionItems.map(item => `
            <li>${item.task} – ${item.responsible} (Due: ${item.dueDate})</li>
          `).join('')}
        </ul>
      </div>

      <div class="section">
        <h2>Decisions</h2>
        <ul>
          ${minute.decisions.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <h2>Information Points</h2>
        <ul>
          ${minute.infoPoints.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>
    </body>
    </html>
  `;

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  res.contentType('application/pdf');
  res.send(pdf);
});

function downloadPDF(id) {
  window.open(`/api/minutes/${id}/pdf`, '_blank');
}

