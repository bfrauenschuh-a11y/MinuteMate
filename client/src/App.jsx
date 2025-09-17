import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import ActionItemForm from './components/ActionItemForm';
import ActionItemList from './components/ActionItemList';
import exportPDF from './components/PDFExport';

function App() {
  const [items, setItems] = useState([]);

  return (
    <div>
      <h1>MinuteMate Pro</h1>
      <ActionItemForm onAdd={item => setItems([...items, item])} />
      <ActionItemList />
      <button onClick={() => exportPDF(items)}>Export PDF</button>
    </div>
  );
}

export default App;
