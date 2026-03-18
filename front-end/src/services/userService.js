import axios from 'axios'
import { getToken } from './authService'

const API_URL = 'http://localhost:5000/api/users'

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
})

export const getAllUsers = async () => {
  const response = await axios.get(API_URL, authHeader())
  return response.data
}

export const getUserById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, authHeader())
  return response.data
}

export const updateUser = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, authHeader())
  return response.data
}

export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, authHeader())
  return response.data
}