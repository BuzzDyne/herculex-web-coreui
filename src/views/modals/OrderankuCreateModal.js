import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCol,
  CCollapse,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTooltip,
} from '@coreui/react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { Autocomplete, TextField } from '@mui/material'
import 'src/assets/css/styles.css'

const OrderankuCreateModal = (props) => {
  const { isOpen, onClose } = props

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

  const [formSubmitErrorMsg, setFormSubmitErrorMsg] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const axiosPrivate = useAxiosPrivate()

  const [sellerOptions, setSellerOptions] = useState([
    { seller_name: 'Herculex Indonesia', seller_phone: '081387496006' },
  ])
  // const defaultSeller = sellerOptions.find((opt) => opt.id === 'Herculex Indonesiax')
  const defaultSeller = sellerOptions[sellerOptions.length - 1]

  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isCopiedTooltipVisible, setIsCopiedTooltipVisible] = useState(false)
  const [isCopasTooltipVisible, setIsCopasTooltipVisible] = useState(false)
  const [formCopasValue, setFormCopasValue] = useState('')
  const [formCopasErrMsg, setFormCopasErrMsg] = useState('')

  const getSellerOpts = async () => {
    try {
      console.log('Gettting List of Sellers...')
      const res = await axiosPrivate.get(`/api_orderanku/seller?per_page=5000`)
      setSellerOptions(res.data.sellers)
      console.log(res.data.sellers)
    } catch (error) {
      console.error('API call failed:', error)
      setSellerOptions([])
    }
  }

  useEffect(() => {
    getSellerOpts()
  }, [isOpen])

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
      }

      await axiosPrivate.post(`/api_orderanku/order`, payload)
    } catch (err) {
      console.error(err)
      setFormSubmitErrorMsg(err.message)
      setIsLoading(false)
      return
    }
    closeSelf()
  }

  const handleCopy = () => {
    navigator.clipboard
      .writeText('Nama: \nAlamat: \nKel: \nKec: \nKota: \nProvinsi: \nKode Pos: \nTelp: ')
      .then(() => {
        setIsCopiedTooltipVisible(true)
        setTimeout(() => setIsCopiedTooltipVisible(false), 1000)
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error)
      })
  }

  const handleCopasSubmit = () => {
    let isValid = true
    setFormCopasErrMsg('')

    if (formCopasValue) {
      const lines = formCopasValue.split('\n')
      console.log(`lines: ${lines}`)

      const nameLine = lines.find((line) => line.startsWith('Nama:'))
      const addressLine = lines.find((line) => line.startsWith('Alamat:'))
      const kelLine = lines.find((line) => line.startsWith('Kel:'))
      const kecLine = lines.find((line) => line.startsWith('Kec:'))
      const kotLine = lines.find((line) => line.startsWith('Kota:'))
      const provLine = lines.find((line) => line.startsWith('Provinsi:'))
      const postLine = lines.find((line) => line.startsWith('Kode Pos:'))
      const phoneLine = lines.find((line) => line.startsWith('Telp:'))

      console.log(`nameLine: ${nameLine}`)
      console.log(`addressLine: ${addressLine}`)
      console.log(`kelLine: ${kelLine}`)
      console.log(`kecLine: ${kecLine}`)
      console.log(`kotLine: ${provLine}`)
      console.log(`provLine: ${provLine}`)
      console.log(`postLine: ${postLine}`)
      console.log(`phoneLine: ${phoneLine}`)

      if (nameLine) {
        setFormRName(nameLine.replace('Nama:', '').trim())
      } else {
        setFormCopasErrMsg('Name line is missing or incorrect')
        isValid = false
      }

      if (addressLine) {
        setFormRAddress(addressLine.replace('Alamat:', '').trim())
      } else {
        setFormCopasErrMsg('Address line is missing or incorrect')
        isValid = false
      }

      if (kelLine) {
        setFormRKel(kelLine.replace('Kel:', '').trim())
      } else {
        setFormCopasErrMsg('Kelurahan line is missing or incorrect')
        isValid = false
      }

      if (kecLine) {
        setFormRKec(kecLine.replace('Kec:', '').trim())
      } else {
        setFormCopasErrMsg('Kecamatan line is missing or incorrect')
        isValid = false
      }

      if (kotLine) {
        setFormRKot(kotLine.replace('Kota:', '').trim())
      } else {
        setFormCopasErrMsg('Kota/Kab line is missing or incorrect')
        isValid = false
      }

      if (provLine) {
        setFormRProv(provLine.replace('Provinsi:', '').trim())
      } else {
        setFormCopasErrMsg('Provinsi line is missing or incorrect')
        isValid = false
      }

      if (postLine) {
        setFormRPost(postLine.replace('Kode Pos:', '').trim())
      } else {
        setFormCopasErrMsg('Postal code line is missing or incorrect')
        isValid = false
      }

      if (phoneLine) {
        setFormRPhone(phoneLine.replace('Telp:', '').trim())
      } else {
        setFormCopasErrMsg('Phone line is missing or incorrect')
        isValid = false
      }

      if (isValid) {
        setIsCopasTooltipVisible(true) // Show the success tooltip
        setTimeout(() => setIsCopasTooltipVisible(false), 1000) // Hide the success tooltip after 2 seconds
      }
    } else {
      isValid = false
      setFormCopasErrMsg('Input cannot be empty.')
    }
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
        <CModalTitle id="VerticallyCenteredExample">Create New Orderanku</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {formSubmitErrorMsg && (
          <CAlert color="danger">
            Something went wrong!
            <br />
            {formSubmitErrorMsg}
          </CAlert>
        )}

        <CCollapse visible={!isCollapsed} className="mb-3 mt-0">
          <CRow>
            <CCol md={9}>
              <CFormTextarea
                rows={9}
                placeholder="Copy Here"
                invalid={formCopasErrMsg !== ''}
                feedback={formCopasErrMsg}
                onChange={(e) => {
                  setFormCopasErrMsg('')
                  setFormCopasValue(e.target.value)
                }}
              />
            </CCol>
            <CCol md={3} className="d-grid">
              <div className="d-flex flex-column flex-md-column flex-sm-row gap-2">
                <CTooltip content="Copied!" visible={isCopiedTooltipVisible} trigger={['focus']}>
                  <CButton
                    color="dark"
                    className="w-100 w-md-auto flex-grow-1"
                    onClick={handleCopy}
                  >
                    Copy Template
                  </CButton>
                </CTooltip>
                <CTooltip content="Success!" visible={isCopasTooltipVisible} trigger={[]}>
                  <CButton
                    color="success"
                    className="w-100 w-md-auto flex-grow-1"
                    onClick={handleCopasSubmit}
                  >
                    Submit
                  </CButton>
                </CTooltip>
              </div>
            </CCol>
          </CRow>
        </CCollapse>
        <CCol md={12} className="d-grid mb-3">
          <CButton
            onClick={() => {
              setIsCollapsed(!isCollapsed)
            }}
          >
            {isCollapsed ? 'Open QuickFill' : 'Close QuickFill'}
          </CButton>
        </CCol>

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
            <CFormLabel>Seller Name</CFormLabel>
            <Autocomplete
              freeSolo
              options={sellerOptions}
              getOptionLabel={(opt) => opt.seller_name}
              renderOption={(props, opt) => (
                <li {...props}>
                  <div>
                    <strong>{opt.seller_name}</strong> - <small>{opt.seller_phone}</small>
                  </div>
                </li>
              )}
              onInputChange={(event, value) => {
                setFormSNameErrMsg('')
                setFormSName(value)
                const selectedOption = sellerOptions.find((opt) => opt.seller_name === value)
                if (selectedOption) {
                  setFormSPhone(selectedOption.seller_phone)
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Seller Name"
                  InputLabelProps={{ shrink: false }}
                  helperText={formSNameErrMsg}
                  className={`textField ${formSNameErrMsg !== '' ? 'invalid' : ''}`}
                />
              )}
              size="small"
              defaultValue={defaultSeller}
            />
          </CCol>
          {/* <CCol md={6}>
            <CFormInput
              invalid={formSNameErrMsg !== ''}
              feedback={formSNameErrMsg}
              required
              label="Seller Name"
              value={formSName}
              onChange={handleSNameChange}
              placeholder="Seller Name"
              name="hcx-seller-name"
              autoComplete="name"
            />
          </CCol> */}
          <CCol md={6}>
            <CFormInput
              invalid={formSPhoneErrMsg !== ''}
              feedback={formSPhoneErrMsg}
              required
              label="Seller Phone"
              value={formSPhone}
              onChange={handleSPhoneChange}
              placeholder="Seller Phone"
              name="hcx-seller-phone"
              autoComplete="tel"
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

export default OrderankuCreateModal
