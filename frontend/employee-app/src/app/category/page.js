"use client"; // บังคับให้เป็น Client Component

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios'; // 💡 อย่าลืม import axios
import categoryService from '../../services/categoryService';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // 1. State สำหรับระบบรายงาน
  // ==========================================
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      if (res.success) {
        setCategories(res.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่นี้?')) {
      try {
        await categoryService.deleteCategory(id);
        alert('ลบข้อมูลสำเร็จ');
        fetchCategories(); // รีเฟรชตาราง
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    }
  };

  // ==========================================
  // 2. ฟังก์ชันคำนวณรายงาน
  // ==========================================
  const handleToggleReport = async () => {
    if (!showReport) {
      try {
        // ดึงข้อมูลไอเทมทั้งหมดมาเพื่อนับจำนวน
        const res = await axios.get('http://localhost:5000/api/items');
        const allItems = res.data.data || res.data;

        const stats = categories.map(cat => {
          // หาไอเทมทั้งหมดที่อยู่ในหมวดหมู่นี้
          const catItems = allItems.filter(i => Number(i.notice_type_id) === Number(cat.id));
          
          return {
            id: cat.id,
            name: cat.notice_type_name,
            lost: catItems.filter(i => Number(i.notice_status_id) === 1).length,    // 1 = หาย
            found: catItems.filter(i => Number(i.notice_status_id) === 2).length,   // 2 = เจอ
            returned: catItems.filter(i => Number(i.notice_status_id) === 3).length,// 3 = คืนเจ้าของแล้ว
            total: catItems.length
          };
        });
        setReportData(stats);
      } catch (err) {
        console.error("Error fetching report items:", err);
      }
    }
    setShowReport(!showReport);
  };

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดข้อมูล...</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>📂 จัดการประเภทการแจ้ง (Category)</h2>
      
      {/* ── กลุ่มปุ่มด้านบน ── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {!showReport && (
          <Link href="/category/form">
            <button style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              + เพิ่มหมวดหมู่ใหม่
            </button>
          </Link>
        )}
        
        {/* 📊 ปุ่มสลับดูรายงาน */}
        <button 
          onClick={handleToggleReport}
          style={{ padding: '10px 15px', backgroundColor: showReport ? '#607d8b' : '#ff9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {showReport ? '📋 กลับไปตารางจัดการ' : '📊 ดูรายงานสรุปยอด'}
        </button>
      </div>

      {/* ── ส่วนแสดงผล: ถ้า showReport เป็น false โชว์ตารางจัดการ / ถ้าเป็น true โชว์รายงาน ── */}
      {!showReport ? (
        // ================= ตารางจัดการปกติ =================
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>ชื่อหมวดหมู่</th>
              <th style={{ padding: '12px' }}>รายละเอียด</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{cat.id}</td>
                  <td style={{ padding: '12px' }}><strong>{cat.notice_type_name}</strong></td>
                  <td style={{ padding: '12px' }}>{cat.description || '-'}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <Link href={`/category/form?id=${cat.id}`}>
                      <button style={{ marginRight: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>แก้ไข</button>
                    </Link>
                    <button onClick={() => handleDelete(cat.id)} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>ลบ</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>ไม่มีข้อมูลหมวดหมู่</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        // ================= ตารางรายงาน =================
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#333', marginTop: 0 }}>📈 สรุปยอดแจ้งหาย/เจอ แยกตามประเภทการแจ้ง</h3>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', marginTop: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#fff3e0' }}>
                <th style={{ padding: '12px' }}>ประเภทการแจ้ง</th>
                <th style={{ padding: '12px', color: '#e53935' }}>🔴 แจ้งหาย (ชิ้น)</th>
                <th style={{ padding: '12px', color: '#43a047' }}>🟢 แจ้งเจอ (ชิ้น)</th>
                <th style={{ padding: '12px', color: '#1e88e5' }}>🎉 คืนเจ้าของ (ชิ้น)</th>
                <th style={{ padding: '12px', backgroundColor: '#ffe0b2' }}>รวมทั้งหมด (ชิ้น)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((data) => (
                <tr key={data.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>{data.name}</td>
                  <td style={{ padding: '12px', fontSize: '16px' }}>{data.lost}</td>
                  <td style={{ padding: '12px', fontSize: '16px' }}>{data.found}</td>
                  <td style={{ padding: '12px', fontSize: '16px', color: '#1e88e5', fontWeight: 'bold' }}>{data.returned}</td>
                  <td style={{ padding: '12px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff8e1' }}>{data.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}