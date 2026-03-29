"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import locationService from '../../services/locationService';

export default function LocationList() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await locationService.getLocations();
      if (res.data) {
        setLocations(res.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบสถานที่นี้?')) {
      try {
        await locationService.deleteLocation(id);
        alert('ลบข้อมูลสำเร็จ');
        fetchLocations();
      } catch (error) {
        console.error('Error deleting location:', error);
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดข้อมูล...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>จัดการสถานที่ (Location)</h2>

      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <Link href="/location/form">
          <button style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            + เพิ่มสถานที่ใหม่
          </button>
        </Link>
        <Link href="/location/report">
          <button style={{ padding: '10px 15px', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            รายงาน
          </button>
        </Link>
      </div>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>ชื่อสถานที่</th>
            <th style={{ padding: '10px' }}>รายละเอียด</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {locations.length > 0 ? (
            locations.map((loc) => (
              <tr key={loc.id}>
                <td style={{ padding: '10px' }}>{loc.id}</td>
                <td style={{ padding: '10px' }}><strong>{loc.name}</strong></td>
                <td style={{ padding: '10px' }}>{loc.description || '-'}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <Link href={`/location/form?id=${loc.id}`}>
                    <button style={{ marginRight: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>แก้ไข</button>
                  </Link>
                  <button onClick={() => handleDelete(loc.id)} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>ลบ</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>ไม่มีข้อมูลสถานที่</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}