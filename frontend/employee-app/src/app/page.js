export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>ยินดีต้อนรับสู่ ระบบจัดการของหาย (Admin) 🚀</h1>
      <p style={{ fontSize: '18px', color: '#555' }}>
        เลือกเมนูด้านบนเพื่อจัดการข้อมูลในระบบได้เลยครับ
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
        <div style={card}>📦 <strong>ถั่วพู:</strong> จัดการแจ้งหาย/เจอ</div>
        <div style={card}>📂 <strong>แบงค์:</strong> จัดการประเภทสิ่งของ</div>
        <div style={card}>📍 <strong>หนึ่ง:</strong> จัดการสถานที่</div>
        <div style={card}>👥 <strong>ปั้น:</strong> จัดการผู้ใช้งาน</div>
      </div>
    </div>
  );
}

const card = { padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', width: '200px' };
