import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu, cilSearch } from '@coreui/icons'

import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const navigate = useNavigate()

  const [orderId, setOrderId] = useState('')

  const handleGoToOrderDetail = () => {
    if (orderId) {
      setOrderId('')
      navigate(`/order_detail/${orderId}`)
    }
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleGoToOrderDetail()
    }
  }

  const handleSearchButtonClick = () => {
    handleGoToOrderDetail()
  }

  const handleInputChange = (e) => {
    // Allow only numbers
    const input = e.target.value.replace(/[^0-9]/g, '')
    setOrderId(input)
  }

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        {/* <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem>
        </CHeaderNav> */}
        <CHeaderNav>
          <CInputGroup className="">
            <CInputGroupText>#</CInputGroupText>
            <CFormInput
              style={{ maxWidth: '100px', boxShadow: '0 0 transparent' }}
              size="sm"
              placeholder="OrderID"
              value={orderId}
              onChange={handleInputChange}
              onKeyUp={handleKeyUp}
            />
            <CButton type="button" color="primary" onClick={handleSearchButtonClick}>
              <CIcon icon={cilSearch} />
            </CButton>
          </CInputGroup>

          {/* <CNavItem>
            <CNavLink>
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem> */}
        </CHeaderNav>
        <CHeaderNav className="">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
