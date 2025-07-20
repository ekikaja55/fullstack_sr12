// src/components/generateExcel.js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const generateExcel = (data, selectedLabel) => {
  const wsData = [
    ['No', 'Nama', ...selectedLabel.split(' - '), 'Role']
  ];

  let total1 = 0;
  let total2 = 0;

  data.forEach((item, index) => {
    const first = Number(item.firstMonth) || 0;
    const second = Number(item.secondMonth) || 0;
    total1 += first;
    total2 += second;

    wsData.push([
      index + 1,
      item.name,
      first,
      second,
      item.role
    ]);
  });

  // Tambahkan baris total
  wsData.push(['', 'Total', total1, total2, '']);

  const worksheet = XLSX.utils.aoa_to_sheet(wsData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `laporan-${selectedLabel}.xlsx`);
};
