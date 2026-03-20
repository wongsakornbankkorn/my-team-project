"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { useEffect, useState } from 'react';

export default function RootLayout({ children }) {
  const pathname = usePathname(); 
  const [isClient, setIsClient] = useState(false); // เพิ่มตัวเช็คสถานะ
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    setIsClient(true); // บอกว่าระบบโหลดฝั่งผู้ใช้เสร็จแล้ว
    setUserRole(localStorage.getItem('role'));
    setUsername(localStorage.getItem('username'));
  }, [pathname]);

  const handleLogout = () => {
    if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      window.location.href = '/user/login'; 
    }
  };

  return (
    <html lang="th">
      <body style={{ margin: 0, fontFamily: "'Prompt', sans-serif", backgroundColor: '#f4f7f6' }}>
        <nav style={{ backgroundColor: '#2c3e50', padding: '15px 30px', display: 'flex', gap: '25px', alignItems: 'center' }}>
          <strong style={{ fontSize: '20px', color: '#f1c40f', marginRight: 'auto' }}>🕵️ ระบบของหาย</strong>
          
          <Link href="/" style={navStyle}>🏠 หน้าหลัก</Link>
          
          {/* 👇 โชว์เมนูแอดมิน ก็ต่อเมื่อระบบเช็คชัวร์แล้วว่าเป็นแอดมิน */}
          {isClient && userRole == '1' && (
            <>
              <Link href="/item" style={navStyle}>📦 การแจ้ง</Link>
              <Link href="/category" style={navStyle}>📂 หมวดหมู่</Link>
              <Link href="/location" style={navStyle}>📍 สถานที่</Link>
              <Link href="/user" style={navStyle}>👥 สมาชิก</Link>
            </>
          )}
          
          {/* 👇 สลับปุ่ม เข้าสู่ระบบ / ออกจากระบบ แบบเป๊ะๆ */}
          {isClient && username ? (
            <button onClick={handleLogout} style={logoutBtn}>🚪 ออกจากระบบ</button>
          ) : isClient ? (
            <button onClick={() => window.location.href = '/user/login'} style={loginBtn}>🔐 เข้าสู่ระบบ</button>
          ) : null}
        </nav>
        
        <main style={{ padding: '20px' }}>{children}</main>
      </body>
    </html>
  );
}

const navStyle = { color: 'white', textDecoration: 'none', fontSize: '15px' };
const logoutBtn = { padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const loginBtn = { padding: '8px 15px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };