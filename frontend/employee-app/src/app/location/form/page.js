"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import locationService from '../../../services/locationService';

export default function LocationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (id) {
      const fetchLocation = async () => {
        try {
          const res = await locationService.getLocationById(id);
          if (res.data) {
            setFormData({
              name: res.data.name,
              description: res.data.description || ''
            });
          }
        } catch (error) {
          console.error('Error fetching location:', error);
        }
      };
      fetchLocation();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await locationService.updateLocation(id, formData);
        alert('แก้ไขสถานที่สำเร็จ!');
      } else {
        await locationService.createLocation(formData);
        alert('เพิ่มสถานที่สำเร็จ!');
      }
      router.push('/location');
    } catch (error) {
      console.error('Error saving location:', error);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h2>{id ? 'แก้ไขสถานที่' : 'เพิ่มสถานที่ใหม่'}</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontWeight: 'bold' }}>ชื่อสถานที่:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold' }}>รายละเอียดเพิ่มเติม:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {id ? 'บันทึกการแก้ไข' : 'สร้างสถานที่'}
        </button>

        <button type="button" onClick={() => router.push('/location')} style={{ padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
         ยกเลิก
        </button>
      </form>
    </div>
  );
}