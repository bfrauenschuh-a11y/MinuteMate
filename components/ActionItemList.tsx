import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ActionItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('/api/action-items').then(res => setItems(res.data));
  }, []);

  return (
    <div>
      {items.map(item => (
        <div key={item._id} style={{ borderLeft: `5px solid ${item.status === 'open' ? 'red' : item.status === 'in progress' ? 'yellow' : 'green'}` }}>
          <h4>{item.description}</h4>
          <p>Status: {item.status}</p>
          <p>Due: {new Date(item.dueDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
