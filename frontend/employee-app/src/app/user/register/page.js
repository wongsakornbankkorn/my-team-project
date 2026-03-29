"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../../services/authService';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user' // บังคับค่าเริ่มต้นให้เป็นแค่ผู้ใช้ทั่วไปเสมอ
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // 👇 เพิ่ม State สำหรับเช็คสิทธิ์คนที่กำลังเปิดหน้านี้
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    // แอบดูว่ามีแอดมินล็อกอินค้างไว้ไหม
    const role = localStorage.getItem('role');
    setCurrentUserRole(role);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.register(formData);
      alert('🎉 สร้างบัญชีสำเร็จ!');
      
      // ถ้าแอดมินเป็นคนสร้าง ให้เด้งกลับไปหน้าตาราง / ถ้าคนนอกสร้าง ให้ไปหน้า login
      if (currentUserRole == '1') {
        router.push('/user'); 
      } else {
        router.push('/user/login'); 
      }
      
    } catch (error) {
      console.error('Error registering:', error);
      alert('❌ เกิดข้อผิดพลาด (ชื่อผู้ใช้นี้อาจมีคนใช้แล้ว หรือระบบมีปัญหา)');
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginCard}>
        
        <div style={styles.headerSection}>
          <div style={styles.iconWrapper}></div>
          <h2 style={styles.title}>สร้างบัญชีใหม่</h2>
          <p style={styles.subtitle}></p>
        </div>

        <form onSubmit={handleSubmit} style={styles.formStyle}>
          
          <div style={styles.inputGroup}>
            <label style={styles.labelStyle}>ชื่อผู้ใช้งาน (Username)</label>
            <input 
              type="text" name="username" value={formData.username} onChange={handleChange} required 
              style={styles.inputStyle} placeholder="ตั้งชื่อผู้ใช้งาน" 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.labelStyle}>รหัสผ่าน (Password)</label>
            <input 
              type="password" name="password" value={formData.password} onChange={handleChange} required 
              style={styles.inputStyle} placeholder="ตั้งรหัสผ่าน 6 ตัวขึ้นไป" 
            />
          </div>

          {/* 🛡️ ความลับอยู่ตรงนี้! ถ้า currentUserRole == '1' (แอดมิน) ถึงจะโชว์ช่องให้เลือก */}
          {currentUserRole == '1' && (
            <div style={styles.inputGroup}>
              <label style={styles.labelStyle}>ระดับผู้ใช้งาน (Role)</label>
              <select name="role" value={formData.role} onChange={handleChange} style={styles.inputStyle}>
                <option value="user">ผู้ใช้งานทั่วไป (User)</option>
                <option value="admin">พนักงาน/แอดมิน (Admin)</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={isLoading} style={isLoading ? styles.buttonDisabled : styles.buttonStyle}>
            {isLoading ? '⏳ กำลังบันทึกข้อมูล...' : 'ยืนยันการสมัครสมาชิก'}
          </button>

        </form>

        {/* ซ่อนปุ่มเข้าสู่ระบบ ถ้าแอดมินเป็นคนเปิดหน้านี้ */}
        {currentUserRole != '1' && (
          <div style={styles.footerStyle}>
            <p style={{ margin: 0, color: '#718096' }}>
              มีบัญชีผู้ใช้อยู่แล้วใช่ไหม?{' '}
              <span style={styles.linkStyle} onClick={() => router.push('/user/login')}>
                เข้าสู่ระบบ
              </span>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

// 🎨 --- โซนตกแต่งความสวยงาม (Styles) ---
const styles = {
  pageContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontFamily: "'Prompt', 'Segoe UI', sans-serif" },
  loginCard: { backgroundColor: '#ffffff', padding: '40px 50px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)', width: '100%', maxWidth: '420px', border: '1px solid #f0f4f8' },
  headerSection: { textAlign: 'center', marginBottom: '30px' },
  iconWrapper: { fontSize: '50px', marginBottom: '15px', display: 'inline-block', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.04)' },
  title: { margin: '0 0 8px 0', color: '#1a202c', fontSize: '26px', fontWeight: '700' },
  subtitle: { margin: '0', color: '#a0aec0', fontSize: '15px' },
  formStyle: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  labelStyle: { fontWeight: '600', color: '#4a5568', fontSize: '14px', paddingLeft: '5px' },
  inputStyle: { width: '100%', padding: '15px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '15px', color: '#2d3748', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8fafc', transition: 'all 0.3s ease' },
  buttonStyle: { marginTop: '15px', padding: '16px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.5px', boxShadow: '0 8px 15px rgba(16, 185, 129, 0.3)' },
  buttonDisabled: { marginTop: '15px', padding: '16px', backgroundColor: '#CBD5E1', color: '#64748B', border: 'none', borderRadius: '12px', cursor: 'not-allowed', fontWeight: 'bold', fontSize: '16px' },
  footerStyle: { marginTop: '30px', textAlign: 'center', fontSize: '14px' },
  linkStyle: { color: '#10B981', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }
};