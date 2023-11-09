import { CCol, CImage, CRow } from '@coreui/react'
import React from 'react'

const OrderDetailListItem = () => {
  return (
    <>
      <CRow className="mb-2">
        <CCol xs="3">
          <div
            style={{
              height: 0,
              paddingBottom: '100%',
              position: 'relative',
            }}
          >
            <CImage
              src="https://placehold.co/400x350"
              style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </CCol>
        <CCol style={{ paddingLeft: 0, paddingRight: '8px' }}>
          Item Title Item Title Item Title TitleTitle Title
          <br />2 x 60.000
        </CCol>
      </CRow>
    </>
  )
}

export default OrderDetailListItem
