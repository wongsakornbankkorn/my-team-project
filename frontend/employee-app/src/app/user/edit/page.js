"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import userService from '../../../services/userService';

export default function EditUser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [formData, setFormData] = useState({ username: '', email: '', role: 'user' });

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const res = await userService.getUserById(id);
          // ดึงข้อมูลเก่ามาใส่ฟอร์ม (ซ่อนรหัสผ่านไว้ ไม่ให้แก้ตรงนี้)
          setFormData({ username: res.data?.username || res.username, email: res.data?.email || res.email, role: res.data?.role || res.role });
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(id, formData);
      alert('อัปเดตข้อมูลผู้ใช้สำเร็จ!');
      router.push('/user');
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปเดต');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '400px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px' }}>
      <h2>แก้ไขข้อมูลผู้ใช้งาน</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div><label>ชื่อผู้ใช้งาน:</label><input type="text" name="username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required style={inputStyle} /></div>
        <div><label>อีเมล:</label><input type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={inputStyle} /></div>
        <div>
          <label>บทบาท (Role):</label>
          <select name="role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={inputStyle}>
            <option value="user">ผู้ใช้งานทั่วไป (User)</option>
            <option value="admin">พนักงาน/แอดมิน (Admin)</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>บันทึกการแก้ไข</button>
        <button type="button" onClick={() => router.push('/user')} style={{ padding: '10px' }}>ยกเลิก</button>
      </form>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' };