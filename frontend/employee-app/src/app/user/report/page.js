"use client";

import React, { useState, useEffect } from 'react';
import userService from '../../../services/userService';

export default function UserReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const users = await userService.getUsers();
        const usersList = users.data || users;
        
        // แยกกลุ่มนับจำนวนคนสมัครตามเดือนและปี
        const monthlySummary = usersList.reduce((acc, user) => {
          const date = new Date(user.createdAt || new Date()); 
          const monthYear = date.toLocaleString('th-TH', { month: 'long', year: 'numeric' });
          
          if (!acc[monthYear]) acc[monthYear] = { month: monthYear, total: 0, admin: 0, user: 0 };
          
          acc[monthYear].total += 1;
          if (user.role === 'admin') acc[monthYear].admin += 1;
          else acc[monthYear].user += 1;
          
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

  if (loading) return <div style={{ padding: '20px' }}>กำลังคำนวณยอดผู้สมัคร...</div>;

  return (
    <div style={{ padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h2>รายงานยอดสมัครสมาชิกรายเดือน (ปั้น)</h2>
      
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
        <thead>
          <tr style={{ backgroundColor: '#e3f2fd' }}>
            <th style={{ padding: '12px' }}>เดือน / ปี</th>
            <th style={{ padding: '12px', color: '#ff9800' }}>จำนวน Admin</th>
            <th style={{ padding: '12px', color: '#4CAF50' }}>จำนวน User ทั่วไป</th>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>รวมผู้สมัครทั้งหมด</th>
          </tr>
        </thead>
        <tbody>
          {reportData.length > 0 ? reportData.map((row, index) => (
            <tr key={index}>
              <td style={{ padding: '12px' }}>{row.month}</td>
              <td style={{ padding: '12px', color: '#ff9800' }}>{row.admin}</td>
              <td style={{ padding: '12px', color: '#4CAF50' }}>{row.user}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{row.total}</td>
            </tr>
          )) : (
            <tr><td colSpan="4" style={{ padding: '20px' }}>ยังไม่มีข้อมูลการสมัครสมาชิก</td></tr>
          )}
        </tbody>
      </table>
      <button onClick={() => window.print()} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>พิมพ์รายงาน</button>
    </div>
  );
}