import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/authService'
import './Login.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError('Username หรือ Password ไม่ถูกต้อง')
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow login-card">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4">เข้าสู่ระบบ</h3>
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
                <button type="submit" className="btn btn-primary w-100">เข้าสู่ระบบ</button>
              </form>
              <div className="text-center mt-3">
                <span>ยังไม่มีบัญชี? </span>
                <a href="/register">สมัครสมาชิก</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login