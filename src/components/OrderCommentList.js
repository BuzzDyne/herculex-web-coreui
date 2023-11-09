import { CButton, CCard, CCardBody, CCol, CFormInput, CInputGroup, CRow } from '@coreui/react'
import { cilSend } from '@coreui/icons'
import React from 'react'
import CIcon from '@coreui/icons-react'

const OrderCommentList = () => {
  return (
    <CCard className="h-100">
      <CCardBody className="py-2">
        <CRow>
          <CCol>
            <h5>Comments</h5>
          </CCol>
        </CRow>
        <CRow>
          <CInputGroup className="mb-2">
            <CFormInput placeholder="Add comments here" />
            <CButton type="button" color="primary">
              <CIcon icon={cilSend} />
            </CButton>
          </CInputGroup>
        </CRow>

        <CRow>
          <CCol style={{ overflowY: 'auto' }}>
            <CCol>
              <span style={{ color: 'purple', fontWeight: 'bold' }}>User1:</span> Item Title
              ItemItem Title ItemItem Title ItemItem Title ItemItem Title ItemItem Title ItemItem
              Title Item
            </CCol>
            <CCol>
              <span style={{ color: 'blue', fontWeight: 'bold' }}>User:</span> Item Title Item
            </CCol>
            <CCol>
              <span style={{ color: 'red', fontWeight: 'bold' }}>User:</span> Siap
            </CCol>
            <CCol>
              <span style={{ color: 'purple', fontWeight: 'bold' }}>User1:</span> Item Title
              ItemItem Title ItemItem Title ItemItem Title ItemItem Title ItemItem Title ItemItem
              Title Item
            </CCol>
            <CCol>
              <span style={{ color: 'blue', fontWeight: 'bold' }}>User:</span> Item Title Item
            </CCol>
            <CCol>
              <span style={{ color: 'red', fontWeight: 'bold' }}>User:</span> Siap
            </CCol>
            <CCol>
              <span style={{ color: 'purple', fontWeight: 'bold' }}>User1:</span> Item Title
              ItemItem Title ItemItem Title ItemItem Title ItemItem Title ItemItem Title ItemItem
              Title Item
            </CCol>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default OrderCommentList
