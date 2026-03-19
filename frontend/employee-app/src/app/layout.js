import Link from 'next/link';
// import './globals.css'; // ถ้ามีไฟล์ css ให้เปิดคอมเมนต์ตรงนี้

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#f4f7f6' }}>
        {/* แถบเมนู (Navbar) */}
        <nav style={{ backgroundColor: '#2c3e50', padding: '15px 30px', display: 'flex', gap: '25px', alignItems: 'center' }}>
          <strong style={{ fontSize: '20px', color: '#f1c40f', marginRight: '20px' }}>🕵️ ระบบของหาย</strong>
          <Link href="/" style={navStyle}>🏠 หน้าหลัก</Link>
          <Link href="/item" style={navStyle}>📦 การแจ้ง (ถั่วพู)</Link>
          <Link href="/category" style={navStyle}>📂 หมวดหมู่ (แบงค์)</Link>
          <Link href="/location" style={navStyle}>📍 สถานที่ (หนึ่ง)</Link>
          <Link href="/user" style={navStyle}>👥 สมาชิก (ปั้น)</Link>
        </nav>
        
        {/* พื้นที่แสดงเนื้อหาของแต่ละหน้า */}
        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}

const navStyle = { color: 'white', textDecoration: 'none', fontSize: '16px' };
