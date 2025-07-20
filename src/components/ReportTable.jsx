// src/components/ReportTable.jsx
import React, { useState } from 'react';
import { generateExcel } from './generateExcel';
import { GeneratePdf } from './GeneratePdf';
import '../styles/report-table.css'
const monthPairs = [
  { label: 'Januari - Februari', value: ['januari', 'februari'] },
  { label: 'Maret - April', value: ['maret', 'april'] },
  { label: 'Mei - Juni', value: ['mei', 'juni'] },
  { label: 'Juli - Agustus', value: ['juli', 'agustus'] },
  { label: 'September - Oktober', value: ['september', 'oktober'] },
  { label: 'November - Desember', value: ['november', 'desember'] },
];

const ReportTable = ({ data }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedMonths, setSelectedMonths] = useState(monthPairs[0]);
  const [isExporting, setIsExporting] = useState({ pdf: false, excel: false });

  const filteredData = data
    .filter(d => !selectedRole || d.role === selectedRole)
    .map(d => ({
      ...d,
      firstMonth: d[selectedMonths.value[0]],
      secondMonth: d[selectedMonths.value[1]],
    }));

  const total1 = filteredData.reduce((sum, d) => sum + (Number(d.firstMonth) || 0), 0);
  const total2 = filteredData.reduce((sum, d) => sum + (Number(d.secondMonth) || 0), 0);

  const roles = [...new Set(data.map(d => d.role))];

  const handlePdfExport = async () => {
    setIsExporting({ ...isExporting, pdf: true });
    try {
      await GeneratePdf(filteredData, selectedMonths.label);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setTimeout(() => setIsExporting({ ...isExporting, pdf: false }), 1000);
    }
  };

  const handleExcelExport = async () => {
    setIsExporting({ ...isExporting, excel: true });
    try {
      await generateExcel(filteredData, selectedMonths.label);
    } catch (error) {
      console.error('Error generating Excel:', error);
    } finally {
      setTimeout(() => setIsExporting({ ...isExporting, excel: false }), 1000);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  return (
    <div className="report-container">
      {/* Header Section */}
      <div className="report-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="bi bi-graph-up-arrow"></i>
          </div>
          <div className="header-text">
            <h1 className="report-title">Laporan Keuangan Bulanan</h1>
            <p className="report-subtitle">Monitor dan analisis data keuangan bulanan dengan mudah</p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="report-controls">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label fw-semibold">
              <i className="bi bi-calendar-month me-2"></i>
              Periode Bulan
            </label>
            <select
              className="form-select custom-select"
              value={selectedMonths.label}
              onChange={e => {
                const pair = monthPairs.find(m => m.label === e.target.value);
                setSelectedMonths(pair);
              }}
            >
              {monthPairs.map(m => (
                <option key={m.label} value={m.label}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">
              <i className="bi bi-person-badge me-2"></i>
              Filter Role
            </label>
            <select
              className="form-select custom-select"
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
            >
              <option value=''>Semua Role</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Export Data</label>
            <div className="export-buttons">
              <button 
                className="btn btn-export-pdf"
                onClick={handlePdfExport}
                disabled={isExporting.pdf}
              >
                {isExporting.pdf ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-file-earmark-pdf me-2"></i>
                    PDF
                  </>
                )}
              </button>
              
              <button 
                className="btn btn-export-excel"
                onClick={handleExcelExport}
                disabled={isExporting.excel}
              >
                {isExporting.excel ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-file-earmark-excel me-2"></i>
                    Excel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-section">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="stat-card stat-primary">
              <div className="stat-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{filteredData.length}</h3>
                <p className="stat-label">Total Downline</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="stat-card stat-success">
              <div className="stat-icon">
                <i className="bi bi-calendar-check"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{formatCurrency(total1)}</h3>
                <p className="stat-label">{selectedMonths.value[0].charAt(0).toUpperCase() + selectedMonths.value[0].slice(1)}</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="stat-card stat-info">
              <div className="stat-icon">
                <i className="bi bi-calendar2-check"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{formatCurrency(total2)}</h3>
                <p className="stat-label">{selectedMonths.value[1].charAt(0).toUpperCase() + selectedMonths.value[1].slice(1)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-section">
        <div className="table-header">
          <h3 className="table-title">
            <i className="bi bi-table me-2"></i>
            Data Detail - {selectedMonths.label}
          </h3>
          <div className="table-info">
            <span className="badge bg-light text-dark">
              {filteredData.length} record{filteredData.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table custom-table">
            <thead>
              <tr>
                <th scope="col" className="text-center" style={{ width: '60px' }}>
                  <i className="bi bi-hash"></i>
                </th>
                <th scope="col">
                  <i className="bi bi-person me-2"></i>
                  Nama Karyawan
                </th>
                <th scope="col" className="text-center">
                  <i className="bi bi-calendar me-2"></i>
                  {selectedMonths.value[0].charAt(0).toUpperCase() + selectedMonths.value[0].slice(1)}
                </th>
                <th scope="col" className="text-center">
                  <i className="bi bi-calendar me-2"></i>
                  {selectedMonths.value[1].charAt(0).toUpperCase() + selectedMonths.value[1].slice(1)}
                </th>
                <th scope="col">
                  <i className="bi bi-person-badge me-2"></i>
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d, i) => (
                <tr key={i} className="table-row">
                  <td className="text-center fw-medium">{i + 1}</td>
                  <td>
                    <div className="employee-info">
                      <span className="employee-name">{d.name}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="amount-badge">{formatCurrency(d.firstMonth)}</span>
                  </td>
                  <td className="text-center">
                    <span className="amount-badge">{formatCurrency(d.secondMonth)}</span>
                  </td>
                  <td>
                    <span className="role-badge">{d.role}</span>
                  </td>
                </tr>
              ))}
              <tr className="total-row">
                <td className="text-center">
                  <i className="bi bi-calculator"></i>
                </td>
                <td className="fw-bold">
                  <i className="bi bi-sigma "></i>
                  Total Keseluruhan
                </td>
                <td className="text-center">
                  <span className="total-amount">{formatCurrency(total1)}</span>
                </td>
                <td className="text-center">
                  <span className="total-amount">{formatCurrency(total2)}</span>
                </td>
                <td>
                  <span className="text-muted">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="bi bi-inbox"></i>
          </div>
          <h4>Tidak Ada Data</h4>
          <p>Tidak ada data yang sesuai dengan filter yang dipilih.</p>
        </div>
      )}
    </div>
  );
};

export default ReportTable;