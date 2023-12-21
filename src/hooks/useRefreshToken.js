import axios from '../api/axios'
import useAuth from './useAuth'

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth()

  const refresh = async () => {
    try {
      const response = await axios.get('/auth/refresh', {
        headers: {
          Authorization: `Bearer ${auth?.refreshToken}`,
        },
      })

      setAuth((prev) => {
        return { ...prev, accessToken: response.data.access_token }
      })

      return response.data.access_token
    } catch (error) {
      // Handle refresh token error (e.g., logout user)
      console.error('Error refreshing token:', error)
      setAuth({}) // Clear authentication state if refresh token fails
      localStorage.removeItem('auth') // Clear authentication state from localStorage
      return null
    }
  }

  return refresh
}

export default useRefreshToken
