import React, { useState, useEffect } from 'react';
import itemService from '../../services/itemService';

const ItemReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const items = await itemService.getAllItems();
        
        // Logic: แยกกลุ่มข้อมูลตามเดือนและปี
        const monthlySummary = items.reduce((acc, item) => {
          const date = new Date(item.createdAt || new Date()); // ใช้ createdAt ถ้าไม่มีใช้เวลาปัจจุบัน
          const monthYear = date.toLocaleString('th-TH', { month: 'long', year: 'numeric' });
          
          if (!acc[monthYear]) {
            acc[monthYear] = { month: monthYear, total: 0, lost: 0, found: 0, returned: 0 };
          }
          
          acc[monthYear].total += 1;
          if (item.notice_status_id == 1) acc[monthYear].lost += 1;
          else if (item.notice_status_id == 2) acc[monthYear].found += 1;
          else if (item.notice_status_id == 3) acc[monthYear].returned += 1;
          
          return acc;
        }, {});

        setReportData(Object.values(monthlySummary));
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>กำลังคำนวณรายงาน...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        📊 สรุปยอดการแจ้งหาย/เจอ แยกตามเดือน
      </h2>
      
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '12px' }}>เดือน / ปี</th>
            <th style={{ padding: '12px', color: '#dc3545' }}>แจ้งหาย</th>
            <th style={{ padding: '12px', color: '#ffc107' }}>แจ้งเจอ</th>
            <th style={{ padding: '12px', color: '#28a745' }}>คืนของแล้ว</th>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>รวมทั้งหมด</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((row, index) => (
            <tr key={index}>
              <td style={{ padding: '12px' }}>{row.month}</td>
              <td style={{ padding: '12px' }}>{row.lost}</td>
              <td style={{ padding: '12px' }}>{row.found}</td>
              <td style={{ padding: '12px' }}>{row.returned}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => window.print()} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }} className="no-print">
        🖨️ พิมพ์รายงานสรุป
      </button>
    </div>
  );
};

export default ItemReport;