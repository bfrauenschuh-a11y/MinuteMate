import React, { useState } from 'react';
import axios from 'axios';

export default function ActionItemForm({ onAdd }) {
  const [form, setForm] = useState({
    category: '',
    description: '',
    responsible: [],
    dueDate: '',
    priority: 'medium',
    attachments: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('/api/action-items', form);
    onAdd(res.data);
    setForm({});
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
      <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
      <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit">Add Action Item</button>
    </form>
  );
}
