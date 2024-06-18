import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { Autocomplete, TextField, Typography } from '@mui/material'

const OrderankuEditModal = (props) => {
  const { orderData, isOpen, onClose } = props

  const [formRNameErrMsg, setFormRNameErrMsg] = useState('')
  const [formRPhoneErrMsg, setFormRPhoneErrMsg] = useState('')
  const [formRAddressErrMsg, setFormRAddressErrMsg] = useState('')
  const [formODetailsErrMsg, setFormODetailsErrMsg] = useState('')
  const [formOTotalErrMsg, setFormOTotalErrMsg] = useState('')
  const [formSNameErrMsg, setFormSNameErrMsg] = useState('')
  const [formSPhoneErrMsg, setFormSPhoneErrMsg] = useState('')

  const [formRName, setFormRName] = useState('')
  const [formRPhone, setFormRPhone] = useState('')
  const [formRAddress, setFormRAddress] = useState('')
  const [formRKel, setFormRKel] = useState('')
  const [formRKec, setFormRKec] = useState('')
  const [formRKot, setFormRKot] = useState('')
  const [formRProv, setFormRProv] = useState('')
  const [formRPost, setFormRPost] = useState('')
  const [formODetails, setFormODetails] = useState('')
  const [formOTotal, setFormOTotal] = useState(0)
  const [formOBank, setFormOBank] = useState('')
  const [formSName, setFormSName] = useState('')
  const [formSPhone, setFormSPhone] = useState('')
  const [formClearPaid, setFormClearPaid] = useState(false)
  const [formClearPrint, setFormClearPrint] = useState(false)

  const [formSubmitErrorMsg, setformSubmitErrorMsg] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const axiosPrivate = useAxiosPrivate()

  // AutoComplete

  // const [sellerOptions, setSellerOptions] = useState([])
  // const [selectedSeller, setSelectedSeller] = useState({ id: 0, seller_name: '', seller_phone: '' })

  // const getSellerOpts = async () => {
  //   try {
  //     const res = await axiosPrivate.get(`/api_orderanku/seller?per_page=5000`)
  //     setSellerOptions(res.data.sellers)
  //   } catch (error) {
  //     console.error('API call failed:', error)
  //     setSellerOptions([])
  //   }
  // }
  // const handleSelectSeller = (event, newValue) => {
  //   if (newValue) {
  //     setSelectedSeller(newValue)
  //   } else {
  //     setSelectedSeller({ id: 0, seller_name: '', seller_phone: '' })
  //   }
  // }

  // const renderOption = (props, option) => (
  //   <li {...props}>
  //     <Typography component="span" fontWeight="bold">
  //       {option.seller_name}
  //     </Typography>
  //     {' - '}
  //     <Typography component="span">{option.seller_phone}</Typography>
  //   </li>
  // )

  useEffect(() => {
    setFormRName(orderData.recipient_name)
    setFormRPhone(orderData.recipient_phone)
    setFormRAddress(orderData.recipient_address)
    setFormRKel(orderData.recipient_kelurahan)
    setFormRKec(orderData.recipient_kecamatan)
    setFormRKot(orderData.recipient_kota_kab)
    setFormRProv(orderData.recipient_provinsi)
    setFormRPost(orderData.recipient_postal)
    setFormODetails(orderData.order_details)
    setFormOTotal(orderData.order_total)
    setFormOBank(orderData.order_bank)
    setFormSName(orderData.seller_name)
    setFormSPhone(orderData.seller_phone)
    // getSellerOpts()
  }, [orderData])

  const closeSelf = () => {
    onClose()
    setIsLoading(false)

    setFormRNameErrMsg('')
    setFormRAddressErrMsg('')
    setFormODetailsErrMsg('')
    setFormOTotalErrMsg('')
    setFormSNameErrMsg('')
    setFormSPhoneErrMsg('')
    setFormRName('')
    setFormRAddress('')
    setFormRKel('')
    setFormRKec('')
    setFormRKot('')
    setFormRProv('')
    setFormRPost('')
    setFormODetails('')
    setFormOTotal('')
    setFormSName('')
    setFormSPhone('')
    setFormClearPaid(false)
    setFormClearPrint(false)

    // setSellerOptions([])
    // setSelectedSeller({ id: 0, seller_name: '', seller_phone: '' })
  }

  const handleRNameChange = (e) => {
    const txtValue = e.target.value

    if (txtValue.length < 3) {
      setFormRNameErrMsg('Name must be at least 3 chars long')
    } else {
      setFormRNameErrMsg('')
    }

    setFormRName(txtValue)
  }

  const handleRPhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Remove any non-numeric characters

    if (value.length > 0 && value.length < 5) {
      setFormRPhoneErrMsg('Phone must be at least 5 chars long')
    } else {
      setFormRPhoneErrMsg('')
    }

    setFormRPhone(value)
  }

  const handleRAddressChange = (e) => {
    const txtValue = e.target.value

    if (txtValue.length < 3) {
      setFormRAddressErrMsg('Address must be at least 3 chars long')
    } else {
      setFormRAddressErrMsg('')
    }

    setFormRAddress(txtValue)
  }

  const handleODetailsChange = (e) => {
    const txtValue = e.target.value // TODO NewLine (~!~) Logic

    if (txtValue.length < 3) {
      setFormODetailsErrMsg('OrderDetail must be at least 3 chars long')
    } else {
      setFormODetailsErrMsg('')
    }

    setFormODetails(txtValue)
  }

  const handleOTotalChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Remove any non-numeric characters

    if (value === '') {
      setFormOTotalErrMsg('Value cannot be empty')
    } else {
      setFormOTotalErrMsg('')
    }

    setFormOTotal(value === '' ? 0 : parseInt(value, 10)) // Update state with numeric value or 0
  }

  const handleSNameChange = (e) => {
    const txtValue = e.target.value

    if (txtValue.length < 3) {
      setFormSNameErrMsg('Name must be at least 3 chars long')
    } else {
      setFormSNameErrMsg('')
    }

    setFormSName(txtValue)
  }

  const handleSPhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Remove any non-numeric characters

    if (value.length > 0 && value.length < 5) {
      setFormSPhoneErrMsg('Phone must be at least 5 chars long')
    } else {
      setFormSPhoneErrMsg('')
    }

    setFormSPhone(value)
  }

  const handleSubmit = async () => {
    let hasValidationErrors = false
    setIsLoading(true)

    if (formRName.length < 3) {
      setFormRNameErrMsg('Name must be at least 3 chars long')
      hasValidationErrors = true
    } else {
      setFormRNameErrMsg('')
    }

    if ((formRPhone || '').length > 0 && formRPhone.length < 5) {
      setFormRPhoneErrMsg('Phone must be at least 5 chars long')
      hasValidationErrors = true
    } else {
      setFormRPhoneErrMsg('')
    }

    if (formRAddress.length < 3) {
      setFormRAddressErrMsg('Address must be at least 3 chars long')
      hasValidationErrors = true
    } else {
      setFormRAddressErrMsg('')
    }

    if (formODetails.length < 3) {
      setFormODetailsErrMsg('OrderDetail must be at least 3 chars long')
      hasValidationErrors = true
    } else {
      setFormODetailsErrMsg('')
    }

    if (formOTotal === '') {
      setFormOTotalErrMsg('Value cannot be empty')
      hasValidationErrors = true
    } else {
      setFormOTotalErrMsg('')
    }

    if (formSName.length < 3) {
      setFormSNameErrMsg('Name must be at least 3 chars long')
      hasValidationErrors = true
    } else {
      setFormSNameErrMsg('')
    }

    if ((formSPhone || '').length > 0 && formSPhone.length < 5) {
      setFormSPhoneErrMsg('Phone must be at least 5 chars long')
      hasValidationErrors = true
    } else {
      setFormSPhoneErrMsg('')
    }

    // If any field has validation errors, return without making the API call
    if (hasValidationErrors) {
      setIsLoading(false)
      return
    }

    // If all fields pass validation, make the API call to submit the data
    try {
      const payload = {
        recipient_name: formRName,
        recipient_phone: formRPhone,
        recipient_postal: formRPost,
        recipient_provinsi: formRProv,
        recipient_kota_kab: formRKot,
        recipient_kecamatan: formRKec,
        recipient_kelurahan: formRKel,
        recipient_address: formRAddress,
        order_details: formODetails,
        order_total: formOTotal,
        order_bank: formOBank,
        seller_name: formSName,
        seller_phone: formSPhone,
        clear_paid: formClearPaid,
        clear_print: formClearPrint,
      }

      await axiosPrivate.patch(`/api_orderanku/order/id/${orderData.id}`, payload)
    } catch (err) {
      console.error(err)
      setformSubmitErrorMsg(err.message)
      setIsLoading(false)
      return
    }
    closeSelf()
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
        <CModalTitle id="VerticallyCenteredExample">Edit Orderanku ID {orderData.id}</CModalTitle>
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
              invalid={formRNameErrMsg !== ''}
              feedback={formRNameErrMsg}
              required
              label="Recipient Name"
              value={formRName}
              onChange={handleRNameChange}
              placeholder="Reseller Name"
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              invalid={formRPhoneErrMsg !== ''}
              feedback={formRPhoneErrMsg}
              label="Recipient Phone"
              value={formRPhone}
              onChange={handleRPhoneChange}
              placeholder="Recipient Phone"
            />
          </CCol>
          <CCol md={12}>
            <CFormTextarea
              invalid={formRAddressErrMsg !== ''}
              feedback={formRAddressErrMsg}
              required
              rows={3}
              label="Recipient Address"
              value={formRAddress}
              onChange={handleRAddressChange}
              placeholder="Recipient Address"
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              label="Kelurahan"
              value={formRKel}
              onChange={(e) => setFormRKel(e.target.value)}
              placeholder="Kelurahan"
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              label="Kecamatan"
              value={formRKec}
              onChange={(e) => setFormRKec(e.target.value)}
              placeholder="Kecamatan"
            />
          </CCol>
          <CCol md={12}>
            <CFormInput
              label="Kota/Kab"
              value={formRKot}
              onChange={(e) => setFormRKot(e.target.value)}
              placeholder="Kota/Kab"
            />
          </CCol>
          <CCol md={8}>
            <CFormInput
              label="Provinsi"
              value={formRProv}
              onChange={(e) => setFormRProv(e.target.value)}
              placeholder="Provinsi"
            />
          </CCol>
          <CCol md={4}>
            <CFormInput
              label="Postal Code"
              value={formRPost}
              onChange={(e) => setFormRPost(e.target.value)}
              placeholder="Postal Code"
            />
          </CCol>
          <CCol md={12}>
            <CFormTextarea
              invalid={formODetailsErrMsg !== ''}
              feedback={formODetailsErrMsg}
              required
              label="Order Detail"
              rows={3}
              value={formODetails}
              onChange={handleODetailsChange}
              placeholder="Product A (1x)"
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              invalid={formOTotalErrMsg !== ''}
              feedback={formOTotalErrMsg}
              label="Order Total"
              value={formOTotal}
              onChange={handleOTotalChange}
              placeholder="12500"
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              label="Bank Name"
              value={formOBank}
              onChange={(e) => setFormOBank(e.target.value)}
              placeholder="Bank Name"
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              invalid={formSNameErrMsg !== ''}
              feedback={formSNameErrMsg}
              required
              label="Seller Name"
              value={formSName}
              onChange={handleSNameChange}
              placeholder="Seller Name"
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              invalid={formSPhoneErrMsg !== ''}
              feedback={formSPhoneErrMsg}
              required
              label="Seller Phone"
              value={formSPhone}
              onChange={handleSPhoneChange}
              placeholder="Seller Phone"
            />
          </CCol>
          <CCol md={6}>
            <CFormCheck
              id="idClearPrintFlag"
              label="Clear Print"
              checked={formClearPrint}
              onChange={(event) => {
                setFormClearPrint(event.target.checked)
              }}
            />
          </CCol>
          <CCol md={6}>
            <CFormCheck
              id="idClearPaidFlag"
              label="Clear Paid"
              checked={formClearPaid}
              onChange={(event) => {
                setFormClearPaid(event.target.checked)
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

export default OrderankuEditModal
