"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ReportUnified() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    notice_title: '',
    notice_type_id: '',
    place_id: '',
    notice_status_id: '1',
    description: ''

  });

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');

        //  เพิ่มเกราะป้องกันตรงนี้! เช็คให้ชัวร์ว่าเป็น Array ก่อนเอาไปใช้
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        } else {
          setCategories([]); // ถ้าไม่ใช่เลย ก็ให้เป็นกรอบเปล่าๆ หน้าเว็บจะได้ไม่พัง
        }

      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();

    const fetchLocations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/locations');
        if (res.data && Array.isArray(res.data.data)) {
          setLocations(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append('notice_title', formData.notice_title);
      data.append('notice_type_id', formData.notice_type_id);
      data.append('place_id', formData.place_id);
      data.append('notice_status_id', formData.notice_status_id);
      data.append('description', formData.description);
      data.append('user_id', 1);
      if (imageFile) data.append('image', imageFile);

      await axios.post('http://localhost:5000/api/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('บันทึกข้อมูลลงระบบสำเร็จ!');
      router.push('/');
    } catch (error) {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)', width: '100%', maxWidth: '500px', borderTop: '5px solid #3B82F6' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginTop: 0 }}>  <> <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-envelope-paper" viewBox="0 0 16 16">
  <path d="M4 0a2 2 0 0 0-2 2v1.133l-.941.502A2 2 0 0 0 0 5.4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5.4a2 2 0 0 0-1.059-1.765L14 3.133V2a2 2 0 0 0-2-2zm10 4.267.47.25A1 1 0 0 1 15 5.4v.817l-1 .6zm-1 3.15-3.75 2.25L8 8.917l-1.25.75L3 7.417V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1zm-11-.6-1-.6V5.4a1 1 0 0 1 .53-.882L2 4.267zm13 .566v5.734l-4.778-2.867zm-.035 6.88A1 1 0 0 1 14 15H2a1 1 0 0 1-.965-.738L8 10.083zM1 13.116V7.383l4.778 2.867L1 13.117Z"/>
       </svg> </>ฟอร์มแจ้งข้อมูล</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div>
            <label style={labelStyle}>ประเภทการแจ้ง:</label>
            <select
              style={inputStyle}
              value={formData.notice_status_id}
              onChange={e => setFormData({ ...formData, notice_status_id: e.target.value })}
            >
              <option value="1">ฉันทำของหาย (กำลังตามหา)</option>
              <option value="2">ฉันเก็บของได้ (ประกาศหาเจ้าของ)</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>ชื่อสิ่งของ:</label>
            <input type="text" required style={inputStyle} placeholder="เช่น กระเป๋าสตางค์, กุญแจรถ"
              value={formData.notice_title} onChange={e => setFormData({ ...formData, notice_title: e.target.value })} />
          </div>

          <div>
            <label style={labelStyle}>หมวดหมู่สิ่งของ:</label>
            <select
              required
              style={inputStyle}
              value={formData.notice_type_id}
              onChange={e => setFormData({ ...formData, notice_type_id: e.target.value })}
            >
              <option value="" disabled>-- กรุณาเลือกหมวดหมู่ --</option>

              {/*  สังเกตตรงวงเล็บ (cat, index) และ key={index} นะครับ นี่คือตัวแก้ Error! */}
              {Array.isArray(categories) && categories.length > 0 ? categories.map((cat, index) => (
                <option key={index} value={cat.notice_type_id || cat.id}>
                  {cat.notice_type_name || cat.name}
                </option>
              )) : <option disabled>กำลังโหลดข้อมูล...</option>}

            </select>
          </div>

          <label style={labelStyle}>สถานที่:</label>
          <select
            required
            style={inputStyle}
            value={formData.place_id}
            onChange={e => setFormData({ ...formData, place_id: e.target.value })}
          >
            <option value="" disabled>-- กรุณาเลือกสถานที่ --</option>
            {locations.length > 0 ? locations.map((loc, index) => (
              <option key={index} value={loc.id}>
                {loc.name}
              </option>
            )) : <option disabled>กำลังโหลดข้อมูล...</option>}

          </select>
          <div>

            <label style={labelStyle}>รายละเอียดเพิ่มเติม:</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="เช่น ด้านหน้าตึกเคมี พบบริเวณโต๊ะกินข้าว..."
              rows="3"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />

          </div>


          <div>
            <label style={labelStyle}>รูปภาพสิ่งของ:</label>
            <input
              type="file"
              accept="image/*"
              style={inputStyle}
              onChange={e => setImageFile(e.target.files[0])}
            />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                style={{ width: '100%', marginTop: '10px', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }}
              />
            )}
          </div>

          <button type="submit" disabled={isLoading} style={{ ...btnStyle, backgroundColor: isLoading ? '#93c5fd' : '#3B82F6' }}>
            {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontFamily: "'Prompt', sans-serif", backgroundColor: '#f8fafc' };
const btnStyle = { padding: '15px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' };