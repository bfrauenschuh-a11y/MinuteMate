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
    <label>Tag:
      <select name="tag">
        <option value="">-- Select Tag --</option>
        <option value="strategic">Strategic</option>
        <option value="operational">Operational</option>
        <option value="compliance">Compliance</option>
      </select>
    </label>
  `;
  document.getElementById('actionItemsSection').appendChild(container);
}
function showTracker() {
  document.getElementById('actionTracker').style.display = 'block';

  // Sample data – replace with real fetch from saved protocols
  const tasks = [
    { task: "Update checklist", responsible: "Bernhard", dueDate: "2025-09-20", status: "open", tag: "compliance", meetingDate: "2025-09-13" },
    { task: "Review QMS", responsible: "Irina", dueDate: "2025-09-25", status: "in-progress", tag: "strategic", meetingDate: "2025-09-13" },
    { task: "Finalize report", responsible: "Bernhard", dueDate: "2025-09-10", status: "completed", tag: "operational", meetingDate: "2025-09-10" },
  ];

  // Clear existing lists
  ['openTasks', 'inProgressTasks', 'completedTasks'].forEach(id => {
    document.getElementById(id).innerHTML = '';
  });

  // Populate columns
  tasks.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.task}</strong><br>
      <small>${item.responsible} • Due: ${item.dueDate} • ${item.tag} • ${item.meetingDate}</small>`;
    document.getElementById(
      item.status === 'open' ? 'openTasks' :
      item.status === 'in-progress' ? 'inProgressTasks' :
      'completedTasks'
    ).appendChild(li);
  });
}
