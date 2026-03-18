import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import categoryService from '../../services/categoryService';

const CategoryForm = () => {
  // สร้างตัวแปรเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    notice_type_name: '',
    description: ''
  });
  
  const navigate = useNavigate(); // ตัวช่วยเปลี่ยนหน้า
  const { id } = useParams(); // ตัวช่วยดึง ID จาก URL (ถ้ามี id = โหมดแก้ไข, ถ้าไม่มี = โหมดสร้างใหม่)

  // ดึงข้อมูลเก่ามาใส่ฟอร์ม ถ้าอยู่ในโหมดแก้ไข
  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const res = await categoryService.getCategoryById(id);
          if (res.success) {
            setFormData({
              notice_type_name: res.data.notice_type_name,
              description: res.data.description || ''
            });
          }
        } catch (error) {
          console.error('Error fetching category:', error);
          alert('ดึงข้อมูลผิดพลาด');
        }
      };
      fetchCategory();
    }
  }, [id]);

  // ฟังก์ชันอัปเดตข้อมูลเมื่อมีการพิมพ์ในช่องกรอก
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ฟังก์ชันเมื่อกดปุ่มบันทึก (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรชตอนกดปุ่ม
    
    try {
      if (id) {
        // อัปเดตข้อมูล (ส่ง id ไปด้วย)
        await categoryService.updateCategory(id, formData);
        alert('แก้ไขข้อมูลสำเร็จ!');
      } else {
        // สร้างข้อมูลใหม่
        await categoryService.createCategory(formData);
        alert('เพิ่มหมวดหมู่สำเร็จ!');
      }
      navigate('/categories'); // บันทึกเสร็จให้เด้งกลับไปหน้าตาราง
    } catch (error) {
      console.error('Error saving category:', error);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่ (ชื่อหมวดหมู่อาจจะซ้ำ)');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>{id ? '✏️ แก้ไขหมวดหมู่' : '✨ เพิ่มหมวดหมู่ใหม่'}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อหมวดหมู่: <span style={{color:'red'}}>*</span></label>
          <input 
            type="text" 
            name="notice_type_name" 
            value={formData.notice_type_name} 
            onChange={handleChange} 
            required 
            placeholder="เช่น กระเป๋า, อุปกรณ์ไอที"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รายละเอียด (ถ้ามี):</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows="4"
            placeholder="อธิบายเพิ่มเติมเกี่ยวกับหมวดหมู่นี้"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          ></textarea>
        </div>

        <div style={{ marginTop: '10px' }}>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            💾 บันทึกข้อมูล
          </button>
          <button type="button" onClick={() => navigate('/categories')} style={{ padding: '10px 20px', marginLeft: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            ❌ ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;