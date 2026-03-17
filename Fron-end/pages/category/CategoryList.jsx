import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../../services/categoryService';

const CategoryList = () => {
  // สร้างตัวแปร (state) ไว้เก็บข้อมูลหมวดหมู่ และสถานะการโหลด
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect จะทำงานอัตโนมัติแค่รอบเดียว เมื่อเปิดหน้านี้ขึ้นมา
  useEffect(() => {
    fetchCategories();
  }, []);

  // ฟังก์ชันดึงข้อมูลจาก Backend ผ่าน Service ที่เราเพิ่งสร้าง
  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      if (res.success) {
        setCategories(res.data); // เอาข้อมูลที่ได้ไปเก็บใน state
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับลบข้อมูล
  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?')) {
      try {
        await categoryService.deleteCategory(id);
        fetchCategories(); // ลบเสร็จให้ดึงข้อมูลใหม่มาแสดงทันที
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>จัดการหมวดหมู่สิ่งของ (Category)</h2>
      
      {/* ปุ่มไปหน้าฟอร์มสำหรับเพิ่มหมวดหมู่ใหม่ */}
      <Link 
        to="/categories/new" 
        style={{ display: 'inline-block', marginBottom: '15px', padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
      >
        + เพิ่มหมวดหมู่ใหม่
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
            categories.map((category) => (
              <tr key={category.id}>
                <td style={{ padding: '10px' }}>{category.id}</td>
                <td style={{ padding: '10px' }}>{category.notice_type_name}</td>
                <td style={{ padding: '10px' }}>{category.description || '-'}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  {/* ปุ่มไปหน้าแก้ไข */}
                  <Link 
                    to={`/categories/edit/${category.id}`} 
                    style={{ marginRight: '15px', color: '#2196F3', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    แก้ไข
                  </Link>
                  {/* ปุ่มลบ */}
                  <button 
                    onClick={() => handleDelete(category.id)} 
                    style={{ color: '#f44336', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 'bold', fontSize: '16px' }}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>ไม่มีข้อมูลหมวดหมู่ในระบบ</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;