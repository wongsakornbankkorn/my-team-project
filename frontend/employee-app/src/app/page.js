"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import itemService from '../services/itemService';
 
function badgeDot(color) {
  return {
    width: 6, height: 6, borderRadius: '50%', background: color,
    animation: 'pulse-dot 2s ease-in-out infinite',
    display: 'inline-block', flexShrink: 0,
  };
}
 
function roleTagStyle(role) {
  return {
    fontSize: 13, fontWeight: 500, letterSpacing: '0.04em',
    padding: '4px 14px', borderRadius: 100, verticalAlign: 'middle',
    background: role === '1' ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.12)',
    color: role === '1' ? '#f59e0b' : '#818cf8',
    border: role === '1' ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(99,102,241,0.25)',
  };
}
 
const execs = [
  {
    name: 'คุณแบงค์',
    title: 'Chief Executive Officer',
    subtitle: 'ผู้ก่อตั้ง · ดูแลระบบหมวดหมู่',
    src: '/bank-profile.jpg',
    fallback: 'CEO',
    accent: '#f59e0b',
    role: 'CEO',
    featured: true,
  },
  {
    name: 'คุณปัน',
    title: 'Chief Technology Officer',
    subtitle: 'ดูแลระบบสมาชิกและโครงสร้างพื้นฐาน',
    src: '/pun-profile.jpg',
    fallback: 'CTO',
    accent: '#3b82f6',
    role: 'CTO',
  },
  {
    name: 'คุณถั่วพู',
    title: 'Chief Operating Officer',
    subtitle: 'ดูแลระบบการแจ้งและปฏิบัติการ',
    src: '/thwphu-profile.jpg',
    fallback: 'COO',
    accent: '#ef4444',
    role: 'COO',
  },
  {
    name: 'คุณหนึ่ง',
    title: 'Chief Financial Officer',
    subtitle: 'ดูแลระบบสถานที่และทรัพยากร',
    src: '/nung-profile.jpg',
    fallback: 'CFO',
    accent: '#22c55e',
    role: 'CFO',
  },
];
 
const adminItems = [
  { icon: '📦', label: 'แจ้งหาย / เจอ', who: 'ถั่วพู', path: '/item', accent: '#ef4444' },
  { icon: '📂', label: 'หมวดหมู่', who: 'แบงค์', path: '/category', accent: '#f59e0b' },
  { icon: '📍', label: 'สถานที่', who: 'หนึ่ง', path: '/location', accent: '#22c55e' },
  { icon: '👥', label: 'ผู้ใช้งาน', who: 'ปั้น', path: '/user', accent: '#3b82f6' },
];
 
export default function HomePage() {
  const router = useRouter();
  const boardRef = useRef(null);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
 
  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if (loggedInUser) {
      setUsername(loggedInUser);
      setUserRole(role);
    }
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
 
  const scrollToBoard = () => {
    boardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
 
  const getStatusBadge = (statusId) => {
    if (statusId == 1) return (
      <span style={s.badgeLost}>
        <span style={badgeDot('#ef4444')} />
        กำลังตามหา
      </span>
    );
    if (statusId == 2) return (
      <span style={s.badgeFound}>
        <span style={badgeDot('#22c55e')} />
        พบของแล้ว
      </span>
    );
    if (statusId == 3) return (
      <span style={s.badgeReturned}>
        <span style={badgeDot('#6366f1')} />
        คืนเจ้าของแล้ว
      </span>
    );
    return <span style={s.badgeDefault}>ไม่ทราบสถานะ</span>;
  };
 
  return (
    <div style={s.page}>
 
      {/* ── Ambient background ── */}
      <div style={s.bgAmbient} aria-hidden="true">
        <div style={s.bgBlob1} />
        <div style={s.bgBlob2} />
        <div style={s.bgBlob3} />
        <div style={s.bgGrid} />
      </div>
 
      {/* ── HERO ── */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroBadge}>
            <span style={s.heroBadgeDot} />
            ระบบออนไลน์
          </div>
 
          {username ? (
            <>
              <h1 style={s.heroTitle}>ยินดีต้อนรับกลับมา</h1>
              <p style={s.heroName}>
                {username}
                <span style={roleTagStyle(userRole)}>
                  {userRole === '1' ? 'แอดมิน' : 'ผู้ใช้งาน'}
                </span>
              </p>
            </>
          ) : (
            <>
              <h1 style={s.heroTitle}>ระบบจัดการ</h1>
              <h1 style={{ ...s.heroTitle, ...s.heroTitleAccent }}>ของหาย &amp; ของเจอ</h1>
            </>
          )}
 
          <p style={s.heroSubtitle}>
            แจ้งของหาย · ประกาศของที่เจอ · ติดตามสถานะแบบเรียลไทม์
          </p>
 
          <div style={s.heroActions}>
            <button onClick={scrollToBoard} style={s.btnGhost}>
              ทีมงานของเรา
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </button>
          </div>
        </div>
 
        <div style={s.floatingStats}>
          <div style={s.statCard}>
            <span style={s.statNum}>{items.length}</span>
            <span style={s.statLabel}>รายการล่าสุด</span>
          </div>
          <div style={{ ...s.statCard, borderColor: 'rgba(99,102,241,0.2)' }}>
            <span style={{ ...s.statNum, color: '#818cf8' }}>24/7</span>
            <span style={s.statLabel}>พร้อมให้บริการ</span>
          </div>
        </div>
      </section>
 
      {/* ── ADMIN ACTIONS ── */}
      {username && userRole === '1' && (
        <section style={s.section}>
          <div style={s.container}>
            <p style={s.sectionLabel}>แผงควบคุมผู้ดูแลระบบ</p>
            <div style={s.adminGrid}>
              {adminItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  style={s.adminCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ ...s.adminCardIcon, background: item.accent + '1a', border: `1px solid ${item.accent}30` }}>
                    {item.icon}
                  </span>
                  <span style={s.adminCardLabel}>{item.label}</span>
                  <span style={{ ...s.adminCardWho, color: item.accent }}>ดูแลโดย {item.who}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
 
      {/* ── USER CTA ── */}
      {username && userRole === '2' && (
        <section style={{ ...s.section, paddingTop: 0 }}>
          <div style={s.container}>
            <button onClick={() => router.push('/item/report')} style={s.userCTA}>
              <span style={s.ctaIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </span>
              <div>
                <div style={s.ctaTitle}>แจ้งของหาย / ประกาศของที่เก็บได้</div>
                <div style={s.ctaSub}>คลิกเพื่อเพิ่มรายการใหม่ในระบบ</div>
              </div>
              <svg style={{ marginLeft: 'auto', opacity: 0.5 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>
      )}
 
      {/* ── RECENT ITEMS ── */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={s.tableCard}>
            <div style={s.tableHeader}>
              <div>
                <p style={s.sectionLabel}>ฟีดสด</p>
                <h2 style={s.tableTitle}>รายการแจ้งล่าสุดในระบบ</h2>
              </div>
              <div style={s.liveIndicator}>
                <span style={s.liveDot} />
                Live
              </div>
            </div>
 
            {loadingItems ? (
              <div style={s.loadingWrap}>
                {[1, 2, 3].map((i) => <div key={i} style={s.skeleton} />)}
              </div>
            ) : (
              <div style={s.tableWrap}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>หัวข้อรายการ</th>
                      <th style={s.th}>สถานะ</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>สถานที่</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr
                        key={idx}
                        style={s.tr}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.04)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <td style={s.td}><span style={s.itemTitle}>{item.notice_title}</span></td>
                        <td style={s.td}>{getStatusBadge(item.notice_status_id)}</td>
                        <td style={{ ...s.td, textAlign: 'center' }}>
                          <div style={s.placeImgWrap}>
                            <img
                              src={`/places/place-${item.place_id}.jpg`}
                              alt="Location"
                              style={s.placeImg}
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/80/1e293b/475569?text=loc'; }}
                            />
                          </div>
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
 
      {/* ── EXECUTIVE BOARD ── */}
      <section ref={boardRef} style={{ ...s.section, paddingBottom: '120px' }}>
        <div style={s.container}>
          <div style={s.boardHeader}>
            <p style={s.sectionLabel}>คณะผู้บริหาร</p>
            <h2 style={s.boardTitle}>Lost &amp; Found Leadership</h2>
            <p style={s.boardSubtitle}>ทีมงานผู้อยู่เบื้องหลังระบบที่ไว้วางใจได้</p>
          </div>
 
          {/* Featured CEO */}
          <div style={s.ceoWrap}>
            {execs.filter((e) => e.featured).map((exec) => (
              <div key={exec.name} style={s.ceoCard}>
                <div style={s.ceoImgFrame}>
                  <div style={{ ...s.ceoRing, borderColor: exec.accent + '60' }} />
                  <div style={{ ...s.ceoRing2, borderColor: exec.accent + '30' }} />
                  <img
                    src={exec.src}
                    alt={exec.name}
                    style={s.ceoImg}
                    onError={(e) => { e.target.src = `https://via.placeholder.com/200/1e293b/94a3b8?text=${exec.fallback}`; }}
                  />
                  <div style={{ ...s.ceoRoleBadge, background: exec.accent }}>{exec.role}</div>
                </div>
                <div style={s.ceoInfo}>
                  <div style={{ ...s.ceoAccentLine, background: exec.accent }} />
                  <h3 style={s.ceoName}>{exec.name}</h3>
                  <p style={{ ...s.ceoJobTitle, color: exec.accent }}>{exec.title}</p>
                  <p style={s.ceoSub}>{exec.subtitle}</p>
                  <div style={s.ceoTagWrap}>
                    <span style={{ ...s.ceoTag, borderColor: exec.accent + '40', color: exec.accent }}>ผู้ก่อตั้ง</span>
                    <span style={{ ...s.ceoTag, borderColor: exec.accent + '40', color: exec.accent }}>ผู้นำองค์กร</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
 
          {/* Team grid */}
          <div style={s.teamGrid}>
            {execs.filter((e) => !e.featured).map((exec) => (
              <div
                key={exec.name}
                style={s.teamCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = exec.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                }}
              >
                <div style={s.teamImgWrap}>
                  <div style={{ ...s.teamRing, borderColor: exec.accent + '50' }} />
                  <img
                    src={exec.src}
                    alt={exec.name}
                    style={s.teamImg}
                    onError={(e) => { e.target.src = `https://via.placeholder.com/120/1e293b/94a3b8?text=${exec.fallback}`; }}
                  />
                  <span style={{ ...s.teamRole, background: exec.accent }}>{exec.role}</span>
                </div>
                <h3 style={s.teamName}>{exec.name}</h3>
                <p style={{ ...s.teamJobTitle, color: exec.accent }}>{exec.title}</p>
                <p style={s.teamSub}>{exec.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes live-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; }
          50%       { border-radius: 40% 60% 45% 55% / 60% 40% 60% 40%; }
        }
        button { font-family: 'Prompt', sans-serif; cursor: pointer; border: none; outline: none; }
        table  { border-collapse: collapse; }
      `}</style>
    </div>
  );
}
 
// ── STYLES ────────────────────────────────────────────────────────────────────
 
const s = {
  page: {
    fontFamily: "'Prompt', sans-serif",
    background: '#0a0f1e',
    minHeight: '100vh',
    color: '#e2e8f0',
    position: 'relative',
    overflowX: 'hidden',
  },
  bgAmbient: { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 },
  bgBlob1: {
    position: 'absolute', top: '-10%', left: '-5%', width: 600, height: 600,
    background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
    animation: 'blob 12s ease-in-out infinite',
  },
  bgBlob2: {
    position: 'absolute', top: '30%', right: '-10%', width: 500, height: 500,
    background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
    animation: 'blob 16s ease-in-out infinite 4s',
  },
  bgBlob3: {
    position: 'absolute', bottom: '10%', left: '20%', width: 400, height: 400,
    background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)',
    animation: 'blob 20s ease-in-out infinite 8s',
  },
  bgGrid: {
    position: 'absolute', inset: 0,
    backgroundImage: `linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)`,
    backgroundSize: '60px 60px',
  },
  section: { position: 'relative', zIndex: 1, padding: '60px 0' },
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 24px' },
  sectionLabel: {
    fontSize: 11, fontWeight: 600, letterSpacing: '0.15em',
    color: '#6366f1', textTransform: 'uppercase', marginBottom: 8,
  },
  hero: {
    position: 'relative', zIndex: 1, minHeight: '92vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column', textAlign: 'center', padding: '120px 24px 80px',
  },
  heroInner: { maxWidth: 700, animation: 'fadeUp 0.8s ease both' },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
    color: '#4ade80', fontSize: 12, fontWeight: 500, letterSpacing: '0.06em',
    padding: '6px 14px', borderRadius: 100, marginBottom: 32,
  },
  heroBadgeDot: {
    width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
    animation: 'live-pulse 2s ease-in-out infinite', display: 'inline-block',
  },
  heroTitle: {
    fontSize: 'clamp(36px, 6vw, 70px)', fontWeight: 700,
    color: '#f8fafc', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 4,
  },
  heroTitleAccent: {
    background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #fb7185 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  },
  heroName: {
    fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 700, color: '#f8fafc',
    letterSpacing: '-0.02em', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 'clamp(14px, 2vw, 17px)', color: '#94a3b8',
    fontWeight: 300, lineHeight: 1.7, marginBottom: 40, marginTop: 16,
  },
  heroActions: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 100,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
    color: '#94a3b8', fontSize: 14, fontWeight: 400, transition: 'all 0.2s',
  },
  floatingStats: { display: 'flex', gap: 16, marginTop: 60, animation: 'float 6s ease-in-out infinite' },
  statCard: {
    padding: '16px 28px', borderRadius: 16, textAlign: 'center',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  },
  statNum: { display: 'block', fontSize: 28, fontWeight: 700, color: '#f8fafc', lineHeight: 1 },
  statLabel: { display: 'block', fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 300 },
  adminGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 },
  adminCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
    padding: '24px', borderRadius: 16,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.25s', textAlign: 'left',
  },
  adminCardIcon: {
    width: 44, height: 44, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
  },
  adminCardLabel: { fontSize: 16, fontWeight: 600, color: '#e2e8f0' },
  adminCardWho: { fontSize: 12, fontWeight: 400, marginTop: 2 },
  userCTA: {
    width: '100%', display: 'flex', alignItems: 'center', gap: 20,
    padding: '24px 32px', borderRadius: 20,
    background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(167,139,250,0.15) 100%)',
    border: '1px solid rgba(99,102,241,0.35)', transition: 'all 0.25s', textAlign: 'left',
  },
  ctaIconWrap: {
    width: 50, height: 50, borderRadius: 14, flexShrink: 0,
    background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8',
  },
  ctaTitle: { fontSize: 17, fontWeight: 600, color: '#e2e8f0' },
  ctaSub: { fontSize: 13, color: '#64748b', marginTop: 3, fontWeight: 300 },
  tableCard: {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 24, overflow: 'hidden',
  },
  tableHeader: {
    padding: '28px 32px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
  },
  tableTitle: { fontSize: 22, fontWeight: 600, color: '#f1f5f9', marginTop: 4 },
  liveIndicator: {
    display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 100,
    background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
    color: '#4ade80', fontSize: 12, fontWeight: 500,
  },
  liveDot: {
    width: 6, height: 6, borderRadius: '50%', background: '#22c55e',
    animation: 'live-pulse 2s ease-in-out infinite', display: 'inline-block',
  },
  loadingWrap: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 12 },
  skeleton: {
    height: 52, borderRadius: 10,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
    backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', textAlign: 'left' },
  th: {
    padding: '14px 24px', fontSize: 12, fontWeight: 600,
    color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase',
    background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' },
  td: { padding: '18px 24px', color: '#cbd5e1', fontSize: 14, verticalAlign: 'middle' },
  itemTitle: { fontWeight: 500, color: '#e2e8f0' },
  badgeLost: {
    display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px',
    borderRadius: 100, fontSize: 12, fontWeight: 500,
    background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)',
  },
  badgeFound: {
    display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px',
    borderRadius: 100, fontSize: 12, fontWeight: 500,
    background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)',
  },
  badgeReturned: {
    display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px',
    borderRadius: 100, fontSize: 12, fontWeight: 500,
    background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)',
  },
  badgeDefault: {
    display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px',
    borderRadius: 100, fontSize: 12, fontWeight: 500,
    background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)',
  },
  placeImgWrap: {
    width: 72, height: 48, borderRadius: 10, overflow: 'hidden',
    margin: '0 auto', border: '1px solid rgba(255,255,255,0.07)',
  },
  placeImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  boardHeader: { textAlign: 'center', marginBottom: 64 },
  boardTitle: {
    fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, color: '#f8fafc',
    letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 12, marginTop: 8,
  },
  boardSubtitle: { fontSize: 16, color: '#64748b', fontWeight: 300 },
  ceoWrap: { display: 'flex', justifyContent: 'center', marginBottom: 48 },
  ceoCard: {
    display: 'flex', alignItems: 'center', gap: 56, padding: '48px 60px', borderRadius: 32,
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,158,11,0.2)',
    maxWidth: 820, width: '100%', position: 'relative', overflow: 'hidden', flexWrap: 'wrap',
  },
  ceoImgFrame: { position: 'relative', width: 200, height: 240, flexShrink: 0, margin: '0 auto' },
  ceoRing: {
    position: 'absolute', inset: -10, borderRadius: 28,
    border: '1.5px solid', animation: 'float 5s ease-in-out infinite',
  },
  ceoRing2: {
    position: 'absolute', inset: -22, borderRadius: 36,
    border: '1px solid', animation: 'float 7s ease-in-out infinite reverse',
  },
  ceoImg: {
    width: 200, height: 240, borderRadius: 20, objectFit: 'cover', objectPosition: 'top center',
    position: 'relative', zIndex: 1, border: '3px solid rgba(245,158,11,0.4)', display: 'block',
  },
  ceoRoleBadge: {
    position: 'absolute', bottom: 8, right: 0, zIndex: 2, padding: '4px 14px',
    borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#fff',
  },
  ceoInfo: { flex: 1, minWidth: 260 },
  ceoAccentLine: { width: 36, height: 3, borderRadius: 2, marginBottom: 16 },
  ceoName: { fontSize: 32, fontWeight: 700, color: '#f8fafc', marginBottom: 6 },
  ceoJobTitle: { fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 },
  ceoSub: { fontSize: 14, color: '#94a3b8', fontWeight: 300, lineHeight: 1.6, marginBottom: 20 },
  ceoTagWrap: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  ceoTag: { fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 100, border: '1px solid' },
  teamGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 },
  teamCard: {
    padding: '40px 32px', borderRadius: 24, textAlign: 'center',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    transition: 'all 0.3s ease',
  },
  teamImgWrap: { position: 'relative', width: 120, height: 140, margin: '0 auto 24px' },
  teamRing: {
    position: 'absolute', inset: -8, borderRadius: 20,
    border: '1.5px solid', animation: 'float 6s ease-in-out infinite',
  },
  teamImg: {
    width: 120, height: 140, borderRadius: 16, objectFit: 'cover', objectPosition: 'top center',
    position: 'relative', zIndex: 1, border: '2px solid rgba(255,255,255,0.1)',
    display: 'block', transition: 'transform 0.3s ease',
  },
  teamRole: {
    position: 'absolute', bottom: 2, right: -4, zIndex: 2, padding: '2px 10px',
    borderRadius: 100, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#fff',
  },
  teamName: { fontSize: 20, fontWeight: 600, color: '#f1f5f9', marginBottom: 6 },
  teamJobTitle: { fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 },
  teamSub: { fontSize: 13, color: '#64748b', fontWeight: 300, lineHeight: 1.6 },
};