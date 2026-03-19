"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// เรียกใช้แค่บรรทัดนี้บรรทัดเดียวพอครับ 👇
import authService from '@/services/authService'; 

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user' // ค่าเริ่มต้น
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      alert('🎉 สมัครสมาชิกสำเร็จ!');
      router.push('/user'); // กลับไปหน้าตารางจัดการผู้ใช้
    } catch (error) {
      console.error('Error registering:', error);
      alert('❌ เกิดข้อผิดพลาด (ชื่อผู้ใช้นี้อาจมีคนใช้แล้ว หรือเซิร์ฟเวอร์มีปัญหา)');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>📝 สมัครสมาชิก (Register)</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        
        <div>
          <label style={{ fontWeight: 'bold' }}>ชื่อผู้ใช้งาน (Username):</label>
          <input 
            type="text" name="username" value={formData.username} onChange={handleChange} required 
            style={inputStyle} placeholder="ตั้งชื่อผู้ใช้งาน"
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold' }}>รหัสผ่าน (Password):</label>
          <input 
            type="password" name="password" value={formData.password} onChange={handleChange} required 
            style={inputStyle} placeholder="ตั้งรหัสผ่าน"
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold' }}>บทบาท (Role):</label>
          <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
            <option value="user">ผู้ใช้งานทั่วไป (User)</option>
            <option value="admin">พนักงาน/แอดมิน (Admin)</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
          ยืนยันการสมัคร
        </button>
        
        <button type="button" onClick={() => router.push('/user')} style={{ padding: '10px', backgroundColor: 'transparent', color: '#666', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          ย้อนกลับ
        </button>
      </form>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' };