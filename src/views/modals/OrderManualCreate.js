import React, { useState } from 'react'
import {
  CAlert,
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from 'src/hooks/useAuth'

const OrderManualCreate = ({ isOpen, onClose }) => {
  const { auth } = useAuth()

  const [formEcomCodeErrorMsg, setFormEcomCodeErrorMsg] = useState('')
  const [formProductNameErrorMsg, setFormProductNameErrorMsg] = useState('')
  const [formQuantityErrorMsg, setFormQuantityErrorMsg] = useState('')
  const [formPriceErrorMsg, setFormPriceErrorMsg] = useState('')
  const [formSubmitErrorMsg, setFormSubmitErrorMsg] = useState('')

  const [formEcomCodeValue, setFormEcomCodeValue] = useState('')
  const [formProductNameValue, setFormProductNameValue] = useState('')
  const [formQuantityValue, setFormQuantityValue] = useState('')
  const [formPriceValue, setFormPriceValue] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const axiosPrivate = useAxiosPrivate()

  const handleEcomCodeChange = (e) => {
    const code = e.target.value

    if (code === '-- Select a platform --') {
      setFormEcomCodeErrorMsg('Please select a platform')
    } else {
      setFormEcomCodeErrorMsg('')
    }

    setFormEcomCodeValue(code)
  }

  const handleProductNameChange = (e) => {
    const name = e.target.value

    // Validation checks
    if (name.length < 5) {
      setFormProductNameErrorMsg('Must be at least 5 chars long')
    } else if (!/^[a-zA-Z]/.test(name)) {
      setFormProductNameErrorMsg('Must start with a letter')
    } else {
      setFormProductNameErrorMsg('')
    }

    setFormProductNameValue(name)
  }

  const handleQuantityChange = (e) => {
    const quantity = e.target.value

    // Validation checks
    if (isNaN(quantity) || quantity <= 0) {
      setFormQuantityErrorMsg('Must be a positive number')
    } else {
      setFormQuantityErrorMsg('')
    }

    setFormQuantityValue(quantity)
  }

  const handlePriceChange = (e) => {
    const price = e.target.value

    // Validation checks
    if (isNaN(price) || price <= 0) {
      setFormPriceErrorMsg('Must be a positive number')
    } else {
      setFormPriceErrorMsg('')
    }

    setFormPriceValue(price)
  }

  const closeSelf = () => {
    onClose()
    setIsLoading(false)
    setFormEcomCodeErrorMsg('')
    setFormProductNameErrorMsg('')
    setFormQuantityErrorMsg('')
    setFormPriceErrorMsg('')
    setFormEcomCodeValue('')
    setFormProductNameValue('')
    setFormQuantityValue('')
    setFormPriceValue('')
  }

  const handleSubmit = () => {
    // Validations
    setFormEcomCodeErrorMsg('')
    setFormProductNameErrorMsg('')
    setFormQuantityErrorMsg('')
    setFormPriceErrorMsg('')

    if (formEcomCodeValue === '-- Select a platform --') {
      setFormEcomCodeErrorMsg('Please select a platform')
    }

    if (formProductNameValue.length < 5 || !/^[a-zA-Z]/.test(formProductNameValue)) {
      setFormProductNameErrorMsg('Invalid Product Name')
    }

    if (isNaN(formQuantityValue) || formQuantityValue <= 0) {
      setFormQuantityErrorMsg('Invalid Quantity')
    }

    if (isNaN(formPriceValue) || formPriceValue <= 0) {
      setFormPriceErrorMsg('Invalid Price')
    }

    if (
      formEcomCodeErrorMsg ||
      formProductNameErrorMsg ||
      formQuantityErrorMsg ||
      formPriceErrorMsg
    ) {
      return
    }

    // If all validations pass, proceed with the API call
    setIsLoading(true)

    axiosPrivate
      .post('/api_order/post_manual_order', {
        platform_code: formEcomCodeValue,
        product_name: formProductNameValue,
        quantity: formQuantityValue,
        price: formPriceValue,
        user_id: auth.token_user_id,
      })
      .then((response) => {
        setIsLoading(false)
        closeSelf()
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.detail ?? err.message
        console.error('Error submitting order', err)
        setFormSubmitErrorMsg(errorMessage)
        setIsLoading(false)
        return
      })
  }

  return (
    <CModal alignment="center" visible={isOpen} onClose={closeSelf}>
      <CModalHeader>
        <CModalTitle>Create Manual Order</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {formSubmitErrorMsg && <CAlert color="danger">{formSubmitErrorMsg}</CAlert>}

        <CForm className="row g-3">
          <CCol md={6}>
            <CFormSelect
              invalid={formEcomCodeErrorMsg !== ''}
              feedback={formEcomCodeErrorMsg}
              size="sm"
              label="Platform"
              value={formEcomCodeValue}
              onChange={handleEcomCodeChange}
              options={[
                '-- Select a plaform --',
                { label: 'Tokopedia', value: 'X' },
                { label: 'Shopee', value: 'Y' },
                { label: 'Other', value: 'Z' },
              ]}
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              invalid={formProductNameErrorMsg !== ''}
              feedback={formProductNameErrorMsg}
              required
              label="Product Name"
              value={formProductNameValue}
              onChange={handleProductNameChange}
            />
          </CCol>

          <CCol md={6}>
            <CFormInput
              invalid={formPriceErrorMsg !== ''}
              feedback={formPriceErrorMsg}
              required
              label="Price"
              value={formPriceValue}
              onChange={handlePriceChange}
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              invalid={formQuantityErrorMsg !== ''}
              feedback={formQuantityErrorMsg}
              required
              label="Quantity"
              value={formQuantityValue}
              onChange={handleQuantityChange}
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

export default OrderManualCreate
