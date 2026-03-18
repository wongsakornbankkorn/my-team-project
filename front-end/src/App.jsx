import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ของแบงค์
import CategoryList from './pages/category/CategoryList';
import CategoryForm from './pages/category/CategoryForm';
import CategoryReport from './pages/category/CategoryReport';

// ของถั่วพู
import ItemList from './pages/item/ItemList';
import ItemForm from './pages/item/ItemForm';
import ItemReport from './pages/item/ItemReport';
import ItemPublic from './pages/item/ItemPublic';

// ของปั้น 
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import UserList from './pages/user/UserList';
import UserForm from './pages/user/UserForm';
import UserReport from './pages/user/UserReport';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ padding: '15px', background: '#333', color: 'white', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>ระบบจัดการของหาย (Admin)</h2>
        </nav>

        <Routes>
          {/* หน้าแรก → ไปหน้า Login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* ของปั้น */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/create" element={<UserForm />} />
          <Route path="/users/edit/:id" element={<UserForm />} />
          <Route path="/users/report" element={<UserReport />} />

          {/* ของแบงค์ */}
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/new" element={<CategoryForm />} />
          <Route path="/categories/edit/:id" element={<CategoryForm />} />
          <Route path="/categories/report" element={<CategoryReport />} />

          {/* ของถั่วพู */}
          <Route path="/items" element={<ItemList />} />
          <Route path="/items/new" element={<ItemForm />} />
          <Route path="/items/edit/:id" element={<ItemForm />} />
          <Route path="/items/report" element={<ItemReport />} />
          <Route path="/public" element={<ItemPublic />} />
          <Route path="/report-lost" element={<ItemForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;