"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import itemService from '../../../services/itemService';

export default function ItemReport() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);  //ไว้เก็บข้อมูล

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await itemService.getAllItems();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();   //ดึงข้อมุลไอเทม
  }, []);

  const statusLabel = (id) => {
    if (id == 1) return 'กำลังตามหา';
    if (id == 2) return 'พบของแล้ว';
    if (id == 3) return 'คืนเจ้าของแล้ว';
    return 'ไม่ทราบสถานะ';
  };

  const countByStatus = (statusId) => items.filter(i => i.notice_status_id == statusId).length; //รับค่าว่าของมีประเภทละกี่่ชิ้น

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดข้อมูล...</div>;

  const statuses = [
    { id: 1, label: '🚨 กำลังตามหา',    color: '#f44336' },
    { id: 2, label: '✅ พบของแล้ว',      color: '#ff9800' },
    { id: 3, label: '🎉 คืนเจ้าของแล้ว', color: '#4CAF50' },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>📊 รายงานสรุปรายการแจ้งของหาย</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={cardStyle('#2196F3')}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{items.length}</div>
          <div>รายการทั้งหมด</div>
        </div>
        {statuses.map(s => (
          <div key={s.id} style={cardStyle(s.color)}>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{countByStatus(s.id)}</div>
            <div>{s.label}</div>
          </div>
        ))}
      </div>

      <h3>รายการทั้งหมด</h3>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>หัวข้อ</th>
            <th style={{ padding: '10px' }}>รหัสหมวดหมู่</th>
            <th style={{ padding: '10px' }}>รหัสสถานที่</th>
            <th style={{ padding: '10px' }}>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? items.map((item) => (
            <tr key={item.notice_id}>
              <td style={{ padding: '10px' }}>{item.notice_id}</td>
              <td style={{ padding: '10px' }}>{item.notice_title}</td>
              <td style={{ padding: '10px' }}>{item.notice_type_id}</td>
              <td style={{ padding: '10px' }}>{item.place_id}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{statusLabel(item.notice_status_id)}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" style={{ padding: '20px' }}>ไม่มีข้อมูล</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <Link href="/item">
          <button style={{ padding: '10px 20px', backgroundColor: '#607d8b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            ← กลับหน้าหลัก
          </button>
        </Link>
      </div>
    </div>
  );
}

const cardStyle = (bg) => ({
  backgroundColor: bg,
  color: 'white',
  padding: '20px 30px',
  borderRadius: '8px',
  textAlign: 'center',
  minWidth: '140px'
});