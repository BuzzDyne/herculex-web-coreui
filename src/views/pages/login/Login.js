import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import useAuth from 'src/hooks/useAuth'
import jwt_decode from 'jwt-decode'
import axios from '../../../api/axios'

const LOGIN_URL = '/auth/login'

const Login = () => {
  const { setAuth } = useAuth()

  const navigate = useNavigate()
  const from = '/'

  const [username, setUsername] = useState('')
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setErrMsg('')
  }, [username, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({ username, password: pwd }), {
        headers: { 'Content-Type': 'application/json' },
      })

      console.log(response)

      const accessToken = response?.data?.access_token
      const refreshToken = response?.data?.refresh_token

      const decodedData = jwt_decode(accessToken)

      const token_username = decodedData.sub
      const token_role_id = decodedData.role_id
      const token_user_id = decodedData.user_id

      setAuth({ token_user_id, token_username, token_role_id, accessToken, refreshToken })

      setUsername('')
      setPwd('')
      navigate(from, { replace: true })
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
        console.log(err)
      } else if (err.response.status === 400) {
        setErrMsg(err.response.data.detail)
      } else {
        setErrMsg('Something went wrong...')
        console.log(err)
      }
    } finally {
      setLoading(false) // Set loading back to false when the request completes
    }
  }

  return (
    <div
      className="bg-light min-vh-100 d-flex flex-row align-items-center"
      style={{
        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard
                className="p-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adjust the opacity as needed
                }}
              >
                <CCardBody>
                  {errMsg && <CAlert color="danger">{errMsg}</CAlert>}

                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        autoFocus
                        onChange={(event) => setUsername(event.target.value)}
                        id="email"
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault() // Prevent the default form submission
                            handleSubmit(event)
                          }
                        }}
                        value={username}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="off"
                        value={pwd}
                        id="password"
                        onChange={(event) => setPwd(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault() // Prevent the default form submission
                            handleSubmit(event)
                          }
                        }}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        {loading ? ( // Conditionally render the spinner while loading
                          <CButton disabled>
                            <CSpinner
                              component="span"
                              size="sm"
                              aria-hidden="true"
                              style={{ marginRight: '8px' }}
                            />
                            Loading...
                          </CButton>
                        ) : (
                          <CButton color="primary" className="px-4" onClick={handleSubmit}>
                            Login
                          </CButton>
                        )}
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
