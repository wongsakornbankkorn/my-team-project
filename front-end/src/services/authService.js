import axios from 'axios'

const API_URL = 'http://localhost:5000/api/auth'

export const register = async (username, password, role_id) => {
  const response = await axios.post(`${API_URL}/register`, {
    username, password, role_id
  })
  return response.data
}

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    username, password
  })
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  return response.data
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}