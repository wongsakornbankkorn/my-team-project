"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import itemService from '../services/itemService';

const execs = [
  { name: 'คุณแบงค์', title: 'Chief Executive Officer', subtitle: 'ผู้ก่อตั้ง · ดูแลระบบหมวดหมู่', src: '/bank-profile.jpg', fallback: 'CEO', accent: '#f59e0b', role: 'CEO' },
  { name: 'คุณปัน', title: 'Chief Technology Officer', subtitle: 'ดูแลระบบสมาชิกและโครงสร้างพื้นฐาน', src: '/pun-profile.jpg', fallback: 'CTO', accent: '#3b82f6', role: 'CTO' },
  { name: 'คุณถั่วพู', title: 'Chief Operating Officer', subtitle: 'ดูแลระบบการแจ้งและปฏิบัติการ', src: '/thwphu-profile.jpg', fallback: 'COO', accent: '#ef4444', role: 'COO' },
  { name: 'คุณหนึ่ง', title: 'Chief Financial Officer', subtitle: 'ดูแลระบบสถานที่และทรัพยากร', src: '/nung-profile.jpg', fallback: 'CFO', accent: '#22c55e', role: 'CFO' },
];

const adminItems = [
  { svgPath: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM4 5h16M9 3h6', label: 'แจ้งหาย / เจอ', desc: 'จัดการรายการของหายทั้งหมด', path: '/item', accent: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  { svgPath: 'M3 7h18M3 12h18M3 17h18', label: 'หมวดหมู่', desc: 'จัดการประเภทของสิ่งของ', path: '/category', accent: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { svgPath: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z', label: 'สถานที่', desc: 'จัดการตำแหน่งและอาคาร', path: '/location', accent: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
  { svgPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', label: 'ผู้ใช้งาน', desc: 'จัดการสมาชิกในระบบ', path: '/user', accent: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
];

const Modal = ({ item, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
    <div style={{ background: '#fff', borderRadius: 20, padding: 32, maxWidth: 420, width: '90%', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
      <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 16, background: '#f1f5f9', border: 'none', color: '#64748b', width: 30, height: 30, borderRadius: '50%', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      <h3 style={{ color: '#1e293b', marginBottom: 16, fontSize: 18, fontWeight: 700 }}>{item.notice_title}</h3>
      {item.image_url ? (
        <img src={`http://localhost:5000${item.image_url}`} alt="รูปของหาย" style={{ width: '100%', borderRadius: 12, marginBottom: 16, objectFit: 'cover', maxHeight: 220 }} />
      ) : (
        <div style={{ background: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: 12, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', marginBottom: 16, flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 13 }}>ไม่มีรูปภาพ</span>
        </div>
      )}
      <p style={{ color: '#64748b', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        สถานที่: <span style={{ color: '#1e293b', fontWeight: 500 }}>ID {item.place_id}</span>
      </p>
    </div>
  </div>
);

export default function HomePage() {
  const router = useRouter();
  const boardRef = useRef(null);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if (loggedInUser) { setUsername(loggedInUser); setUserRole(role); }
    fetchRecentItems();
  }, []);

  const fetchRecentItems = async () => {
    try {
      const data = await itemService.getAllItems();
      setItems(data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  const getStatusBadge = (statusId) => {
    const styles = {
      1: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', dot: '#ef4444', text: 'กำลังตามหา' },
      2: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', dot: '#22c55e', text: 'พบของแล้ว' },
      3: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', dot: '#3b82f6', text: 'คืนเจ้าของแล้ว' },
    };
    const s = styles[statusId] || { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0', dot: '#94a3b8', text: 'ไม่ทราบสถานะ' };
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 500, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
        {s.text}
      </span>
    );
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2>รายงานแจ้งหาย/เจอ แยกตามประเภทสิ่งของ</h2>
      <p style={{ color: '#666' }}>สรุปสถิติจำนวนสิ่งของที่แจ้งในแต่ละหมวดหมู่</p>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '12px' }}>ประเภทสิ่งของ</th>
            <th style={{ padding: '12px', color: '#dc3545' }}>แจ้งหาย</th>
            <th style={{ padding: '12px', color: '#ffc107' }}>แจ้งเจอ</th>
            <th style={{ padding: '12px', color: '#28a745' }}>คืนแล้ว</th>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>รวมทั้งหมด</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((row, index) => (
            <tr key={index}>
              <td style={{ padding: '12px', textAlign: 'left' }}><strong>{row.name}</strong></td>
              <td style={{ padding: '12px' }}>{row.lost}</td>
              <td style={{ padding: '12px' }}>{row.found}</td>
              <td style={{ padding: '12px' }}>{row.returned}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => window.print()} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>
         พิมพ์รายงาน
      </button>
    </div>
  );
}