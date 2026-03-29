"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../../services/authService';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setErrorMsg('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await authService.login(formData);
      localStorage.setItem('username', res.user.username);
      localStorage.setItem('role', res.user.role_id);
      window.location.href = '/';
    } catch (error) {
      setErrorMsg('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่');
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* ====== ซ้าย ====== */}
      <div style={styles.left}>
        <div style={styles.ring1} />
        <div style={styles.ring2} />
        <div style={styles.ring3} />

        <div style={styles.leftContent}>
          <h1 style={styles.leftTitle}>Lost &amp; Found</h1>
          <p style={styles.leftSub}></p>

          <div style={styles.chips}>
            {[
              'ระบบเเจ้งเตือนของหาย',
              'ติดตามสถานะแบบ Real-time',
              'ขอบคุณที่ไว้ใจเรา',
              
            ].map((text, i) => (
              <div key={i} style={styles.chip}>
                <div style={styles.chipDot} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ====== ขวา ====== */}
      <div style={styles.right}>
        <div style={styles.formCard}>
          <h2 style={styles.title}>เข้าสู่ระบบ</h2>
          <p style={styles.subtitle}>กรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>

          {errorMsg && (
            <div style={styles.errorBox}>
              <span style={{ marginRight: '8px' }}>⚠️</span>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ชื่อผู้ใช้งาน</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="กรอกชื่อผู้ใช้งาน"
                required
                style={styles.input}
                onFocus={e => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)';
                  e.target.style.background = '#fff';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = '#f8fafc';
                }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>รหัสผ่าน</label>
              <div style={styles.passwordWrap}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{ ...styles.input, paddingRight: '48px' }}
                  onFocus={e => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)';
                    e.target.style.background = '#fff';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f8fafc';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={isLoading ? styles.btnDisabled : styles.btn}
            >
              {isLoading ? '⏳  กำลังตรวจสอบข้อมูล...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <div style={styles.footer}>
            ยังไม่มีบัญชีผู้ใช้?{' '}
            <span style={styles.link} onClick={() => router.push('/user/register')}>
              สมัครสมาชิกเลย
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

const NAVBAR_HEIGHT = '64px'; // ← ปรับถ้า Navbar สูงไม่เท่ากัน

const styles = {
  page: {
    display: 'flex',
    height: `calc(100vh - ${NAVBAR_HEIGHT})`,
    fontFamily: "'Prompt', 'Segoe UI', sans-serif",
    overflow: 'hidden',
  },
  left: {
    flex: 1,
    height: '100%',
    background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 40px',
    position: 'relative',
    overflow: 'hidden',
  },
  ring1: {
    position: 'absolute',
    width: '380px', height: '380px',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '50%',
    top: '-100px', left: '-100px',
  },
  ring2: {
    position: 'absolute',
    width: '260px', height: '260px',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '50%',
    bottom: '-70px', right: '-70px',
  },
  ring3: {
    position: 'absolute',
    width: '130px', height: '130px',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '50%',
    top: '55%', left: '62%',
  },
  leftContent: {
    position: 'relative',
    zIndex: 1,
  },
  leftTitle: {
    color: '#ffffff',
    fontSize: '48px',
    fontWeight: '800',
    lineHeight: '1.15',
    marginBottom: '12px',
    letterSpacing: '-1px',
  },
  leftSub: {
    color: '#93c5fd',
    fontSize: '15px',
    lineHeight: '1.6',
    marginBottom: '36px',
    fontWeight: '300',
  },
  chips: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  chip: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#e2e8f0',
    fontSize: '14px',
  },
  chipDot: {
    width: '8px', height: '8px',
    borderRadius: '50%',
    background: '#60a5fa',
    flexShrink: 0,
  },
  right: {
    width: '460px',
    height: '100%',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 40px',
    overflowY: 'auto',
  },
  formCard: {
    width: '100%',
    maxWidth: '380px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '32px',
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '13px 16px',
    fontSize: '15px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '11px',
    background: '#f8fafc',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
    fontFamily: "'Prompt', 'Segoe UI', sans-serif",
  },
  passwordWrap: {
    position: 'relative',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px',
    lineHeight: 1,
    color: '#94a3b8',
  },
  btn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: '#fff',
    border: 'none',
    borderRadius: '11px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 6px 20px rgba(37,99,235,0.35)',
    letterSpacing: '0.3px',
    fontFamily: "'Prompt', 'Segoe UI', sans-serif",
  },
  btnDisabled: {
    width: '100%',
    padding: '14px',
    background: '#cbd5e1',
    color: '#64748b',
    border: 'none',
    borderRadius: '11px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'not-allowed',
    marginTop: '8px',
    letterSpacing: '0.3px',
    fontFamily: "'Prompt', 'Segoe UI', sans-serif",
  },
  footer: {
    marginTop: '28px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#64748b',
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};