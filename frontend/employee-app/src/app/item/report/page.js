"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BankReportPage() {
  const [stats, setStats] = useState({
    total: 0,
    lost: 0,
    found: 0,
    returned: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      // 💡 ดึงข้อมูลรายการแจ้งทั้งหมดจากของถั่วพูมาคำนวณ
      const response = await axios.get('http://localhost:5000/api/items');
      const allItems = response.data.data;

      // 1. คำนวณยอดรวมแยกตามสถานะ
      const summary = {
        total: allItems.length,
        lost: allItems.filter(i => i.notice_status_id === 1).length,
        found: allItems.filter(i => i.notice_status_id === 2).length,
        returned: allItems.filter(i => i.notice_status_id === 3).length,
      };
      setStats(summary);

      // 2. จัดกลุ่มข้อมูลแยกตามเดือน (สำหรับสรุปยอดรายเดือน)
      const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      const grouped = allItems.reduce((acc, item) => {
        const date = new Date(item.createdAt);
        const monthName = months[date.getMonth()];
        if (!acc[monthName]) acc[monthName] = { month: monthName, count: 0 };
        acc[monthName].count += 1;
        return acc;
      }, {});
      
      setMonthlyData(Object.values(grouped));
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <p style={s.label}>Dashboard</p>
          <h1 style={s.title}>📊 รายงานสรุปยอดการแจ้ง</h1>
        </div>

        {/* ── Card สรุปตัวเลขด้านบน ── */}
        <div style={s.statGrid}>
          <div style={s.statCard}>
            <span style={s.statTitle}>รายการทั้งหมด</span>
            <span style={s.statNum}>{stats.total}</span>
          </div>
          <div style={{ ...s.statCard, borderLeft: '4px solid #ef4444' }}>
            <span style={s.statTitle}>กำลังตามหา</span>
            <span style={{ ...s.statNum, color: '#f87171' }}>{stats.lost}</span>
          </div>
          <div style={{ ...s.statCard, borderLeft: '4px solid #22c55e' }}>
            <span style={s.statTitle}>พบของแล้ว</span>
            <span style={{ ...s.statNum, color: '#4ade80' }}>{stats.found}</span>
          </div>
        </div>

        {/* ── ตารางสรุปรายเดือน ── */}
        <div style={s.reportBox}>
          <h3 style={s.boxTitle}>📈 สรุปยอดการแจ้งรายเดือน</h3>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>เดือน</th>
                <th style={s.th}>จำนวนรายการที่มีคนแจ้ง</th>
                <th style={s.th}>ความคืบหน้า</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data, idx) => (
                <tr key={idx} style={s.tr}>
                  <td style={s.td}>{data.month}</td>
                  <td style={s.td}>{data.count} รายการ</td>
                  <td style={s.td}>
                    {/* Visual Bar ง่ายๆ */}
                    <div style={{ ...s.barBase }}>
                      <div style={{ ...s.barFill, width: `${(data.count / stats.total) * 100}%` }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#0a0f1e', minHeight: '100vh', padding: '60px 0', color: '#e2e8f0', fontFamily: 'Prompt' },
  container: { maxWidth: 1000, margin: '0 auto', padding: '0 24px' },
  label: { color: '#f59e0b', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em' },
  title: { fontSize: 28, marginTop: 8, marginBottom: 40 },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 },
  statCard: { background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' },
  statTitle: { display: 'block', fontSize: 14, color: '#94a3b8', marginBottom: 10 },
  statNum: { fontSize: 32, fontWeight: 700 },
  reportBox: { background: 'rgba(255,255,255,0.03)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.07)' },
  boxTitle: { marginBottom: 24, fontSize: 18 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', color: '#64748b', fontSize: 13, textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.05)' },
  td: { padding: '20px 12px' },
  barBase: { width: '100%', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' },
  barFill: { height: '100%', background: '#f59e0b' }
};