import { useState, useEffect } from 'react'
import { getAllUsers } from '../../services/userService'
import './UserReport.css'

function UserReport() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลได้')
    }
  }

  const totalUsers = users.length
  const totalAdmin = users.filter(u => u.role_id === 1).length
  const totalUser = users.filter(u => u.role_id === 2).length

  return (
    <div className="container mt-4">
      <h3 className="mb-4">รายงานผู้ใช้งาน</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow report-card text-center">
            <div className="card-body">
              <h5 className="card-title">ผู้ใช้ทั้งหมด</h5>
              <h2 className="report-number">{totalUsers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow report-card text-center">
            <div className="card-body">
              <h5 className="card-title">Admin</h5>
              <h2 className="report-number text-danger">{totalAdmin}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow report-card text-center">
            <div className="card-body">
              <h5 className="card-title">User ทั่วไป</h5>
              <h2 className="report-number text-primary">{totalUser}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow">
        <div className="card-body">
          <table className="table table-hover report-table">
            <thead>
              <tr><th>#</th><th>Username</th><th>Role</th><th>วันที่สมัคร</th></tr>
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
                  <td>{new Date(user.regist_date * 1000).toLocaleDateString('th-TH')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default UserReport