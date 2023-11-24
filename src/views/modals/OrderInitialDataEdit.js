import {
  CAlert,
  CButton,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from '../../hooks/useAuth'

const OrderInitialDataEdit = ({ isOpen, onClose, orderData }) => {
  const { auth } = useAuth()

  const [formCustPhoneErrorMsg, setFormCustPhoneErrorMsg] = useState('')
  const [formYYYYErrorMsg, setFormYYYYErrorMsg] = useState('')
  const [formMMErrorMsg, setFormMMErrorMsg] = useState('')
  const [formDDErrorMsg, setFormDDErrorMsg] = useState('')
  const [formDateErrorMsg, setformDateErrorMsg] = useState(false)
  const [formSubmitErrorMsg, setFormSubmitErrorMsg] = useState('')

  const [formCustPhoneValue, setFormCustPhoneValue] = useState('')
  const [formYYYYValue, setFormYYYYValue] = useState('')
  const [formMMValue, setFormMMValue] = useState('')
  const [formDDValue, setFormDDValue] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    if (isOpen && orderData) {
      setFormCustPhoneValue(orderData.cust_phone_no)

      const year = orderData.user_deadline_prd?.substr(0, 4)
      const month = orderData.user_deadline_prd?.substr(4, 2)
      const day = orderData.user_deadline_prd?.substr(6, 2)

      setFormYYYYValue(year)
      setFormMMValue(month)
      setFormDDValue(day)
    }
  }, [isOpen, orderData])
  const handleCustPhoneChange = (e) => {
    const phone = e.target.value

    // Regular expression to match a valid phone number pattern (between 7 and 14 digits)
    const phonePattern = /^[0-9]{7,14}$/

    if (!phonePattern.test(phone)) {
      setFormCustPhoneErrorMsg('Invalid phone number format')
    } else {
      setFormCustPhoneErrorMsg('') // Clear error message if validation passes
    }

    // Update the phone number value in the state
    setFormCustPhoneValue(phone)
  }

  const handleYYYYChange = (e) => {
    const year = e.target.value

    const yearPattern = /^(20[0-9]{2}|29[0-9]{2})$/

    if (!yearPattern.test(year)) {
      setFormYYYYErrorMsg('Invalid YYYY format')
    } else {
      setFormYYYYErrorMsg('') // Clear error message if validation passes
    }
    setFormYYYYValue(year)
  }

  const handleMMChange = (e) => {
    const month = e.target.value

    const monthPattern = /^(0?[1-9]|1[0-2])$/

    if (!monthPattern.test(month)) {
      setFormMMErrorMsg('Invalid MM format')
    } else {
      setFormMMErrorMsg('') // Clear error message if validation passes
    }
    setFormMMValue(month)
  }

  const handleDDChange = (e) => {
    const day = e.target.value

    const dayPattern = /^(0?[1-9]|[12][0-9]|3[01])$/

    if (!dayPattern.test(day)) {
      setFormDDErrorMsg('Invalid DD format')
    } else {
      setFormDDErrorMsg('') // Clear error message if validation passes
    }
    setFormDDValue(day)
  }

  const handleSubmit = () => {
    setIsLoading(true)

    if (!formCustPhoneValue) {
      setFormCustPhoneErrorMsg('Customer phone is required')
      setIsLoading(false)
      return
    }

    if (formCustPhoneErrorMsg || formYYYYErrorMsg || formMMErrorMsg || formDDErrorMsg) {
      setFormSubmitErrorMsg('Please fix the errors before submitting.')
      setIsLoading(false)
      return
    }

    // Create a date object using the entered values (in GMT+7 timezone)
    const year = parseInt(formYYYYValue)
    const month = parseInt(formMMValue) - 1 // Months are 0-based
    const day = parseInt(formDDValue)
    const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0))

    const dateStr = `${formYYYYValue}${formMMValue.padStart(2, '0')}${formDDValue.padStart(2, '0')}`
    // Check if the date is valid
    if (
      isNaN(date.getTime()) ||
      date.getDate() !== day ||
      date.getMonth() !== month ||
      date.getUTCFullYear() !== year
    ) {
      setformDateErrorMsg(`"${dateStr}" is not a valid date!`)
      setIsLoading(false)
      return
    }

    //
    if (orderData.cust_phone_no == formCustPhoneValue && orderData.user_deadline_prd == dateStr) {
      // console.log('Skip submit, exact same data')
      onClose()
      return
    }

    // If everything is valid, make a POST request
    axiosPrivate
      .patch(`/api_order/id/${orderData.id}/submit_initial_data`, {
        cust_phone_no: formCustPhoneValue,
        user_deadline_prd: dateStr,
        user_id: auth.token_user_id,
      })
      .then((response) => {
        // console.log('Submission successful', response.data)
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

    setFormCustPhoneValue('')
    setFormYYYYValue('')
    setFormMMValue('')
    setFormDDValue('')

    setFormSubmitErrorMsg('')
    setFormYYYYErrorMsg('')
    setFormMMErrorMsg('')
    setFormDDErrorMsg('')
    setformDateErrorMsg('')
    setFormCustPhoneErrorMsg('')
  }

  return (
    <CModal alignment="center" visible={isOpen} onClose={closeSelf}>
      <CModalHeader>
        <CModalTitle>Edit Initial Data (Order #{orderData.id})</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {formSubmitErrorMsg && <CAlert color="danger">{formSubmitErrorMsg}</CAlert>}

        <CForm className="row g-3">
          <CCol md={12}>
            <CFormInput
              type="text"
              invalid={formCustPhoneErrorMsg !== ''}
              feedback={formCustPhoneErrorMsg}
              required
              label="Customer Phone"
              value={formCustPhoneValue}
              onChange={handleCustPhoneChange}
            />
          </CCol>
          <CCol md={12}>
            <div style={{ marginBottom: '8px' }}>Date</div>
            <CInputGroup>
              <CFormInput
                type="text"
                placeholder="YYYY"
                value={formYYYYValue}
                invalid={formYYYYErrorMsg !== ''}
                onChange={handleYYYYChange}
              />
              <CInputGroupText>/</CInputGroupText>
              <CFormInput
                type="text"
                placeholder="MM"
                value={formMMValue}
                invalid={formMMErrorMsg !== ''}
                onChange={handleMMChange}
              />
              <CInputGroupText>/</CInputGroupText>
              <CFormInput
                type="text"
                placeholder="DD"
                value={formDDValue}
                invalid={formDDErrorMsg !== ''}
                onChange={handleDDChange}
              />
            </CInputGroup>
            {formDateErrorMsg ? (
              <span style={{ color: '#e55353' }}>{formDateErrorMsg}</span>
            ) : (
              <></>
            )}
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

export default OrderInitialDataEdit
