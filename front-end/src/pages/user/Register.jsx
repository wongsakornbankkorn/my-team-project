import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../../services/authService'
import './Register.css'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(username, password, 2)
      navigate('/login')
    } catch (err) {
      setError('สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่')
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow register-card">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4">สมัครสมาชิก</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control" value={username}
                    onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" value={password}
                    onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-success w-100">สมัครสมาชิก</button>
              </form>
              <div className="text-center mt-3">
                <span>มีบัญชีแล้ว? </span>
                <a href="/login">เข้าสู่ระบบ</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Register