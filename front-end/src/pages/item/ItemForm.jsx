import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import itemService from '../../services/itemService';
import categoryService from '../../services/categoryService';

const ItemForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ถ้ามี id แปลว่าเป็นโหมด "แก้ไข" (พนักงาน)

  const [formData, setFormData] = useState({
    notice_title: '',
    notice_type_id: '',
    place_id: 1, 
    user_id: 1,  
    notice_status_id: 1 
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // 1. โหลดหมวดหมู่จากงานของแบงค์มาทำ Dropdown
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res.success && res.data.length > 0) {
          setCategories(res.data);
          // ถ้าเป็นการสร้างใหม่ ให้เลือกหมวดหมู่แรกไว้รอเลย
          if (!id) {
            setFormData(prev => ({ ...prev, notice_type_id: res.data[0].id }));
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();

    // 2. ถ้ามี ID (โหมดแก้ไข) ให้ดึงข้อมูลเก่ามาโชว์
    if (id) {
      const fetchItem = async () => {
        try {
          const item = await itemService.getItemById(id);
          setFormData({
            notice_title: item.notice_title,
            notice_type_id: item.notice_type_id,
            place_id: item.place_id,
            user_id: item.user_id,
            notice_status_id: item.notice_status_id
          });
        } catch (error) {
          console.error('Error fetching item:', error);
        }
      };
      fetchItem();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await itemService.updateItem(id, formData);
        alert('✅ อัปเดตข้อมูลและสถานะเรียบร้อย (พนักงาน)');
        navigate('/items'); // พนักงานกลับหน้าจัดการ
      } else {
        await itemService.createItem(formData);
        alert('🚀 ส่งข้อมูลการแจ้งเรียบร้อยแล้ว!');
        navigate('/items'); // หรือเปลี่ยนเป็น navigate('/public') ถ้าทำหน้าหน้าบอร์ดเสร็จแล้ว
      }
    } catch (error) {
      alert('❌ เกิดข้อผิดพลาด กรุณาลองใหม่');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '500px', margin: 'auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: id ? '#f39c12' : '#2ecc71' }}>
          {id ? '🛠️ แก้ไขรายการ (พนักงาน)' : '📝 แจ้งของหาย / แจ้งเจอ'}
        </h2>
        <p style={{ color: '#666' }}>
          {id ? 'จัดการสถานะและข้อมูลสิ่งของ' : 'กรุณากรอกรายละเอียดให้ครบถ้วน'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        
        {/* ส่วนที่ 1: หัวข้อ (ทุกคนใช้) */}
        <div>
          <label style={{ fontWeight: 'bold' }}>หัวข้อที่แจ้ง:</label>
          <input 
            type="text" 
            name="notice_title" 
            value={formData.notice_title} 
            onChange={handleChange} 
            placeholder="เช่น พบกุญแจรถ, ทำกระเป๋าตังหาย"
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
        </div>

        {/* ส่วนที่ 2: หมวดหมู่ (ดึงข้อมูลจากแบงค์) */}
        <div>
          <label style={{ fontWeight: 'bold' }}>ประเภทสิ่งของ:</label>
          <select 
            name="notice_type_id" 
            value={formData.notice_type_id} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.notice_type_name}
              </option>
            ))}
          </select>
        </div>

        {/* ส่วนที่ 3: สถานที่ (รอข้อมูลจากหนึ่ง) */}
        <div>
          <label style={{ fontWeight: 'bold' }}>รหัสสถานที่ (Location ID):</label>
          <input 
            type="number" 
            name="place_id" 
            value={formData.place_id} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
        </div>

        {/* --- ส่วนที่ 4: จัดการสถานะ (จะโชว์เฉพาะพนักงาน ตอนกด "แก้ไข") --- */}
        {id && (
          <div style={{ padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '5px' }}>
            <label style={{ fontWeight: 'bold', color: '#856404' }}>📢 อัปเดตสถานะ (พนักงาน):</label>
            <select 
              name="notice_status_id" 
              value={formData.notice_status_id} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #856404' }}
            >
              <option value={1}>🚨 กำลังตามหา (แจ้งหาย)</option>
              <option value={2}>✅ พบของแล้ว (แจ้งเจอ)</option>
              <option value={3}>🎉 ส่งคืนเจ้าของสำเร็จ</option>
            </select>
          </div>
        )}
        {/* --------------------------------------------------------- */}

        <button type="submit" style={{ padding: '12px', backgroundColor: id ? '#f39c12' : '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          {id ? 'บันทึกการแก้ไข' : 'ยืนยันการแจ้งข้อมูล'}
        </button>

        <button type="button" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }}>
          ย้อนกลับ
        </button>
      </form>
    </div>
  );
};

export default ItemForm;