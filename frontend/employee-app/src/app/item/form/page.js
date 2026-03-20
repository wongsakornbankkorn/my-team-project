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
    notice_title: '',
    notice_type_id: '',
    place_id: 1,
    user_id: 1,
    notice_status_id: 1
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const catRes = await categoryService.getCategories();
        const catList = catRes?.success ? catRes.data : [];
        setCategories(catList);

        if (id) {
          const item = await itemService.getItemById(id);
          setFormData({
            notice_title:     item.notice_title     || '',
            notice_type_id:   item.notice_type_id   || (catList[0]?.id ?? ''),
            place_id:         item.place_id         || 1,
            user_id:          item.user_id          || 1,
            notice_status_id: item.notice_status_id || 1
          });
        } else {
          if (catList.length > 0) {
            setFormData(prev => ({ ...prev, notice_type_id: catList[0].id }));
          }
        }
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่อ');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (id) await itemService.updateItem(id, formData);
      else    await itemService.createItem(formData);
      alert('บันทึกสำเร็จ!');
      router.push('/item');
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดข้อมูล...</div>;
  if (error)   return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '500px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
      <h2>{id ? '🛠️ แก้ไขรายการและสถานะ' : '📝 แจ้งรายการใหม่'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        <div>
          <label>หัวข้อที่แจ้ง:</label>
          <input
            type="text"
            value={formData.notice_title}
            onChange={e => setFormData({...formData, notice_title: e.target.value})}
            required
            style={inputStyle}
            placeholder="เช่น กระเป๋าสีดำ, กุญแจรถ"
          />
        </div>

        <div>
          <label>ประเภทสิ่งของ (หมวดหมู่):</label>
          {categories.length > 0 ? (
            <select
              value={formData.notice_type_id}
              onChange={e => setFormData({...formData, notice_type_id: e.target.value})}
              style={inputStyle}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.notice_type_name}</option>
              ))}
            </select>
          ) : (
            <div style={{ padding: '8px', color: '#888', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px' }}>
              ยังไม่มีหมวดหมู่ (รอแบงค์เพิ่มข้อมูล)
            </div>
          )}
        </div>

        <div>
          <label>รหัสสถานที่ (รอหนึ่งทำ Dropdown):</label>
          <input
            type="number"
            value={formData.place_id}
            onChange={e => setFormData({...formData, place_id: e.target.value})}
            required
            min="1"
            style={inputStyle}
          />
        </div>

        {id && (
          <div style={{ padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '5px' }}>
            <label style={{ fontWeight: 'bold' }}>📢 อัปเดตสถานะ:</label>
            <select
              value={formData.notice_status_id}
              onChange={e => setFormData({...formData, notice_status_id: e.target.value})}
              style={inputStyle}
            >
              <option value={1}>🚨 กำลังตามหา (แจ้งหาย)</option>
              <option value={2}>✅ พบของแล้ว (แจ้งเจอ)</option>
              <option value={3}>🎉 ส่งคืนเจ้าของสำเร็จ</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          style={{ padding: '10px', backgroundColor: saving ? '#90caf9' : '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: saving ? 'not-allowed' : 'pointer' }}
        >
          {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/item')}
          style={{ padding: '10px', borderRadius: '4px', cursor: 'pointer' }}
        >
          ย้อนกลับ
        </button>
      </form>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };