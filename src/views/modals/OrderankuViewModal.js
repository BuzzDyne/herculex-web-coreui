import React from 'react'
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'

const OrderankuViewModal = (props) => {
  const { orderData, isOpen, onClose } = props

  const closeSelf = () => {
    onClose()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    const strTime = `${hours}:${minutes}:${seconds}`

    return `${year}-${month}-${day} ${strTime}`
  }

  return (
    <CModal
      backdrop="static"
      alignment="center"
      visible={isOpen}
      onClose={closeSelf}
      aria-labelledby="VerticallyCenteredExample"
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">View Orderanku ID {orderData.id}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm className="row g-3">
          <CCol md={6}>
            <CFormInput label="Recipient Name" value={orderData.recipient_name} disabled />
          </CCol>
          <CCol md={6}>
            <CFormInput label="Recipient Phone" value={orderData.recipient_phone} disabled />
          </CCol>
          <CCol md={12}>
            <CFormTextarea
              label="Recipient Address"
              rows={3}
              value={orderData.recipient_address_display}
              disabled
            />
          </CCol>
          <CCol md={6}>
            <CFormInput label="Kelurahan" value={orderData.recipient_kelurahan} disabled />
          </CCol>
          <CCol md={6}>
            <CFormInput label="Kecamatan" value={orderData.recipient_kecamatan} disabled />
          </CCol>
          <CCol md={12}>
            <CFormInput label="Kota/Kab" value={orderData.recipient_kota_kab} disabled />
          </CCol>
          <CCol md={8}>
            <CFormInput label="Provinsi" value={orderData.recipient_provinsi} disabled />
          </CCol>
          <CCol md={4}>
            <CFormInput label="Postal Code" value={orderData.recipient_postal} disabled />
          </CCol>
          <CCol md={12}>
            <CFormTextarea
              label="Order Details"
              rows={3}
              value={orderData.order_details}
              disabled
            />
          </CCol>
          <CCol md={6}>
            <CFormInput label="Order Total" value={orderData.order_total} disabled />
          </CCol>
          <CCol md={6}>
            <CFormInput label="Bank Name" value={orderData.order_bank} disabled />
          </CCol>
          <CCol md={6}>
            <CFormInput label="Seller Name" value={orderData.seller_name} disabled />
          </CCol>
          <CCol md={6}>
            <CFormInput label="Seller Phone" value={orderData.seller_phone} disabled />
          </CCol>
          <CCol md={6}>
            <CFormInput label="Created Date" value={formatDate(orderData.created_date)} disabled />
          </CCol>
          <CCol md={6}>
            <CFormInput label="Print Date" value={formatDate(orderData.print_date)} disabled />
          </CCol>
          <CCol md={6}>
            <CFormInput label="Paid Date" value={formatDate(orderData.paid_date)} disabled />
          </CCol>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={closeSelf}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
export default OrderankuViewModal
