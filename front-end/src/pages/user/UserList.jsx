import { useState, useEffect } from 'react'
import { getAllUsers, deleteUser } from '../../services/userService'
import { useNavigate } from 'react-router-dom'
import './UserList.css'

function UserList() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลได้')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('ต้องการลบ User นี้ใช่ไหม?')) {
      try {
        await deleteUser(id)
        fetchUsers()
      } catch (err) {
        setError('ลบไม่สำเร็จ')
      }
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>รายชื่อผู้ใช้งาน</h3>
        <button className="btn btn-primary" onClick={() => navigate('/users/create')}>+ เพิ่ม User</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card shadow">
        <div className="card-body">
          <table className="table table-hover userlist-table">
            <thead>
              <tr><th>#</th><th>Username</th><th>Role</th><th>จัดการ</th></tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.user_id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.role_id === 1
                    ? <span className="badge bg-danger">Admin</span>
                    : <span className="badge bg-secondary">User</span>}
                  </td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2"
                      onClick={() => navigate(`/users/edit/${user.user_id}`)}>แก้ไข</button>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user.user_id)}>ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default UserList