"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setUserRole(localStorage.getItem('role'));
    setUsername(localStorage.getItem('username'));
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      window.location.href = '/user/login';
    }
  };

  const navLinks = isClient && userRole == '1' ? [
    { href: '/', label: 'หน้าหลัก' },
    { href: '/item', label: 'การแจ้ง' },
    { href: '/category', label: 'หมวดหมู่' },
    { href: '/location', label: 'สถานที่' },
    { href: '/user', label: 'สมาชิก' },
    { href: '/item/summary', label: 'สรุปรายงาน' },
  ] : [
    { href: '/', label: 'หน้าหลัก' },
  ];

  const isLogin = pathname === '/user/login' || pathname === '/user/register';

  return (
    <html lang="th" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&family=Prompt:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "'Sarabun', sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <nav style={{
          position: 'sticky', top: 0, zIndex: 100,
          backgroundColor: scrolled ? 'rgba(255,255,255,0.97)' : '#ffffff',
          borderBottom: scrolled ? '1px solid #e2e8f0' : '1px solid #f1f5f9',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.3s ease',
          padding: '0 32px',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', lineHeight: 1.1, fontFamily: "'Prompt', sans-serif" }}>ของหาย</div>
              <div style={{ fontSize: 10, color: '#64748b', letterSpacing: '0.1em', fontWeight: 500 }}>LOST & FOUND</div>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: pathname === href ? 600 : 400,
                  color: pathname === href ? '#1e40af' : '#475569',
                  background: pathname === href ? '#eff6ff' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
              >{label}</Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isClient && username ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px', borderRadius: 100,
                  background: '#f1f5f9', border: '1px solid #e2e8f0',
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: userRole == '1' ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, color: '#fff', fontWeight: 700,
                  }}>{username.charAt(0).toUpperCase()}</div>
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{username}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100,
                    background: userRole == '1' ? '#fef3c7' : '#dbeafe',
                    color: userRole == '1' ? '#92400e' : '#1e40af',
                  }}>{userRole == '1' ? 'แอดมิน' : 'ผู้ใช้'}</span>
                </div>
                <button onClick={handleLogout} style={{
                  padding: '7px 16px', borderRadius: 8,
                  background: '#fff', border: '1px solid #fca5a5',
                  color: '#dc2626', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                }}>ออกจากระบบ</button>
              </div>
            ) : isClient ? (
              <button onClick={() => window.location.href = '/user/login'} style={{
                padding: '8px 20px', borderRadius: 8,
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: 'none', boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
              }}>เข้าสู่ระบบ</button>
            ) : null}
          </div>
        </nav>

        <main style={{ flex: 1 }}>{children}</main>

        {!isLogin && (
          <footer style={{ background: '#1e293b', color: '#94a3b8', fontFamily: "'Sarabun', sans-serif" }}>
            <div style={{
              maxWidth: 1100, margin: '0 auto', padding: '56px 24px 40px',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', fontFamily: "'Prompt', sans-serif" }}>ระบบของหาย</div>
                    <div style={{ fontSize: 10, letterSpacing: '0.1em', color: '#64748b' }}>LOST & FOUND SYSTEM</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.8, color: '#64748b', maxWidth: 260 }}>
                 ระบบจัดการของหายและของเจอ เพื่ออำนวยความสะดวกในการติดตามและรับคืนทรัพย์สิน
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>เมนูหลัก</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[{ href: '/', label: 'หน้าหลัก' }, { href: '/user/login', label: 'เข้าสู่ระบบ' }, { href: '/item/report', label: 'แจ้งของหาย' }].map(({ href, label }) => (
                    <li key={href}><Link href={href} style={{ color: '#64748b', textDecoration: 'none', fontSize: 14 }}>→ {label}</Link></li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>ติดต่อเรา</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { icon: '', label: 'ที่ตั้ง', value: 'มหาวิทยาลัยสงขลานครินทร์' },
                    { icon: '', label: 'โทรศัพท์', value: '000-888888 ต่อ 1234' },
                    { icon: '', label: 'เวลาทำการ', value: '24 ชั่วโมง' },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 14, marginTop: 2 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 1 }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>สถานะระบบ</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[{ label: 'ระบบหลัก', ok: true }, { label: 'ฐานข้อมูล', ok: true }, { label: 'อัปโหลดรูปภาพ', ok: true }].map(({ label, ok }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderRadius: 8, background: '#0f172a' }}>
                      <span style={{ fontSize: 13 }}>{label}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: ok ? '#4ade80' : '#f87171' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: ok ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
                        {ok ? 'ปกติ' : 'ขัดข้อง'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, maxWidth: 1100, margin: '0 auto' }}>
              <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>© {new Date().getFullYear()} ระบบของหาย · พัฒนาโดยทีม Lost & Found</p>
              <div style={{ display: 'flex', gap: 16 }}>
                {['นโยบายความเป็นส่วนตัว', 'เงื่อนไขการใช้งาน'].map(t => (
                  <span key={t} style={{ fontSize: 12, color: '#475569', cursor: 'pointer' }}>{t}</span>
                ))}
              </div>
            </div>
          </footer>
        )}

        <style>{`* { box-sizing: border-box; } a { font-family: 'Sarabun', sans-serif; } button { font-family: 'Sarabun', sans-serif; }`}</style>
      </body>
    </html>
  );
}
