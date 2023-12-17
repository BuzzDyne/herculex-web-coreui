import {
  CAlert,
  CButton,
  CCol,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import useAuth from 'src/hooks/useAuth'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'

const OrderUpdateThumb = ({ isOpen, onClose, orderData }) => {
  const { auth } = useAuth()

  const [formThumbLinkErrMsg, setFormThumbLinkErrMsg] = useState('')
  const [formSubmitErrorMsg, setFormSubmitErrorMsg] = useState('')

  const [formThumbLinkValue, setFormThumbLinkValue] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && orderData) {
      setFormThumbLinkValue(orderData.google_file_url || '')
    }
  }, [isOpen, orderData])

  const axiosPrivate = useAxiosPrivate()

  const handleSubmit = () => {
    setIsLoading(true)

    const thumbLinkRegex = /^https:\/\/drive\.google\.com\/file.*$/i

    let hasError = false

    if (!thumbLinkRegex.test(formThumbLinkValue)) {
      setFormThumbLinkErrMsg('URL is invalid')
      hasError = true
    }

    if (hasError) {
      setIsLoading(false) // Set isLoading to false
      return
    }

    axiosPrivate
      .patch(`/api_order/id/${orderData.id}/update_thumb_url`, {
        payload: formThumbLinkValue,
        user_id: auth.token_user_id,
      })
      .then((response) => {
        onClose()
      })
      .catch((error) => {
        console.error('Error submitting data', error)
        setFormSubmitErrorMsg('Error submitting data.')
        setIsLoading(false) // Set isLoading to false
      })
  }

  const closeSelf = () => {
    onClose()
    setIsLoading(false)

    setFormThumbLinkValue('')

    setFormThumbLinkErrMsg('')
    setFormSubmitErrorMsg('')
  }

  return (
    <CModal alignment="center" visible={isOpen} onClose={closeSelf}>
      <CModalHeader>
        <CModalTitle>Update Thumbnail (Order #{orderData.id})</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {formSubmitErrorMsg && <CAlert color="danger">{formSubmitErrorMsg}</CAlert>}
        <CForm className="row g-3">
          <CCol md={12}>
            <CFormInput
              type="text"
              invalid={formThumbLinkErrMsg !== ''}
              feedback={formThumbLinkErrMsg}
              required
              label="Thumb URL"
              value={formThumbLinkValue}
              onChange={(e) => {
                setFormThumbLinkValue(e.target.value)
                setFormThumbLinkErrMsg('')
              }}
            />
          </CCol>
        </CForm>
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
          <CButton color="success" onClick={handleSubmit}>
            Submit
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  )
}

export default OrderUpdateThumb
