"use client";

import React, { useState, useEffect } from 'react';
import categoryService from '../../../services/categoryService';
import itemService from '../../../services/itemService'; // ดึงของถั่วพูมาจอยกัน

export default function CategoryReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const [categoriesRes, itemsRes] = await Promise.all([
          categoryService.getCategories(),
          itemService.getAllItems()
        ]);

        if (categoriesRes.success) {
          const summary = categoriesRes.data.map(cat => {
            // นับจำนวน item ที่อยู่ในหมวดหมู่นี้
            const relatedItems = itemsRes.filter(item => item.notice_type_id == cat.id);
            return {
              name: cat.notice_type_name,
              lost: relatedItems.filter(i => i.notice_status_id == 1).length,
              found: relatedItems.filter(i => i.notice_status_id == 2).length,
              returned: relatedItems.filter(i => i.notice_status_id == 3).length,
              total: relatedItems.length
            };
          });
          setReportData(summary);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report:', error);
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>กำลังประมวลผลรายงาน...</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2>📊 รายงานแจ้งหาย/เจอ แยกตามประเภทสิ่งของ</h2>
      <p style={{ color: '#666' }}>สรุปสถิติจำนวนสิ่งของที่แจ้งในแต่ละหมวดหมู่</p>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '12px' }}>ประเภทสิ่งของ</th>
            <th style={{ padding: '12px', color: '#dc3545' }}>แจ้งหาย</th>
            <th style={{ padding: '12px', color: '#ffc107' }}>แจ้งเจอ</th>
            <th style={{ padding: '12px', color: '#28a745' }}>คืนแล้ว</th>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>รวมทั้งหมด</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((row, index) => (
            <tr key={index}>
              <td style={{ padding: '12px', textAlign: 'left' }}><strong>{row.name}</strong></td>
              <td style={{ padding: '12px' }}>{row.lost}</td>
              <td style={{ padding: '12px' }}>{row.found}</td>
              <td style={{ padding: '12px' }}>{row.returned}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => window.print()} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>
        🖨️ พิมพ์รายงาน
      </button>
    </div>
  );
}