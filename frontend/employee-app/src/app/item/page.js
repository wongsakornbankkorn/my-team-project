"use client";
import React, { useState, useEffect } from 'react';
import itemService from '../../services/itemService';

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [newStatus, setNewStatus] = useState(1);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemService.getAllItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่อ');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleUpdateStatus = async (id) => {
    try {
      await itemService.updateItem(id, { notice_status_id: newStatus });
      alert('อัปเดตสถานะสำเร็จ!');
      setEditId(null);
      fetchItems();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const getStatusLabel = (statusId) => {
    if (statusId == 1) return <span style={{ color: 'red' }}>🚨 กำลังตามหา</span>;
    if (statusId == 2) return <span style={{ color: 'orange' }}>✅ พบของแล้ว</span>;
    if (statusId == 3) return <span style={{ color: 'green' }}>🎉 คืนเจ้าของแล้ว</span>;
    return 'ไม่ทราบสถานะ';
  };

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดข้อมูล...</div>;
  if (error)   return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>📦 การจัดการสถานะ (ถั่วพู)</h2>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>หัวข้อ</th>
            <th style={{ padding: '10px' }}>รหัสหมวดหมู่</th>
            <th style={{ padding: '10px' }}>สถานที่</th>
            <th style={{ padding: '10px' }}>สถานะ</th>
            <th style={{ padding: '10px' }}>อัปเดตสถานะ</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? items.map((item) => (
            <tr key={item.notice_id}>
              <td style={{ padding: '10px' }}>{item.notice_id}</td>
              <td style={{ padding: '10px' }}>{item.notice_title}</td>
              <td style={{ padding: '10px' }}>{item.notice_type_id}</td>
              <td style={{ padding: '10px' }}>รหัส {item.place_id}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{getStatusLabel(item.notice_status_id)}</td>
              <td style={{ padding: '10px' }}>
                {editId === item.notice_id ? (
                  <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value)}
                      style={{ padding: '5px' }}
                    >
                      <option value={1}>🚨 กำลังตามหา</option>
                      <option value={2}>✅ พบของแล้ว</option>
                      <option value={3}>🎉 คืนเจ้าของแล้ว</option>
                    </select>
                    <button onClick={() => handleUpdateStatus(item.notice_id)} style={{...btn, backgroundColor: '#4CAF50'}}>บันทึก</button>
                    <button onClick={() => setEditId(null)} style={{...btn, backgroundColor: '#9e9e9e'}}>ยกเลิก</button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditId(item.notice_id); setNewStatus(item.notice_status_id); }}
                    style={{...btn, backgroundColor: '#2196F3'}}
                  >
                    เปลี่ยนสถานะ
                  </button>
                )}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" style={{ padding: '20px', color: '#888' }}>ยังไม่มีรายการ</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const btn = { padding: '8px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };