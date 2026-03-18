import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import itemService from '../../services/itemService';

const ItemPublic = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchPublicItems = async () => {
      const data = await itemService.getAllItems();
      setItems(data);
    };
    fetchPublicItems();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>📢 กระดานแจ้งของหาย - ของเจอ</h1>
        <p>ช่วยกันตามหาเจ้าของ หรือแจ้งสิ่งของที่ทำหายได้ที่นี่</p>
        <Link to="/report-lost" style={btnStyle}>➕ คลิกเพื่อแจ้งของหาย/เจอ</Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {items.map((item) => (
          <div key={item.notice_id} style={cardStyle}>
            <span style={item.notice_status_id == 1 ? lostLabel : foundLabel}>
              {item.notice_status_id == 1 ? '🚨 แจ้งหาย' : '✅ แจ้งเจอ'}
            </span>
            <h3 style={{ marginTop: '10px' }}>{item.notice_title}</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>📍 สถานที่: (รหัส {item.place_id})</p>
            <p style={{ fontSize: '12px', color: '#999' }}>วันที่: {new Date(item.createdAt || Date.now()).toLocaleDateString('th-TH')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// สไตล์ตกแต่งหน้า Public
const btnStyle = { padding: '12px 24px', backgroundColor: '#2196F3', color: 'white', textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold' };
const cardStyle = { border: '1px solid #ddd', padding: '15px', borderRadius: '10px', backgroundColor: '#fff', position: 'relative' };
const lostLabel = { backgroundColor: '#ffcccc', color: '#d32f2f', padding: '2px 8px', borderRadius: '5px', fontSize: '12px' };
const foundLabel = { backgroundColor: '#ccffcc', color: '#388e3c', padding: '2px 8px', borderRadius: '5px', fontSize: '12px' };

export default ItemPublic;