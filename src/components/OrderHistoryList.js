import { CCard, CCardBody, CCol } from '@coreui/react'
import React from 'react'
import { formatDateTime } from 'src/utils'

const OrderHistoryList = ({ historyList }) => {
  return (
    <CCol>
      <CCard>
        <CCardBody className="py-2">
          <h5>History</h5>
          {historyList.length > 0 ? (
            historyList.map((item) => (
              <>
                <CCard className="mb-2">
                  <CCardBody className="p-2">
                    <blockquote className="blockquote mb-0">
                      <p style={{ fontSize: '0.8em' }}>{item.activity_msg}</p>
                      <footer className="blockquote-footer" style={{ fontSize: '0.7em' }}>
                        {item.user_name} | {formatDateTime(item.activity_date)}
                      </footer>
                    </blockquote>
                  </CCardBody>
                </CCard>
              </>
            ))
          ) : (
            <p>No order items available.</p>
          )}
        </CCardBody>
      </CCard>
    </CCol>
  )
}

export default OrderHistoryList
