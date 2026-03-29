"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import itemService from '../../../services/itemService';

const MONTH_TH = ['', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

export default function ItemSummary() {
  const [reportData, setReportData] = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  const [filterYear,  setFilterYear]  = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await itemService.getMonthlyReport();
        setReportData(data);
        setFiltered(data);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่อ');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  // กรองทุกครั้งที่ filter เปลี่ยน
  useEffect(() => {
    let result = reportData;
    if (filterYear)  result = result.filter(r => String(r.year)  === filterYear);
    if (filterMonth) result = result.filter(r => String(r.month) === filterMonth);
    setFiltered(result);
  }, [filterYear, filterMonth, reportData]);

  // หาปีที่มีในข้อมูลสำหรับ dropdown
  const years = [...new Set(reportData.map(r => r.year))].sort((a, b) => b - a);

  // ยอดรวม
  const totalAll      = filtered.reduce((s, r) => s + Number(r.total),    0);
  const totalLost     = filtered.reduce((s, r) => s + Number(r.lost),     0);
  const totalFound    = filtered.reduce((s, r) => s + Number(r.found),    0);
  const totalReturned = filtered.reduce((s, r) => s + Number(r.returned), 0);

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดรายงาน...</div>;
  if (error)   return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: 'white', borderRadius: '8px' }}>
      <h2>สรุปยอดการแจ้งหาย / เจอ แยกตามเดือน</h2>

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'รายการทั้งหมด', value: totalAll,      color: '#2196F3' },
          { label: 'แจ้งหาย',    value: totalLost,     color: '#f44336' },
          { label: 'แจ้งเจอ',    value: totalFound,    color: '#ff9800' },
          { label: 'คืนของแล้ว', value: totalReturned, color: '#4CAF50' },
        ].map(c => (
          <div key={c.label} style={{ backgroundColor: c.color, color: 'white', padding: '16px 28px', borderRadius: '8px', textAlign: 'center', minWidth: '130px' }}>
            <div style={{ fontSize: '30px', fontWeight: 'bold' }}>{c.value}</div>
            <div style={{ fontSize: '13px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>กรองข้อมูล:</span>

        <select value={filterYear} onChange={e => setFilterYear(e.target.value)} style={sel}>
          <option value="">ทุกปี</option>
          {years.map(y => <option key={y} value={y}>{y + 543} (พ.ศ.)</option>)}
        </select>

        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={sel}>
          <option value="">ทุกเดือน</option>
          {MONTH_TH.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
        </select>

        {(filterYear || filterMonth) && (
          <button onClick={() => { setFilterYear(''); setFilterMonth(''); }} style={{ padding: '6px 12px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px' }}>
           ล้างตัวกรอง
          </button>
        )}
      </div>

      {/* Table */}
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '12px' }}>เดือน</th>
            <th style={{ padding: '12px' }}>ปี (พ.ศ.)</th>
            <th style={{ padding: '12px', color: '#f44336' }}>แจ้งหาย</th>
            <th style={{ padding: '12px', color: '#ff9800' }}>แจ้งเจอ</th>
            <th style={{ padding: '12px', color: '#4CAF50' }}>คืนของแล้ว</th>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>รวม</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? filtered.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
              <td style={{ padding: '10px' }}>{MONTH_TH[row.month]}</td>
              <td style={{ padding: '10px' }}>{Number(row.year) + 543}</td>
              <td style={{ padding: '10px', color: '#f44336', fontWeight: 'bold' }}>{row.lost}</td>
              <td style={{ padding: '10px', color: '#ff9800', fontWeight: 'bold' }}>{row.found}</td>
              <td style={{ padding: '10px', color: '#4CAF50', fontWeight: 'bold' }}>{row.returned}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.total}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" style={{ padding: '20px', color: '#888' }}>ไม่มีข้อมูลในช่วงที่เลือก</td>
            </tr>
          )}
          {/* แถวยอดรวม */}
          {filtered.length > 1 && (
            <tr style={{ backgroundColor: '#e3f2fd', fontWeight: 'bold' }}>
              <td colSpan="2" style={{ padding: '10px' }}>รวมทั้งหมด</td>
              <td style={{ padding: '10px', color: '#f44336' }}>{totalLost}</td>
              <td style={{ padding: '10px', color: '#ff9800' }}>{totalFound}</td>
              <td style={{ padding: '10px', color: '#4CAF50' }}>{totalReturned}</td>
              <td style={{ padding: '10px' }}>{totalAll}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => window.print()} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>
          พิมพ์รายงาน
        </button>
        <Link href="/item">
          <button style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#607d8b', color: '#fff', border: 'none', borderRadius: '5px' }}>
           ← กลับ
          </button>
        </Link>
      </div>
    </div>
  );
}

const sel = { padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' };