import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function exportPDF(items) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Meeting Minutes – Action Items', 14, 20);

  const tableData = items.map(item => [
    item.number,
    item.category || '',
    item.description,
    item.status,
    item.priority,
    item.responsible?.join(', ') || '',
    item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '',
    item.completedAt ? new Date(item.completedAt).toLocaleDateString() : ''
  ]);

  doc.autoTable({
    startY: 30,
    head: [['#', 'Category', 'Description', 'Status', 'Priority', 'Responsible', 'Due Date', 'Completed']],
    body: tableData,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [22, 160, 133] }
  });

  doc.save('MinuteMate_ActionItems.pdf');
}
