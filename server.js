const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sample endpoint (extend as needed)
app.post('/api/minutes', (req, res) => {
  const { title, date, participants, actionItems, decisions, infoPoints } = req.body;
  // TODO: Save to DB or file system
  res.status(201).json({ message: 'Minutes saved successfully' });
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function addActionItem() {
  const container = document.createElement('div');
  container.className = 'action-item';
  container.innerHTML = `
    <label>Task: <input type="text" name="task" /></label>
    <label>Responsible: <input type="text" name="responsible" /></label>
    <label>Due Date: <input type="date" name="dueDate" /></label>
    <label>Status:
      <select name="status">
        <option value="open">Open</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </label>
  `;
  document.querySelector('section').appendChild(container);
}
