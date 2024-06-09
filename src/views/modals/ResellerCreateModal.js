import React, { useState } from 'react'
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
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const ResellerCreateModal = (props) => {
  const { isOpen, onClose } = props

  const [formUsernameErrorMsg, setFormUsernameErrorMsg] = useState('')
  const [formPhoneErrorMsg, setFormPhoneErrorMsg] = useState('')
  const [formSubmitErrorMsg, setFormSubmitErrorMsg] = useState('')

  const [formUsernameValue, setFormUsernameValue] = useState('')
  const [formPhoneValue, setFormPhoneValue] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const axiosPrivate = useAxiosPrivate()

  const closeSelf = () => {
    onClose()
    setIsLoading(false)

    setFormSubmitErrorMsg('')

    setFormUsernameErrorMsg('')
    setFormPhoneErrorMsg('')
    setFormUsernameValue('')
    setFormPhoneValue('')
  }

  const handleUsernameChange = (e) => {
    const username = e.target.value

    // Validation checks for username
    if (username.length < 3) {
      setFormUsernameErrorMsg('Name must be at least 3 chars long')
    } else {
      setFormUsernameErrorMsg('')
    }

    setFormUsernameValue(username)
  }

  const handlePhoneChange = (e) => {
    // Remove any non-numeric characters from the input
    const no = e.target.value.replace(/\D/g, '')

    // Validation checks for phone
    if (no.length < 6) {
      setFormPhoneErrorMsg('Phone Number must be at least 6 chars long')
    } else {
      setFormPhoneErrorMsg('')
    }

    setFormPhoneValue(no)
  }

  const handleSubmit = async () => {
    let hasValidationErrors = false
    setIsLoading(true)

    // Validation checks for username
    if (formUsernameValue.length < 3) {
      setFormUsernameErrorMsg('Name must be at least 3 chars long')
      hasValidationErrors = true
    } else {
      setFormUsernameErrorMsg('')
    }
    // Validation checks for phone
    if (formPhoneValue.length < 6) {
      setFormPhoneErrorMsg('Phone Number must be at least 6 chars long')
      hasValidationErrors = true
    } else {
      setFormPhoneErrorMsg('')
    }

    // If any field has validation errors, return without making the API call
    if (hasValidationErrors) {
      setIsLoading(false)
      return
    }

    // If all fields pass validation, make the API call to submit the data
    try {
      const payload = {
        seller_name: formUsernameValue,
        seller_phone: formPhoneValue,
      }
      await axiosPrivate.post(`/api_orderanku/seller`, payload)
    } catch (err) {
      console.error(err)
      setFormSubmitErrorMsg(err.message)
      setIsLoading(false)
      return
    }
    closeSelf()
  }

  return (
    <CModal
      alignment="center"
      visible={isOpen}
      onClose={closeSelf}
      aria-labelledby="VerticallyCenteredExample"
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">Create New Reseller</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {formSubmitErrorMsg && (
          <CAlert color="danger">
            Something went wrong!
            <br />
            {formSubmitErrorMsg}
          </CAlert>
        )}

        <CForm className="row g-3">
          <CCol md={6}>
            <CFormInput
              invalid={formUsernameErrorMsg !== ''}
              feedback={formUsernameErrorMsg}
              required
              label="Reseller Name"
              value={formUsernameValue}
              onChange={handleUsernameChange}
              placeholder="Reseller Name"
            />
          </CCol>

          <CCol md={6}>
            <CFormInput
              invalid={formPhoneErrorMsg !== ''}
              feedback={formPhoneErrorMsg}
              required
              label="Reseller Phone"
              value={formPhoneValue}
              onChange={handlePhoneChange}
              placeholder="Reseller Phone"
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

export default ResellerCreateModal
