"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import itemService from '../../../services/itemService';
import categoryService from '../../../services/categoryService';

export default function ItemForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [formData, setFormData] = useState({
    notice_title: '', notice_type_id: '', place_id: 1, user_id: 1, notice_status_id: 1 
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      // โหลดหมวดหมู่ของแบงค์
      const catRes = await categoryService.getCategories();
      if (catRes.success) {
        setCategories(catRes.data);
        if (!id && catRes.data.length > 0) setFormData(prev => ({ ...prev, notice_type_id: catRes.data[0].id }));
      }
      // ถ้าแก้ไข โหลดข้อมูลเดิม
      if (id) {
        const item = await itemService.getItemById(id);
        setFormData({ ...item, notice_status_id: item.notice_status_id || 1 });
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) await itemService.updateItem(id, formData);
    else await itemService.createItem(formData);
    alert('บันทึกสำเร็จ!');
    router.push('/item');
  };

  return (
    <div style={{ maxWidth: '500px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
      <h2>{id ? '🛠️ แก้ไขรายการและสถานะ' : '📝 แจ้งรายการใหม่'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>หัวข้อที่แจ้ง:</label>
          <input type="text" value={formData.notice_title} onChange={e => setFormData({...formData, notice_title: e.target.value})} required style={inputStyle} />
        </div>
        <div>
          <label>ประเภทสิ่งของ (ดึงจากแบงค์):</label>
          <select value={formData.notice_type_id} onChange={e => setFormData({...formData, notice_type_id: e.target.value})} style={inputStyle}>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.notice_type_name}</option>)}
          </select>
        </div>
        <div>
          <label>รหัสสถานที่ (รอหนึ่งทำเสร็จค่อยเปลี่ยนเป็น Dropdown):</label>
          <input type="number" value={formData.place_id} onChange={e => setFormData({...formData, place_id: e.target.value})} required style={inputStyle} />
        </div>
        {id && (
          <div style={{ padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '5px' }}>
            <label>📢 อัปเดตสถานะ (พนักงาน):</label>
            <select value={formData.notice_status_id} onChange={e => setFormData({...formData, notice_status_id: e.target.value})} style={inputStyle}>
              <option value={1}>🚨 กำลังตามหา (แจ้งหาย)</option>
              <option value={2}>✅ พบของแล้ว (แจ้งเจอ)</option>
              <option value={3}>🎉 ส่งคืนเจ้าของสำเร็จ</option>
            </select>
          </div>
        )}
        <button type="submit" style={{ padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}>บันทึกข้อมูล</button>
        <button type="button" onClick={() => router.push('/item')} style={{ padding: '10px' }}>ย้อนกลับ</button>
      </form>
    </div>
  );
}
const inputStyle = { width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' };