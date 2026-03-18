import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// นำเข้าหน้า Component ที่เราสร้างไว้
import CategoryList from './pages/category/CategoryList';
import CategoryForm from './pages/category/CategoryForm';
import CategoryReport from './pages/category/CategoryReport';

import ItemList from './pages/item/ItemList';
import ItemForm from './pages/item/ItemForm';
import ItemReport from './pages/item/ItemReport';


function App() {
  return (
    <BrowserRouter>
      <div>
        {/* แถบเมนูด้านบน (Navbar ชั่วคราว) */}
        <nav style={{ padding: '15px', background: '#333', color: 'white', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>ระบบจัดการของหาย (Admin)</h2>
        </nav>

        {/* ส่วนแสดงผลเนื้อหาแต่ละหน้า */}
        <Routes>
          {/* หน้าแรกสุด ให้วิ่งไปหน้า Category อัตโนมัติก่อน */}
          <Route path="/" element={<Navigate to="/categories" />} />
          
          {/* เส้นทางสำหรับระบบ Category */}
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/new" element={<CategoryForm />} />
          <Route path="/categories/edit/:id" element={<CategoryForm />} />
          <Route path="/categories/report" element={<CategoryReport />} />
          {/* เส้นทางสำหรับระบบ Item ของถั่วพู */}
          <Route path="/items" element={<ItemList />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/items/new" element={<ItemForm />} />
          <Route path="/items/edit/:id" element={<ItemForm />} />
          <Route path="/items/report" element={<ItemReport />} />

          // เพิ่ม Route ใน App.jsx
       <Route path="/public" element={<ItemPublic />} />
       <Route path="/report-lost" element={<ItemForm />} /> {/* ใช้ฟอร์มเดียวกัน แต่ซ่อนส่วนพนักงานไว้ */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;