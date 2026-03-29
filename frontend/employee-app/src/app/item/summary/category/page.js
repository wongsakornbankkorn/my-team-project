"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import itemService from '../../../../services/itemService';

export default function CategoryReport() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    itemService.getReportByCategory()
      .then(res => setData(res))
      .catch(err => { console.error(err); setError('ไม่สามารถโหลดข้อมูลได้'); })
      .finally(() => setLoading(false));
  }, []);

  const grandTotal    = data.reduce((s, r) => s + Number(r.total),    0);
  const grandLost     = data.reduce((s, r) => s + Number(r.lost),     0);
  const grandFound    = data.reduce((s, r) => s + Number(r.found),    0);
  const grandReturned = data.reduce((s, r) => s + Number(r.returned), 0);

  const barKey   = filter === 'lost' ? 'lost' : filter === 'found' ? 'found' : filter === 'returned' ? 'returned' : 'total';
  const barColor = filter === 'lost' ? '#ef4444' : filter === 'found' ? '#f97316' : filter === 'returned' ? '#22c55e' : '#6366f1';
  const maxVal   = Math.max(...data.map(r => Number(r[barKey]) || 0), 1);

  const filterTabs = [
    { key: 'all',      label: 'ทั้งหมด',       color: '#6366f1' },
    { key: 'lost',     label: 'แจ้งหาย',    color: '#ef4444' },
    { key: 'found',    label: 'แจ้งเจอ',    color: '#f97316' },
    { key: 'returned', label: 'คืนของแล้ว', color: '#22c55e' },
  ];

  if (loading) return (
    <div style={s.center}>
      <div style={s.spinner} />
      <p style={{ color: '#94a3b8', marginTop: 16 }}>กำลังโหลดรายงาน...</p>
    </div>
  );

  if (error) return (
    <div style={s.center}>
      <p style={{ color: '#ef4444' }}> {error}</p>
      <Link href="/item/summary"><button style={s.btnGray}>← กลับ</button></Link>
    </div>
  );

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <p style={s.breadcrumb}>รายงาน / แยกตามประเภท</p>
          <h1 style={s.title}>รายงานแยกตามประเภทการแจ้ง</h1>
          <p style={s.subtitle}>สรุปจำนวนการแจ้งหายและแจ้งเจอ แบ่งตามหมวดหมู่สิ่งของ</p>
        </div>
        <div style={s.headerBtns}>
          <button onClick={() => window.print()} style={s.btnDark}>พิมพ์</button>
          <Link href="/item/summary"><button style={s.btnGray}>← รายงานรายเดือน</button></Link>
          <Link href="/item"><button style={s.btnGray}>← กลับ</button></Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={s.cardRow}>
        {[
          { label: 'รายการทั้งหมด', value: grandTotal,    color: '#6366f1', icon: '' },
          { label: 'แจ้งหาย',       value: grandLost,     color: '#ef4444', icon: '' },
          { label: 'แจ้งเจอ',       value: grandFound,    color: '#f97316', icon: '' },
          { label: 'คืนของแล้ว',    value: grandReturned, color: '#22c55e', icon: '' },
        ].map(c => (
          <div key={c.label} style={{ ...s.card, borderTop: `4px solid ${c.color}` }}>
            <span style={{ fontSize: 28 }}>{c.icon}</span>
            <div style={{ ...s.cardNum, color: c.color }}>{c.value}</div>
            <div style={s.cardLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>กราฟแสดงจำนวนตามประเภท</h2>
          <div style={s.tabs}>
            {filterTabs.map(t => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                style={{
                  ...s.tab,
                  backgroundColor: filter === t.key ? t.color : 'transparent',
                  color:           filter === t.key ? '#fff' : '#64748b',
                  border:          `1px solid ${filter === t.key ? t.color : '#e2e8f0'}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={s.chartWrap}>
          {data.length === 0 && (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>ยังไม่มีข้อมูล</p>
          )}
          {data.map((row, i) => {
            const val = Number(row[barKey]) || 0;
            const pct = (val / maxVal) * 100;
            return (
              <div key={i} style={s.barRow}>
                <div style={s.barLabel} title={row.category_name}>{row.category_name}</div>
                <div style={s.barTrack}>
                  <div style={{ ...s.barFill, width: `${pct}%`, backgroundColor: barColor }} />
                </div>
                <div style={{ ...s.barVal, color: barColor }}>{val}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>ตารางสรุปรายละเอียด</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>#</th>
                <th style={{ ...s.th, textAlign: 'left' }}>ประเภท / หมวดหมู่</th>
                <th style={{ ...s.th, color: '#ef4444' }}>แจ้งหาย</th>
                <th style={{ ...s.th, color: '#f97316' }}>แจ้งเจอ</th>
                <th style={{ ...s.th, color: '#22c55e' }}>คืนของแล้ว</th>
                <th style={{ ...s.th, color: '#6366f1' }}>รวม</th>
                <th style={s.th}>สัดส่วน</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ ...s.td, textAlign: 'center', color: '#94a3b8', padding: 32 }}>
                   ยังไม่มีข้อมูล
                  </td>
                </tr>
              ) : data.map((row, i) => {
                const pct = grandTotal > 0
                  ? ((Number(row.total) / grandTotal) * 100).toFixed(1)
                  : '0.0';
                return (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <td style={{ ...s.td, textAlign: 'center', color: '#94a3b8' }}>{i + 1}</td>
                    <td style={{ ...s.td, fontWeight: 600, color: '#1e293b' }}>{row.category_name}</td>
                    <td style={{ ...s.td, textAlign: 'center', color: '#ef4444', fontWeight: 700 }}>{row.lost}</td>
                    <td style={{ ...s.td, textAlign: 'center', color: '#f97316', fontWeight: 700 }}>{row.found}</td>
                    <td style={{ ...s.td, textAlign: 'center', color: '#22c55e', fontWeight: 700 }}>{row.returned}</td>
                    <td style={{ ...s.td, textAlign: 'center', color: '#6366f1', fontWeight: 700 }}>{row.total}</td>
                    <td style={{ ...s.td, textAlign: 'center' }}>
                      <div style={s.pctWrap}>
                        <div style={{ ...s.pctBar, width: `${pct}%` }} />
                        <span style={s.pctText}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {data.length > 0 && (
                <tr style={{ backgroundColor: '#eef2ff', fontWeight: 700 }}>
                  <td colSpan="2" style={{ ...s.td, color: '#4338ca' }}>รวมทั้งหมด</td>
                  <td style={{ ...s.td, textAlign: 'center', color: '#ef4444' }}>{grandLost}</td>
                  <td style={{ ...s.td, textAlign: 'center', color: '#f97316' }}>{grandFound}</td>
                  <td style={{ ...s.td, textAlign: 'center', color: '#22c55e' }}>{grandReturned}</td>
                  <td style={{ ...s.td, textAlign: 'center', color: '#6366f1' }}>{grandTotal}</td>
                  <td style={{ ...s.td, textAlign: 'center', color: '#64748b' }}>100%</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @media print { button, a { display: none !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const s = {
  page:       { fontFamily: "'Prompt', sans-serif", padding: '32px 24px', maxWidth: 1100, margin: '0 auto', color: '#1e293b' },
  center:     { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 16 },
  spinner:    { width: 40, height: 40, borderRadius: '50%', border: '4px solid #e2e8f0', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32, paddingBottom: 24, borderBottom: '2px solid #e2e8f0' },
  breadcrumb: { fontSize: 12, color: '#94a3b8', marginBottom: 4 },
  title:      { fontSize: 28, fontWeight: 700, margin: 0, color: '#0f172a' },
  subtitle:   { fontSize: 14, color: '#64748b', marginTop: 6 },
  headerBtns: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  btnDark:    { padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', backgroundColor: '#1e293b', color: '#fff', fontSize: 13, fontWeight: 500 },
  btnGray:    { padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', fontWeight: 500 },
  cardRow:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 },
  card:       { backgroundColor: '#fff', borderRadius: 12, padding: '20px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  cardNum:    { fontSize: 36, fontWeight: 700, lineHeight: 1.1 },
  cardLabel:  { fontSize: 13, color: '#64748b' },
  section:    { backgroundColor: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  sectionTitle:  { fontSize: 18, fontWeight: 600, margin: 0, color: '#0f172a' },
  tabs:       { display: 'flex', gap: 6, flexWrap: 'wrap' },
  tab:        { padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.15s' },
  chartWrap:  { display: 'flex', flexDirection: 'column', gap: 10 },
  barRow:     { display: 'flex', alignItems: 'center', gap: 10 },
  barLabel:   { width: 160, fontSize: 13, color: '#475569', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0 },
  barTrack:   { flex: 1, height: 28, backgroundColor: '#f1f5f9', borderRadius: 6, overflow: 'hidden' },
  barFill:    { height: '100%', borderRadius: 6, transition: 'width 0.5s ease', minWidth: 4 },
  barVal:     { width: 32, textAlign: 'right', fontSize: 14, fontWeight: 700, flexShrink: 0 },
  table:      { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  thead:      { backgroundColor: '#f8fafc' },
  th:         { padding: '12px 16px', fontWeight: 600, fontSize: 13, color: '#475569', borderBottom: '2px solid #e2e8f0', textAlign: 'center' },
  td:         { padding: '12px 16px', borderBottom: '1px solid #f1f5f9' },
  pctWrap:    { position: 'relative', height: 18, backgroundColor: '#f1f5f9', borderRadius: 4, minWidth: 80 },
  pctBar:     { position: 'absolute', left: 0, top: 0, height: '100%', backgroundColor: '#6366f1', borderRadius: 4, opacity: 0.7 },
  pctText:    { position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', fontSize: 11, fontWeight: 600, color: '#4338ca' },
};