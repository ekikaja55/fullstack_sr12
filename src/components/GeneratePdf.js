// src/components/GeneratePdf.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const GeneratePdf = (data, selectedLabel) => {
  const doc = new jsPDF();

  const head = [['No', 'Nama', ...selectedLabel.split(' - '), 'Role']];
  const body = data.map((item, index) => [
    index + 1,
    item.name,
    item.firstMonth,
    item.secondMonth,
    item.role
  ]);

  // Hitung total
  const totalRow = [
    '',
    'Total',
    data.reduce((sum, row) => sum + (Number(row.firstMonth) || 0), 0),
    data.reduce((sum, row) => sum + (Number(row.secondMonth) || 0), 0),
    ''
  ];

  body.push(totalRow);

  autoTable(doc, {
    head,
    body,
    styles: {
      fontSize: 10,
      halign: 'center',
      valign: 'middle',
    },
    headStyles: {
      fillColor: [52, 152, 219], // biru
      textColor: 255,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 10 },  // No
      1: { cellWidth: 40 },  // Nama
      2: { cellWidth: 25 },  // Bulan 1
      3: { cellWidth: 25 },  // Bulan 2
      4: { cellWidth: 25 },  // Role
    },
    didDrawCell: (data) => {
      // Highlight baris total
      if (data.row.index === body.length - 1) {
        doc.setFillColor(230, 230, 230);
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        doc.setFont(undefined, 'bold');
      }
    },
  });

  doc.save(`laporan-${selectedLabel}.pdf`);
};
