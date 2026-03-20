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

      {/* ====== ซ้าย: แผง Dark ====== */}
      <div style={styles.left}>
        {/* วงแหวนตกแต่ง */}
        <div style={styles.ring1} />
        <div style={styles.ring2} />
        <div style={styles.ring3} />

        <div style={styles.leftContent}>
          <div style={styles.logoBox}>🔍</div>
          <h1 style={styles.leftTitle}>Lost &amp; Found<br />Admin Panel</h1>
          <p style={styles.leftSub}>ระบบจัดการของหาย สำหรับเจ้าหน้าที่</p>

          <div style={styles.chips}>
            {[
              'จัดการรายการของหาย / เจอ',
              'ติดตามสถานะแบบ Real-time',
              'รายงานสถิติรายเดือน',
            ].map((text, i) => (
              <div key={i} style={styles.chip}>
                <div style={styles.chipDot} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ====== ขวา: ฟอร์ม Login ====== */}
      <div style={styles.right}>
        <div style={styles.formCard}>
          <h2 style={styles.title}>เข้าสู่ระบบ</h2>
          <p style={styles.subtitle}>กรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>

          {/* Error Box */}
          {errorMsg && (
            <div style={styles.errorBox}>
              <span style={{ marginRight: '8px' }}>⚠️</span>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>

            {/* Username */}
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

            {/* Password */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={isLoading ? styles.btnDisabled : styles.btn}
            >
              {isLoading ? '⏳  กำลังตรวจสอบข้อมูล...' : '🚀  เข้าสู่ระบบ'}
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

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Prompt', 'Segoe UI', sans-serif",
  },

  /* ===== Left Panel ===== */
  left: {
    flex: 1,
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
  logoBox: {
    width: '64px', height: '64px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    marginBottom: '24px',
  },
  leftTitle: {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: '1.35',
    marginBottom: '12px',
  },
  leftSub: {
    color: '#93c5fd',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '32px',
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

  /* ===== Right Panel ===== */
  right: {
    width: '460px',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 40px',
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

  /* Error */
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

  /* Form */
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

  /* Buttons */
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
    transition: 'transform 0.15s, box-shadow 0.2s',
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

  /* Footer */
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