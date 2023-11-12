import { CCol, CImage, CRow } from '@coreui/react'
import React from 'react'
import { formatNumberWithCommas } from 'src/utils'

const OrderDetailListItem = ({ itemData }) => {
  console.log('OrderDetailListItem', itemData)
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
              src={
                itemData.thumb_url ? itemData.thumb_url : 'https://placehold.co/400?text=No+Image'
              }
              style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </CCol>
        <CCol style={{ paddingLeft: 0, paddingRight: '8px' }}>
          <b>{itemData.product_name} </b>
          <br />
          {itemData.quantity} x {formatNumberWithCommas(itemData.product_price)}
        </CCol>
      </CRow>
    </>
  )
}

export default OrderDetailListItem
