import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import itemService from '../../services/itemService';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await itemService.getAllItems();
      setItems(data); // เอาข้อมูลมาเก็บใน State
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
      try {
        await itemService.deleteItem(id);
        fetchItems(); // ลบเสร็จให้รีเฟรชตาราง
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>📋 รายการแจ้งของหาย / แจ้งเจอ</h2>
      
      <Link 
        to="/items/new" 
        style={{ display: 'inline-block', marginBottom: '15px', padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
      >
        + แจ้งรายการใหม่
      </Link>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px' }}>รหัส (ID)</th>
            <th style={{ padding: '10px' }}>หัวข้อที่แจ้ง</th>
            <th style={{ padding: '10px' }}>หมวดหมู่ (ID)</th>
            <th style={{ padding: '10px' }}>สถานที่ (ID)</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.notice_id}>
                <td style={{ padding: '10px' }}>{item.notice_id}</td>
                <td style={{ padding: '10px' }}><strong>{item.notice_title}</strong></td>
                <td style={{ padding: '10px' }}>{item.notice_type_id}</td>
                <td style={{ padding: '10px' }}>{item.place_id}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <Link 
                    to={`/items/edit/${item.notice_id}`} 
                    style={{ marginRight: '15px', color: '#2196F3', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    แก้ไข
                  </Link>
                  <button 
                    onClick={() => handleDelete(item.notice_id)} 
                    style={{ color: '#f44336', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 'bold', fontSize: '16px' }}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>ยังไม่มีรายการแจ้งของหาย/เจอ</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;