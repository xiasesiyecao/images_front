import axios from 'axios'

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

const http = axios.create({
  baseURL: '/',
  timeout: 10000
})

export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>) {
  const response = await promise
  return response.data.data
}

export default http
