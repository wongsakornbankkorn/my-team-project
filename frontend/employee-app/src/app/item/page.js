"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import itemService from '../../services/itemService';

export default function ItemList() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const data = await itemService.getAllItems();
    setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id) => {
    if (confirm('ยืนยันการลบรายการนี้?')) {
      await itemService.deleteItem(id);
      fetchItems();
    }
  };

  const getStatusLabel = (statusId) => {
    if (statusId == 1) return <span style={{ color: 'red' }}>🚨 กำลังตามหา</span>;
    if (statusId == 2) return <span style={{ color: 'orange' }}>✅ พบของแล้ว</span>;
    if (statusId == 3) return <span style={{ color: 'green' }}>🎉 คืนเจ้าของแล้ว</span>;
    return 'ไม่ทราบสถานะ';
  };

  return (
    <div>
      <h2>📦 จัดการรายการแจ้งของหาย / เจอ (ถั่วพู)</h2>
      <div style={{ marginBottom: '15px' }}>
        <Link href="/item/form"><button style={btn}>+ เพิ่มรายการใหม่</button></Link>
        <Link href="/item/report"><button style={{...btn, backgroundColor: '#607d8b', marginLeft: '10px'}}>📊 ดูรายงานรายเดือน</button></Link>
      </div>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px' }}>หัวข้อ</th>
            <th style={{ padding: '10px' }}>รหัสหมวดหมู่</th>
            <th style={{ padding: '10px' }}>สถานที่</th>
            <th style={{ padding: '10px' }}>สถานะ</th>
            <th style={{ padding: '10px' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.notice_id}>
              <td style={{ padding: '10px' }}>{item.notice_title}</td>
              <td style={{ padding: '10px' }}>{item.notice_type_id}</td>
              <td style={{ padding: '10px' }}>รหัส {item.place_id}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{getStatusLabel(item.notice_status_id)}</td>
              <td style={{ padding: '10px' }}>
                <Link href={`/item/form?id=${item.notice_id}`}><button style={{...btn, backgroundColor: '#2196F3', marginRight: '5px'}}>แก้ไขสถานะ</button></Link>
                <button onClick={() => handleDelete(item.notice_id)} style={{...btn, backgroundColor: '#f44336'}}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const btn = { padding: '8px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };