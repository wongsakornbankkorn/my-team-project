"use client"; // บังคับให้เป็น Client Component

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import categoryService from '../../services/categoryService';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดข้อมูล...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>📂 จัดการประเภทการแจ้ง (Category)</h2>
      
      <Link href="/category/form">
        <button style={{ marginBottom: '15px', padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          + เพิ่มหมวดหมู่ใหม่
        </button>
      </Link>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>ชื่อหมวดหมู่</th>
            <th style={{ padding: '10px' }}>รายละเอียด</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <tr key={cat.id}>
                <td style={{ padding: '10px' }}>{cat.id}</td>
                <td style={{ padding: '10px' }}><strong>{cat.notice_type_name}</strong></td>
                <td style={{ padding: '10px' }}>{cat.description || '-'}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  {/* ส่ง ID ไปที่หน้า form ผ่าน Query Parameter (?id=...) */}
                  <Link href={`/category/form?id=${cat.id}`}>
                    <button style={{ marginRight: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>แก้ไข</button>
                  </Link>
                  <button onClick={() => handleDelete(cat.id)} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>ลบ</button>
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
    </div>
  );
}