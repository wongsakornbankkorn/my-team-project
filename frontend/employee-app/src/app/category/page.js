"use client"; // บังคับให้เป็น Client Component

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios'; //  อย่าลืม import axios
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
      
      
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-boxes" viewBox="0 0 16 16">
          <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434zM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567zM7.5 9.933l-2.75 1.571v3.134l2.75-1.571zm1 3.134 2.75 1.571v-3.134L8.5 9.933zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567zm2.242-2.433V3.504L8.5 5.076V8.21zM7.5 8.21V5.076L4.75 3.504v3.134zM5.258 2.643 8 4.21l2.742-1.567L8 1.076zM15 9.933l-2.75 1.571v3.134L15 13.067zM3.75 14.638v-3.134L1 9.933v3.134z"/>
        </svg>
       จัดการประเภทการแจ้ง (Category)
      </h2>
      
      {/* ── กลุ่มปุ่มด้านบน ── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {!showReport && (
          <Link href="/category/form">
            <button style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              + เพิ่มหมวดหมู่ใหม่
            </button>
          </Link>
        )}
        
       
   <button 
          onClick={handleToggleReport}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: showReport ? '#607d8b' : '#ff9800', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            display: 'flex', // จัดให้อยู่บรรทัดเดียวกัน
            alignItems: 'center', // ให้อยู่กึ่งกลางแนวตั้ง
            gap: '8px' // เว้นระยะห่างไอคอนกับข้อความ
          }}
        >
          {showReport ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pass" viewBox="0 0 16 16">
                <path d="M5.5 5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z"/>
                <path d="M8 2a2 2 0 0 0 2-2h2.5A1.5 1.5 0 0 1 14 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-13A1.5 1.5 0 0 1 3.5 0H6a2 2 0 0 0 2 2m0 1a3 3 0 0 1-2.83-2H3.5a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-1.67A3 3 0 0 1 8 3"/>
              </svg>
             กลับไปหน้าจัดการตาราง
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pass" viewBox="0 0 16 16">
                <path d="M5.5 5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z"/>
                <path d="M8 2a2 2 0 0 0 2-2h2.5A1.5 1.5 0 0 1 14 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-13A1.5 1.5 0 0 1 3.5 0H6a2 2 0 0 0 2 2m0 1a3 3 0 0 1-2.83-2H3.5a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-1.67A3 3 0 0 1 8 3"/>
              </svg>
             ดูรายงานสรุปยอด
            </>
          )}
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
          <h3 style={{ color: '#333', marginTop: 0 }}> <> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
   <path fillRule="evenodd"  d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07"/>
  </svg>สรุปยอดแจ้งหาย/เจอ แยกตามประเภทการแจ้ง</> </h3>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', marginTop: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#fff3e0' }}>
                <th style={{ padding: '12px' }}>ประเภทการแจ้ง</th>
                <th > <i className="bi bi-circle-fill text-danger"></i>แจ้งหาย (ชิ้น)</th>
                <th > <i className="bi bi-circle-fill text-success"></i>แจ้งเจอ (ชิ้น)</th>
                <th>  <i className="bi bi-stars text-primary"> </i>คืนเจ้าของ (ชิ้น)</th>
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