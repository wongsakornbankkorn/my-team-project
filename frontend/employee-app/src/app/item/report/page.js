"use client";

import React, { useState, useEffect } from 'react';
import itemService from '../../../services/itemService';

export default function ItemReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const items = await itemService.getAllItems();
        
        // Logic: เอาข้อมูลทั้งหมดมาแยกกลุ่มตาม "เดือนและปี"
        const monthlySummary = items.reduce((acc, item) => {
          // ใช้ createdAt ถ้ามี ถ้าไม่มีให้ถือว่าเป็นวันปัจจุบัน
          const date = new Date(item.createdAt || new Date()); 
          const monthYear = date.toLocaleString('th-TH', { month: 'long', year: 'numeric' });
          
          if (!acc[monthYear]) {
            acc[monthYear] = { month: monthYear, total: 0, lost: 0, found: 0, returned: 0 };
          }
          
          acc[monthYear].total += 1;
          if (item.notice_status_id == 1) acc[monthYear].lost += 1;
          else if (item.notice_status_id == 2) acc[monthYear].found += 1;
          else if (item.notice_status_id == 3) acc[monthYear].returned += 1;
          
          return acc;
        }, {});

        setReportData(Object.values(monthlySummary));
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>กำลังประมวลผลรายงาน...</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h2>📊 สรุปยอดการแจ้งหาย/เจอ แยกตามเดือน (ถั่วพู)</h2>
      
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '12px' }}>เดือน / ปี</th>
            <th style={{ padding: '12px', color: '#dc3545' }}>🚨 แจ้งหาย</th>
            <th style={{ padding: '12px', color: '#ffc107' }}>✅ แจ้งเจอ</th>
            <th style={{ padding: '12px', color: '#28a745' }}>🎉 คืนของแล้ว</th>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>รวมทั้งหมด</th>
          </tr>
        </thead>
        <tbody>
          {reportData.length > 0 ? reportData.map((row, index) => (
            <tr key={index}>
              <td style={{ padding: '12px' }}>{row.month}</td>
              <td style={{ padding: '12px', color: '#dc3545' }}>{row.lost}</td>
              <td style={{ padding: '12px', color: '#ffc107' }}>{row.found}</td>
              <td style={{ padding: '12px', color: '#28a745' }}>{row.returned}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{row.total}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" style={{ padding: '20px' }}>ไม่มีข้อมูลสถิติในระบบ</td>
            </tr>
          )}
        </tbody>
      </table>

      <button onClick={() => window.print()} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>
        🖨️ พิมพ์รายงานสรุป
      </button>
    </div>
  );
}