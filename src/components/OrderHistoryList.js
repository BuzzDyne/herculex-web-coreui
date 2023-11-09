import { CCard, CCardBody, CCardSubtitle, CCardText, CCol } from '@coreui/react'
import React from 'react'

const OrderHistoryList = () => {
  return (
    <CCol>
      <CCard>
        <CCardBody className="py-2">
          <h5>History</h5>
          <CCard className="mb-2">
            <CCardBody className="p-2">
              <blockquote className="blockquote mb-0">
                <p style={{ fontSize: '0.8em' }}>
                  Lorem ipsum dolor sit ameor sit amet, consectetur t, consectetur adipiscing elit.
                  Integer posuere erat a ante.
                </p>
                <footer className="blockquote-footer" style={{ fontSize: '0.7em' }}>
                  User X | 2023-10-31 12:05:31
                </footer>
              </blockquote>
            </CCardBody>
          </CCard>
          <CCard className="mb-2">
            <CCardBody className="p-2">
              <blockquote className="blockquote mb-0">
                <p style={{ fontSize: '0.8em' }}>
                  Lorem ipsum dolor sit ameor sit amet, consectetur t, consectetur adipiscing elit.
                  Integer posuere erat a ante.
                </p>
                <footer className="blockquote-footer" style={{ fontSize: '0.7em' }}>
                  User X | 2023-10-31 12:05:31
                </footer>
              </blockquote>
            </CCardBody>
          </CCard>
          <CCard className="mb-2">
            <CCardBody className="p-2">
              <blockquote className="blockquote mb-0">
                <p style={{ fontSize: '0.8em' }}>
                  Lorem ipsum dolor sit ameor sit amet, consectetur t, consectetur adipiscing elit.
                  Integer posuere erat a ante.
                </p>
                <footer className="blockquote-footer" style={{ fontSize: '0.7em' }}>
                  User X | 2023-10-31 12:05:31
                </footer>
              </blockquote>
            </CCardBody>
          </CCard>
          <CCard className="mb-2">
            <CCardBody className="p-2">
              <blockquote className="blockquote mb-0">
                <p style={{ fontSize: '0.8em' }}>
                  Lorem ipsum dolor sit ameor sit amet, consectetur t, consectetur adipiscing elit.
                  Integer posuere erat a ante.
                </p>
                <footer className="blockquote-footer" style={{ fontSize: '0.7em' }}>
                  User X | 2023-10-31 12:05:31
                </footer>
              </blockquote>
            </CCardBody>
          </CCard>
        </CCardBody>
      </CCard>
    </CCol>
  )
}

export default OrderHistoryList
