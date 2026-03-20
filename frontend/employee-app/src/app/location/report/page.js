"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import locationService from '../../../services/locationService';

export default function LocationReport() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await locationService.getLocationReport();
      if (res.data) {
        setReport(res.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report:', error);
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดข้อมูล...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>📊 รายงานแจ้งหาย/เจอ แยกตามสถานที่</h2>

      <Link href="/location">
        <button style={{ marginBottom: '15px', padding: '10px 15px', backgroundColor: '#607d8b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          ← กลับหน้าสถานที่
        </button>
      </Link>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>ชื่อสถานที่</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>จำนวนทั้งหมด</th>
            <th style={{ padding: '10px' }}>รายการ</th>
          </tr>
        </thead>
        <tbody>
          {report.length > 0 ? (
            report.map((loc) => (
              <tr key={loc.locationId}>
                <td style={{ padding: '10px' }}>{loc.locationId}</td>
                <td style={{ padding: '10px' }}><strong>{loc.locationName}</strong></td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <span style={{ backgroundColor: '#e3f2fd', color: '#1565c0', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                    {loc.total} รายการ
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  {loc.items.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {loc.items.map((item) => (
                        <li key={item.notice_id} style={{ marginBottom: '4px' }}>
                          {item.notice_title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: '#999' }}>ไม่มีรายการ</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>ไม่มีข้อมูล</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}