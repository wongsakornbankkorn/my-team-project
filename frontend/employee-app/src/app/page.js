"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import itemService from '../services/itemService';
import locationService from '../services/locationService'; //  1. เพิ่มการเรียกใช้ locationService

const execs = [
  { name: 'คุณแบงค์', title: 'Chief Executive Officer', subtitle: 'ผู้ก่อตั้ง · ดูแลระบบหมวดหมู่', src: '/bank-profile.jpg', fallback: 'CEO', accent: '#f59e0b', role: 'CEO' },
  { name: 'คุณปัน', title: 'Chief Technology Officer', subtitle: 'ดูแลระบบสมาชิกและโครงสร้างพื้นฐาน', src: '/pun-profile.jpg', fallback: 'CTO', accent: '#3b82f6', role: 'CTO' },
  { name: 'คุณถั่วพู', title: 'Chief Operating Officer', subtitle: 'ดูแลระบบการแจ้งและปฏิบัติการ', src: '/thwphu-profile.jpg', fallback: 'COO', accent: '#ef4444', role: 'COO' },
  { name: 'คุณหนึ่ง', title: 'Chief Financial Officer', subtitle: 'ดูแลระบบสถานที่และทรัพยากร', src: '/nung-profile.jpg', fallback: 'CFO', accent: '#22c55e', role: 'CFO' },
];

const adminItems = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z" />
      </svg>
    ),
    label: 'แจ้งหาย / เจอ', desc: 'จัดการรายการของหายทั้งหมด', path: '/item', accent: '#ef4444', bg: '#fef2f2', border: '#fecaca'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434zM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567zM7.5 9.933l-2.75 1.571v3.134l2.75-1.571zm1 3.134 2.75 1.571v-3.134L8.5 9.933zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567zm2.242-2.433V3.504L8.5 5.076V8.21zM7.5 8.21V5.076L4.75 3.504v3.134zM5.258 2.643 8 4.21l2.742-1.567L8 1.076zM15 9.933l-2.75 1.571v3.134L15 13.067zM3.75 14.638v-3.134L1 9.933v3.134z" />
      </svg>
    ),
    label: 'หมวดหมู่', desc: 'จัดการประเภทของสิ่งของ', path: '/category', accent: '#f59e0b', bg: '#fffbeb', border: '#fde68a'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
      </svg>
    ),
    label: 'สถานที่', desc: 'จัดการตำแหน่งและอาคาร', path: '/location', accent: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
      </svg>
    ),
    label: 'ผู้ใช้งาน', desc: 'จัดการสมาชิกในระบบ', path: '/user', accent: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe'
  },
];

// ✅ Modal แบบแสดงรายละเอียดครบถ้วน
const Modal = ({ item, onClose }) => {
  // ดึงรายละเอียดมาโชว์ (ดักเผื่อหลังบ้านใช้ชื่อตัวแปรหลายแบบ)
  const detailText = item.description || item.notice_detail || item.detail || "ไม่มีรายละเอียดเพิ่มเติม";

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, maxWidth: 420, width: '90%', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 16, background: '#f1f5f9', border: 'none', color: '#64748b', width: 30, height: 30, borderRadius: '50%', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        
        <h3 style={{ color: '#1e293b', marginBottom: 16, fontSize: 18, fontWeight: 700 }}>{item.notice_title}</h3>
        
        {item.image_url ? (
          <img src={`http://localhost:5000${item.image_url}`} alt="รูปของหาย" style={{ width: '100%', borderRadius: 12, marginBottom: 16, objectFit: 'cover', maxHeight: 220 }} />
        ) : (
          <div style={{ background: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: 12, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', marginBottom: 16 }}>
            <span style={{ fontSize: 13 }}>ไม่มีรูปภาพ</span>
          </div>
        )}

        {/* 👇 ส่วนแสดงรายละเอียดที่แก้ใหม่ โชว์แน่นอน 100% */}
        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', marginTop: 4 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', marginBottom: 4 }}>📝 รายละเอียดเพิ่มเติม</p>
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{detailText}</p>
        </div>

      </div>
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const boardRef = useRef(null);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]); //  2. เพิ่ม State สำหรับเก็บรายการสถานที่
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
      setItems(data.reverse().slice(0, 10));

      //  ดึงข้อมูลสถานที่ทั้งหมดมาเตรียมไว้
      const locData = await locationService.getLocations();
      setLocations(locData?.data || locData || []);

    } catch (error) {
      console.error('Error fetching items or locations:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  //  3. ฟังก์ชันสำหรับหา "ชื่อสถานที่" จาก "รหัสสถานที่ (place_id)"
  const getLocationName = (placeId) => {
    if (!placeId) return 'ไม่ระบุสถานที่';
    // ค้นหาในรายการสถานที่ว่า id ตรงกับ placeId หรือไม่
    const loc = locations.find(l => Number(l.id) === Number(placeId));
    return loc ? loc.name : `กำลังโหลด...`; // ถ้าเจอให้คืนชื่อ ถ้าไม่เจอชั่วคราวให้ขึ้นว่ากำลังโหลด
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
    <div style={{ fontFamily: "'Sarabun', sans-serif", background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      {selectedItem && <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />}

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #0369a1 100%)', padding: '80px 24px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', padding: '6px 16px', borderRadius: 100, marginBottom: 28 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'livePulse 2s ease-in-out infinite' }} />
            ระบบออนไลน์
          </div>

          {username ? (
            <>
              <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 8 }}>ยินดีต้อนรับกลับมา</h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, color: '#fff' }}>{username}</span>
                <span style={{ fontSize: 13, fontWeight: 600, padding: '5px 14px', borderRadius: 100, background: userRole === '1' ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.2)', color: userRole === '1' ? '#fbbf24' : '#a5b4fc', border: userRole === '1' ? '1px solid rgba(245,158,11,0.35)' : '1px solid rgba(99,102,241,0.35)' }}>
                  {userRole === '1' ? 'แอดมิน' : 'ผู้ใช้งาน'}
                </span>
              </div>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 8 }}>ระบบจัดการ</h1>
              <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 700, background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1, marginBottom: 8 }}>ของหาย &amp; ของเจอ</h1>
            </>
          )}

          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', fontWeight: 300, lineHeight: 1.7, marginBottom: 36 }}>
            แจ้งของหาย · ประกาศของที่เจอ · ติดตามสถานะแบบเรียลไทม์
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {!username && (
              <button onClick={() => router.push('/user/login')} style={{ padding: '12px 28px', borderRadius: 10, background: '#fff', color: '#1e40af', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
                เริ่มต้นใช้งาน
              </button>
            )}
            <button onClick={() => boardRef.current?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '12px 28px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, fontWeight: 500, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
              ทีมงานของเรา
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {[
            { num: items.length, label: 'รายการในระบบ', color: '#60a5fa' },
            { num: '24/7', label: 'พร้อมให้บริการ', color: '#a78bfa' },
            { num: 'FREE', label: 'ไม่มีค่าใช้จ่าย', color: '#4ade80' },
          ].map(({ num, label, color }) => (
            <div key={label} style={{ padding: '16px 28px', borderRadius: 14, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{num}</span>
              <span style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── ADMIN PANEL ── */}
      {username && userRole === '1' && (
        <section style={{ padding: '56px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#6366f1', textTransform: 'uppercase', marginBottom: 6 }}>แผงควบคุม</p>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>ผู้ดูแลระบบ</h2>
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>จัดการข้อมูลทุกส่วนของระบบของหาย</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
              {adminItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, padding: 24, borderRadius: 16, background: item.bg, border: `1.5px solid ${item.border}`, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${item.accent}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: '#fff', border: `1.5px solid ${item.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.accent }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{item.desc}</div>
                  </div>
                  <div style={{ marginTop: 'auto', fontSize: 12, fontWeight: 600, color: item.accent }}>จัดการ →</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── USER CTA ── */}
      {username && userRole === '2' && (
        <section style={{ padding: '56px 24px 20px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <button
              onClick={() => router.push('/item/report')}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 20, padding: '24px 32px', borderRadius: 20, background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', border: '1.5px solid #bfdbfe', cursor: 'pointer', textAlign: 'left', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(59,130,246,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#1e293b' }}>แจ้งของหาย / ประกาศของที่เก็บได้</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>คลิกเพื่อเพิ่มรายการใหม่เข้าสู่ระบบ</div>
              </div>
              <svg style={{ marginLeft: 'auto', color: '#94a3b8' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </section>
      )}

      {/* ── RECENT ITEMS TABLE ── */}
      <section style={{ padding: '40px 24px 56px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#6366f1', textTransform: 'uppercase', marginBottom: 4 }}>ฟีดสด</p>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b' }}>รายการแจ้งล่าสุดในระบบ</h2>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: 12, fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'livePulse 2s infinite' }} />
                Live
              </span>
            </div>

            {loadingItems ? (
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ height: 52, borderRadius: 10, background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
                <p style={{ fontSize: 15 }}>ยังไม่มีรายการในระบบ</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['หัวข้อรายการ', 'สถานะ', 'สถานที่', 'รูปภาพสิ่งของ / รายละเอียด'].map((h, i) => (
                        <th key={h} style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: i === 3 ? 'center' : 'left', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{item.notice_title}</td>
                        <td style={{ padding: '16px 20px' }}>{getStatusBadge(item.notice_status_id)}</td>
                        
                        {/*  4. เปลี่ยนมาดึงฟังก์ชัน getLocationName(รหัส) แทน */}
                        <td style={{ padding: '16px 20px', fontSize: 13, color: '#475569' }}>
                          {item.place_id ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                              <svg width="13" height="13" viewBox="0 0 16 16" fill="#6366f1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                              </svg>
                              {getLocationName(item.place_id)}
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>—</span>
                          )}
                        </td>

                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedItem(item)}
                            style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '6px 14px', borderRadius: 100, fontSize: 12, cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#dbeafe'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; }}
                          >ดูรูปภาพ</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── TEAM SECTION ── */}
      <section ref={boardRef} style={{ padding: '56px 24px 80px', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#6366f1', textTransform: 'uppercase', marginBottom: 8 }}>คณะผู้บริหาร</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>Lost &amp; Found Leadership</h2>
            <p style={{ fontSize: 15, color: '#64748b', fontWeight: 300 }}>ทีมงานผู้อยู่เบื้องหลังระบบที่ไว้วางใจได้</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {execs.map(exec => (
              <div key={exec.name}
                style={{ padding: '36px 28px', borderRadius: 20, textAlign: 'center', background: '#fff', border: '1.5px solid #f1f5f9', transition: 'all 0.3s', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = exec.accent + '60'; e.currentTarget.style.boxShadow = `0 12px 32px ${exec.accent}18`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'; }}
              >
                <div style={{ position: 'relative', width: 110, height: 130, margin: '0 auto 20px' }}>
                  <img
                    src={exec.src}
                    alt={exec.name}
                    style={{ width: 110, height: 130, borderRadius: 16, objectFit: 'cover', objectPosition: 'top', display: 'block', border: `2px solid ${exec.accent}30`, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                    onError={e => { e.target.src = `https://via.placeholder.com/110/f8fafc/94a3b8?text=${exec.fallback}`; }}
                  />
                  <span style={{ position: 'absolute', bottom: -8, right: -6, background: exec.accent, color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 100, letterSpacing: '0.08em' }}>{exec.role}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{exec.name}</h3>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: exec.accent, marginBottom: 8 }}>{exec.title}</p>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{exec.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&family=Prompt:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        button { font-family: 'Sarabun', sans-serif; }
        table { border-collapse: collapse; }
      `}</style>
    </div>
  );
}