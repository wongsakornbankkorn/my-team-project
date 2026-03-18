import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserById, updateUser } from '../../services/userService'
import { register } from '../../services/authService'
import './UserForm.css'

function UserForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role_id, setRoleId] = useState(2)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  useEffect(() => { if (isEdit) fetchUser() }, [id])

  const fetchUser = async () => {
    try {
      const data = await getUserById(id)
      setUsername(data.username)
      setRoleId(data.role_id)
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลได้')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEdit) {
        await updateUser(id, { username, password, role_id })
      } else {
        await register(username, password, role_id)
      }
      navigate('/users')
    } catch (err) {
      setError('บันทึกข้อมูลไม่สำเร็จ')
    }
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow userform-card">
            <div className="card-body p-4">
              <h3 className="card-title mb-4">{isEdit ? 'แก้ไข User' : 'เพิ่ม User'}</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control" value={username}
                    onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password {isEdit && '(เว้นว่างถ้าไม่ต้องการเปลี่ยน)'}</label>
                  <input type="password" className="form-control" value={password}
                    onChange={(e) => setPassword(e.target.value)} required={!isEdit} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select className="form-select" value={role_id}
                    onChange={(e) => setRoleId(Number(e.target.value))}>
                    <option value={1}>Admin</option>
                    <option value={2}>User</option>
                  </select>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">บันทึก</button>
                  <button type="button" className="btn btn-secondary"
                    onClick={() => navigate('/users')}>ยกเลิก</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default UserForm