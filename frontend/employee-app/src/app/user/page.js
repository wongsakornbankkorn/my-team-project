"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import userService from '../../services/userService';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- State สำหรับ Modal แก้ไข ---
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null); // เก็บ user ที่กำลังแก้ไข
  const [editForm, setEditForm] = useState({ username: '', password: '' });
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getUsers();
      setUsers(res.data || res);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- เปิด Modal พร้อมข้อมูล user ที่เลือก ---
  const handleOpenEdit = (user) => {
    setEditUser(user);
    setEditForm({ username: user.username, password: '' });
    setErrorMsg('');
    setSuccessMsg('');
    setShowEditPassword(false);
    setShowModal(true);
  };

  // --- ปิด Modal ---
  const handleCloseModal = () => {
    setShowModal(false);
    setEditUser(null);
    setEditForm({ username: '', password: '' });
    setErrorMsg('');
  };

  // --- บันทึกการแก้ไข ---
  const handleSaveEdit = async () => {
    if (!editForm.username.trim()) {
      setErrorMsg('กรุณากรอกชื่อผู้ใช้งาน');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    try {
      const payload = { username: editForm.username };
      // ถ้ากรอก password ใหม่ ค่อยส่งไป ถ้าไม่กรอกไม่ส่ง
      if (editForm.password.trim()) {
        payload.password = editForm.password;
      }
      await userService.updateUser(editUser.id || editUser.user_id, payload);
      setSuccessMsg('✅ บันทึกสำเร็จ!');
      fetchUsers();
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (error) {
      setErrorMsg('❌ เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setSaving(false);
    }
  };

  // --- ลบ user ---
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
      <h2> จัดการข้อมูลผู้ใช้ (User Management)</h2>

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
                  <button
                    onClick={() => handleOpenEdit(user)}
                    style={{ marginRight: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(user.id || user.user_id)}
                    style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    ลบ
                  </button>
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

      {/* ====== Modal แก้ไข User ====== */}
      {showModal && (
        <div style={modal.overlay} onClick={handleCloseModal}>
          <div style={modal.box} onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div style={modal.header}>
              <h3 style={modal.title}>✏️ แก้ไขข้อมูลผู้ใช้</h3>
              <button onClick={handleCloseModal} style={modal.closeBtn}>✕</button>
            </div>

            {/* User Badge */}
            <div style={modal.userBadge}>
              <span style={modal.userAvatar}>
                {editUser?.username?.charAt(0).toUpperCase()}
              </span>
              <div>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>{editUser?.username}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>ID: {editUser?.id || editUser?.user_id}</div>
              </div>
            </div>

            {/* Error / Success */}
            {errorMsg && (
              <div style={modal.errorBox}>{errorMsg}</div>
            )}
            {successMsg && (
              <div style={modal.successBox}>{successMsg}</div>
            )}

            {/* Form */}
            <div style={modal.formGroup}>
              <label style={modal.label}>ชื่อผู้ใช้งานใหม่</label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                style={modal.input}
                placeholder="กรอกชื่อผู้ใช้งาน"
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={modal.formGroup}>
              <label style={modal.label}>รหัสผ่านใหม่ <span style={{ color: '#94a3b8', fontWeight: 400 }}>(ถ้าไม่เปลี่ยนให้เว้นว่าง)</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showEditPassword ? 'text' : 'password'}
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  style={{ ...modal.input, paddingRight: '44px' }}
                  placeholder="กรอกรหัสผ่านใหม่"
                  onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                  style={modal.eyeBtn}
                >
                  {showEditPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div style={modal.footer}>
              <button onClick={handleCloseModal} style={modal.cancelBtn}>ยกเลิก</button>
              <button onClick={handleSaveEdit} disabled={saving} style={saving ? modal.saveBtnDisabled : modal.saveBtn}>
                {saving ? '⏳ กำลังบันทึก...' : '💾 บันทึก'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// ====== Styles สำหรับ Modal ======
const modal = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  box: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '32px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
    fontFamily: "'Prompt', 'Segoe UI', sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#94a3b8',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '24px',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '16px',
    flexShrink: 0,
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '16px',
  },
  successBox: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#16a34a',
    fontSize: '14px',
    marginBottom: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '18px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    background: '#f8fafc',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s, box-shadow 0.2s',
    fontFamily: "'Prompt', 'Segoe UI', sans-serif",
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px',
    color: '#94a3b8',
  },
  footer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '11px 24px',
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Prompt', 'Segoe UI', sans-serif",
  },
  saveBtn: {
    padding: '11px 24px',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
    fontFamily: "'Prompt', 'Segoe UI', sans-serif",
  },
  saveBtnDisabled: {
    padding: '11px 24px',
    background: '#cbd5e1',
    color: '#64748b',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'not-allowed',
    fontFamily: "'Prompt', 'Segoe UI', sans-serif",
  },
};