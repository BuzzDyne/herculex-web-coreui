import {
  CAlert,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import React, { useState } from 'react'
import useAuth from 'src/hooks/useAuth'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'

const OrderRejectDesign = ({ isOpen, onClose, orderData }) => {
  const { auth } = useAuth()

  const [formSubmitErrorMsg, setFormSubmitErrorMsg] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const axiosPrivate = useAxiosPrivate()
  const closeSelf = () => {
    onClose()
    setIsLoading(false)

    setFormSubmitErrorMsg('')
  }

  const handleSubmit = () => {
    setIsLoading(true)

    axiosPrivate
      .patch(`/api_order/id/${orderData.id}/submit_design_rej`, {
        date: null,
        user_id: auth.token_user_id,
      })
      .then((response) => {
        // console.log('Submission successful', response.data)
        setIsLoading(false) // Set isLoading to false
        onClose()
      })
      .catch((error) => {
        console.error('Error submitting data', error)
        setFormSubmitErrorMsg('Error submitting data.')
        setIsLoading(false) // Set isLoading to false
      })
  }

  return (
    <CModal alignment="center" visible={isOpen} onClose={closeSelf}>
      <CModalHeader>
        <CModalTitle>Reject Order #{orderData.id} Design?</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {formSubmitErrorMsg && <CAlert color="danger">{formSubmitErrorMsg}</CAlert>}
        <p>
          Are you sure to reject designs for order <strong>#{orderData.id}</strong>?
        </p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={closeSelf}>
          Close
        </CButton>
        {isLoading ? (
          <CButton color="success" disabled>
            <CSpinner
              component="span"
              size="sm"
              aria-hidden="true"
              style={{ marginRight: '8px' }}
            />
            Loading...
          </CButton>
        ) : (
          <CButton color="danger" style={{ color: 'white' }} onClick={handleSubmit}>
            Reject Design
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  )
}

export default OrderRejectDesign
