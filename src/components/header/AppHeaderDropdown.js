import React from 'react'
import {
  CAvatar,
  CBadge,
  CContainer,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
} from '@coreui/react'
import { cilFile, cilAccountLogout, cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar from './../../assets/images/avatars/10.jpg'
import useAuth from 'src/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { ROLE_NAMES } from 'src/constant'

const AppHeaderDropdown = () => {
  const { auth, setAuth } = useAuth()
  const userRole = ROLE_NAMES[auth.token_role_id] || ''
  const navigate = useNavigate()

  const handleLogout = async () => {
    setAuth({})
    navigate('/login', { replace: true })
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CContainer
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ padding: '10px' }}
        >
          <CRow>Hello, {auth.token_username}!</CRow>
          <CRow>{userRole}</CRow>
        </CContainer>
        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
        <CDropdownItem disabled>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>

        <CDropdownItem disabled>
          <CIcon icon={cilFile} className="me-2" />
          Task List
          <CBadge color="primary" className="ms-2">
            0
          </CBadge>
        </CDropdownItem>
        <CDropdownItem disabled>
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>

        <CDropdownDivider />
        <CDropdownItem onClick={() => handleLogout()} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
