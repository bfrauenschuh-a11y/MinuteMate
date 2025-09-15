document.addEventListener('DOMContentLoaded', () => {
  const actionList = document.getElementById('actionList');
  const addBtn = document.getElementById('addActionItemBtn');

  addActionItem(); // Add initial item

  addBtn.addEventListener('click', addActionItem);
  enableDragAndDrop();
});

// ➕ Create new action item block
function addActionItem() {
  const li = document.createElement('li');
  li.className = 'sortable-item';
  li.draggable = true;
  li.innerHTML = `
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
  document.getElementById('actionList').appendChild(li);
  enableDragAndDrop();
}

// 🧲 Drag-and-drop logic
function enableDragAndDrop() {
  const items = document.querySelectorAll('.sortable-item');
  items.forEach(item => {
    item.addEventListener('dragstart', () => item.classList.add('dragging'));
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
  });

  const list = document.getElementById('actionList');
  list.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(list, e.clientY);
    const dragging = document.querySelector('.dragging');
    if (afterElement == null) {
      list.appendChild(dragging);
    } else {
      list.insertBefore(dragging, afterElement);
    }
  });
}

function getDragAfterElement(container, y) {
  const items = [...container.querySelectorAll('.sortable-item:not(.dragging)')];
  return items.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 📊 Load Action Tracker
async function showTracker() {
  document.getElementById('actionTracker').style.display = 'block';

  const res = await fetch('/api/action-items');
  const tasks = await res.json();

  ['openTasks', 'inProgressTasks', 'completedTasks'].forEach(id => {
    document.getElementById(id).innerHTML = '';
  });

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

// 💾 Save Action Items
async function saveActionItems() {
  const items = [...document.querySelectorAll('#actionList .sortable-item')];
  const payload = items.map(item => ({
    task: item.querySelector('input[name="task"]').value,
    responsible: item.querySelector('input[name="responsible"]').value,
    dueDate: item.querySelector('input[name="dueDate"]').value,
    status: item.querySelector('select[name="status"]').value,
    tag: item.querySelector('select[name="tag"]').value,
    meetingDate: document.getElementById('protocolSelect').value || new Date().toISOString().split('T')[0]
  }));

  const res = await fetch('/api/action-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    alert('✅ Action items saved!');
  } else {
    alert('❌ Failed to save items.');
  }
}
