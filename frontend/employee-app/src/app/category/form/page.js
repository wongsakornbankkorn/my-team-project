"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import categoryService from '../../../services/categoryService';

export default function CategoryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // ดึงค่า id จาก URL (ถ้ามี)

  const [formData, setFormData] = useState({
    notice_type_name: '',
    description: ''
  });

  useEffect(() => {
    // ถ้ามี ID แปลว่าเป็นการ "แก้ไข" ให้ดึงข้อมูลเก่ามาแสดง
    if (id) {
      const fetchCategory = async () => {
        try {
          const res = await categoryService.getCategoryById(id);
          if (res.success) {
            setFormData({
              notice_type_name: res.data.notice_type_name,
              description: res.data.description || ''
            });
          }
        } catch (error) {
          console.error('Error fetching category:', error);
        }
      };
      fetchCategory();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await categoryService.updateCategory(id, formData);
        alert('แก้ไขหมวดหมู่สำเร็จ!');
      } else {
        await categoryService.createCategory(formData);
        alert('เพิ่มหมวดหมู่สำเร็จ!');
      }
      router.push('/category'); // กลับไปหน้าตาราง
    } catch (error) {
      console.error('Error saving category:', error);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h2>{id ? '✏️ แก้ไขหมวดหมู่' : '➕ เพิ่มหมวดหมู่ใหม่'}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontWeight: 'bold' }}>ชื่อหมวดหมู่ (ประเภทสิ่งของ):</label>
          <input 
            type="text" 
            name="notice_type_name" 
            value={formData.notice_type_name} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold' }}>รายละเอียดเพิ่มเติม:</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows="3"
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {id ? 'บันทึกการแก้ไข' : 'สร้างหมวดหมู่'}
        </button>
        
        <button type="button" onClick={() => router.push('/category')} style={{ padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          ยกเลิก
        </button>
      </form>
    </div>
  );
}