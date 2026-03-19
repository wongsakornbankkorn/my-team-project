"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../../services/authService';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false); // เพิ่มลูกเล่นโหลดดิ้งตอนกดปุ่ม

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.login(formData);
      alert('✅ เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับคุณ ' + res.user.username);
      router.push('/');
    } catch (error) {
      alert('❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่');
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginCard}>
        
        {/* ส่วนหัว (Header) */}
        <div style={styles.headerSection}>
          <div style={styles.iconWrapper}>🕵️‍♂️</div>
          <h2 style={styles.title}>ยินดีต้อนรับกลับมา!</h2>
          <p style={styles.subtitle}>ระบบจัดการข้อมูลของหาย (Admin Panel)</p>
        </div>

        {/* ส่วนฟอร์ม (Form) */}
        <form onSubmit={handleSubmit} style={styles.formStyle}>
          
          <div style={styles.inputGroup}>
            <label style={styles.labelStyle}>ชื่อผู้ใช้งาน</label>
            <input 
              type="text" name="username" value={formData.username} onChange={handleChange} required 
              style={styles.inputStyle} placeholder="กรอกชื่อผู้ใช้งานของคุณ" 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.labelStyle}>รหัสผ่าน</label>
            <input 
              type="password" name="password" value={formData.password} onChange={handleChange} required 
              style={styles.inputStyle} placeholder="••••••••" 
            />
          </div>

          <button type="submit" disabled={isLoading} style={isLoading ? styles.buttonDisabled : styles.buttonStyle}>
            {isLoading ? '⏳ กำลังตรวจสอบข้อมูล...' : '🚀 เข้าสู่ระบบ'}
          </button>

        </form>

        {/* ส่วนท้าย (Footer / Link) */}
        <div style={styles.footerStyle}>
          <p style={{ margin: 0, color: '#718096' }}>
            ยังไม่มีบัญชีผู้ใช้ใช่ไหม?{' '}
            <span style={styles.linkStyle} onClick={() => router.push('/user/register')}>
              สมัครสมาชิกเลย
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}

// 🎨 --- โซนตกแต่งความสวยงาม (Styles) ---
const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    fontFamily: "'Prompt', 'Segoe UI', sans-serif",
  },
  loginCard: {
    backgroundColor: '#ffffff',
    padding: '40px 50px',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)', // เงาฟุ้งๆ ดูมีมิติ
    width: '100%',
    maxWidth: '420px',
    border: '1px solid #f0f4f8'
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  iconWrapper: {
    fontSize: '50px',
    marginBottom: '15px',
    display: 'inline-block',
    padding: '15px',
    backgroundColor: '#f8fafc',
    borderRadius: '50%',
    boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
  },
  title: {
    margin: '0 0 8px 0',
    color: '#1a202c',
    fontSize: '26px',
    fontWeight: '700'
  },
  subtitle: {
    margin: '0',
    color: '#a0aec0',
    fontSize: '15px'
  },
  formStyle: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  labelStyle: {
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '14px',
    paddingLeft: '5px'
  },
  inputStyle: {
    width: '100%',
    padding: '15px 18px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    fontSize: '15px',
    color: '#2d3748',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#f8fafc',
    transition: 'all 0.3s ease'
  },
  buttonStyle: {
    marginTop: '15px',
    padding: '16px',
    backgroundImage: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', // สีปุ่มน้ำเงินไล่เฉด
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    letterSpacing: '0.5px',
    boxShadow: '0 8px 15px rgba(37, 99, 235, 0.3)', // เงาปุ่ม
  },
  buttonDisabled: {
    marginTop: '15px',
    padding: '16px',
    backgroundColor: '#CBD5E1',
    color: '#64748B',
    border: 'none',
    borderRadius: '12px',
    cursor: 'not-allowed',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  footerStyle: {
    marginTop: '30px',
    textAlign: 'center',
    fontSize: '14px'
  },
  linkStyle: {
    color: '#3B82F6',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};