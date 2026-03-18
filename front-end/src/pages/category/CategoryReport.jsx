import React, { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';

const CategoryReport = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res.success) {
          setCategories(res.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report:', error);
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  // ฟังก์ชันสำหรับการสั่งพิมพ์หน้ารายงาน
  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div style={{ padding: '20px' }}>กำลังประมวลผลรายงาน...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#fff' }}>
      {/* ส่วนหัวของรายงาน */}
      <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        <h1 style={{ margin: '0' }}>รายงานสรุปประเภทการแจ้ง (Category Report)</h1>
        <p style={{ color: '#666' }}>ระบบจัดการแจ้งของหายและแจ้งเจอ | ข้อมูล ณ วันที่ {new Date().toLocaleDateString('th-TH')}</p>
      </div>

      {/* ปุ่มเครื่องมือ (จะถูกซ่อนเวลาสั่งพิมพ์ด้วย CSS) */}
      <div className="no-print" style={{ marginBottom: '20px', textAlign: 'right' }}>
        <button 
          onClick={handlePrint}
          style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          🖨️ พิมพ์รายงาน
        </button>
      </div>

      {/* ตารางรายงาน */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={tableHeaderStyle}>ลำดับ</th>
            <th style={tableHeaderStyle}>ชื่อหมวดหมู่ / ประเภทการแจ้ง</th>
            <th style={tableHeaderStyle}>รายละเอียด</th>
            <th style={tableHeaderStyle}>วันที่บันทึกระบบ</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((item, index) => (
              <tr key={item.id}>
                <td style={tableIdStyle}>{index + 1}</td>
                <td style={tableCellStyle}><strong>{item.notice_type_name}</strong></td>
                <td style={tableCellStyle}>{item.description || '-'}</td>
                <td style={tableCellStyle}>{new Date(item.createdAt).toLocaleDateString('th-TH')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>ไม่พบข้อมูลประเภทการแจ้ง</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* สรุปท้ายรายงาน */}
      <div style={{ marginTop: '30px', textAlign: 'right', fontWeight: 'bold' }}>
        <p>รวมทั้งสิ้น: {categories.length} รายการ</p>
      </div>

      {/* CSS สำหรับซ่อนปุ่มเวลาสั่งพิมพ์ */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { padding: 0; }
          }
        `}
      </style>
    </div>
  );
};

// สไตล์สำหรับตาราง
const tableHeaderStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  textAlign: 'left'
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '12px'
};

const tableIdStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  textAlign: 'center',
  width: '50px'
};

export default CategoryReport;