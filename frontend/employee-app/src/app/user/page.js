"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import userService from '../../services/userService';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await userService.getUsers();
      // สมมติว่า Backend ส่งมาเป็น Array ตรงๆ หรือ { data: [...] }
      setUsers(res.data || res); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('ยืนยันการลบผู้ใช้งานท่านนี้?')) {
      try {
        await userService.deleteUser(id);
        alert('ลบข้อมูลสำเร็จ');
        fetchUsers();
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดข้อมูลผู้ใช้...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: 'white', borderRadius: '8px' }}>
      <h2>👥 จัดการข้อมูลผู้ใช้ (User Management)</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <Link href="/user/register">
          <button style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            + เพิ่มผู้ใช้งานใหม่ (Register)
          </button>
        </Link>
      </div>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>ชื่อผู้ใช้ (Username)</th>
            <th style={{ padding: '10px' }}>อีเมล (Email)</th>
            <th style={{ padding: '10px' }}>บทบาท (Role)</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id || user.user_id}>
                <td style={{ padding: '10px' }}>{user.id || user.user_id}</td>
                <td style={{ padding: '10px' }}><strong>{user.username}</strong></td>
                <td style={{ padding: '10px' }}>{user.email}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ padding: '3px 8px', backgroundColor: user.role === 'admin' ? '#ff9800' : '#e0e0e0', borderRadius: '10px', fontSize: '12px' }}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button onClick={() => alert('รอก่อนนะ ฟังก์ชันแก้ไขกำลังมา!')} style={{ marginRight: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>แก้ไข</button>
                  <button onClick={() => handleDelete(user.id || user.user_id)} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>ลบ</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>ยังไม่มีข้อมูลผู้ใช้งาน</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}