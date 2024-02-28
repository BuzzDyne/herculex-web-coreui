import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilTrash } from '@coreui/icons'
import { DocModalTypes } from 'src/constant'
import { isYYYYMMDDInvalid, performDownloadFromResponse } from 'src/utils'

const DocumentForm = ({
  modalTitle,
  docModalType,
  order_id,
  order_items_data,
  doc_id,
  isOpen,
  onClose,
}) => {
  const [formSubmitErrorMsg, setFormSubmitErrorMsg] = useState('')
  const [docData, setDocData] = useState({})

  const [isLoading, setIsLoading] = useState(false)
  const axiosPrivate = useAxiosPrivate()

  const [formOrderIDValue, setFormOrderIDValue] = useState('')
  const [formOrderIDValueErrorMsg, setFormOrderIDValueErrorMsg] = useState('')
  const [formDocTypeCodeValue, setFormDocTypeCodeValue] = useState('I')
  const [formDocTypeCodeValueErrorMsg, setFormDocTypeCodeValueErrorMsg] = useState('')
  const [formDocNumberValue, setFormDocNumberValue] = useState('')
  const [formDocNumberValueErrorMsg, setFormDocNumberValueErrorMsg] = useState('')
  const [formCustName, setFormCustName] = useState('')
  const [formCustNameErrorMsg, setFormCustNameErrorMsg] = useState('')

  const [formCustomerAddr1, setFormCustomerAddr1] = useState('')
  const [formCustomerAddr1ErrorMsg, setFormCustomerAddr1ErrorMsg] = useState('')
  const [formCustomerAddr2, setFormCustomerAddr2] = useState('')
  const [formCustomerAddr2ErrorMsg, setFormCustomerAddr2ErrorMsg] = useState('')
  const [formCustomerAddr3, setFormCustomerAddr3] = useState('')
  const [formCustomerAddr3ErrorMsg, setFormCustomerAddr3ErrorMsg] = useState('')
  const [formCustomerAddr4, setFormCustomerAddr4] = useState('')
  const [formCustomerAddr4ErrorMsg, setFormCustomerAddr4ErrorMsg] = useState('')
  const [formCustPhone, setFormCustPhone] = useState('')
  const [formCustPhoneErrorMsg, setFormCustPhoneErrorMsg] = useState('')
  const [formCustFax, setFormCustFax] = useState('')
  const [formCustFaxErrorMsg, setFormCustFaxErrorMsg] = useState('')
  const [formDiscount, setFormDiscount] = useState('')
  const [formDiscountErrorMsg, setFormDiscountErrorMsg] = useState('')

  const [formYYYYValue, setFormYYYYValue] = useState('')
  const [formYYYYErrorMsg, setFormYYYYErrorMsg] = useState('')
  const [formMMValue, setFormMMValue] = useState('')
  const [formMMErrorMsg, setFormMMErrorMsg] = useState('')
  const [formDDValue, setFormDDValue] = useState('')
  const [formDDErrorMsg, setFormDDErrorMsg] = useState('')
  const [formDateErrorMsg, setformDateErrorMsg] = useState(false)

  const [formItems, setFormItems] = useState([
    { id: 0, name: '', nameErr: false, qty: '', qtyErr: false, price: '', priceErr: false },
  ])

  useEffect(() => {
    if (isOpen) {
      switch (docModalType) {
        case DocModalTypes.CREATE_MANUAL:
          setDueDateToday()
          setFormDocNumberValue(generateDocNo('INV', 'XXXX'))
          break
        case DocModalTypes.CREATE_INVOICE:
          setDueDateToday()
          setFormOrderIDValue(order_id)
          setFormDocTypeCodeValue('I')
          setFormDocNumberValue(generateDocNo('INV', order_id))
          setFormItems(populateItemsFromDetailPage())
          console.log(order_items_data)
          break
        case DocModalTypes.CREATE_QUOTATION:
          setDueDateToday()
          setFormOrderIDValue(order_id)
          setFormDocTypeCodeValue('Q')
          setFormDocNumberValue(generateDocNo('QUO', order_id))
          setFormItems(populateItemsFromDetailPage())
          break
        case DocModalTypes.EDIT:
          fetchData()

        default:
          break
      }
    }
  }, [isOpen])

  useEffect(() => {
    populateDocData()
  }, [docData])

  const handleSubmit = () => {
    setIsLoading(true)
    var isFailedValidation = false

    // Validation
    if (!formDocNumberValue) {
      setFormDocNumberValueErrorMsg('Doc Number is required')
      isFailedValidation = true
    }

    if (!formCustName) {
      setFormCustNameErrorMsg('Customer Name is required')
      isFailedValidation = true
    }

    // prettier-ignore
    const dateStr = `${formYYYYValue}/${formMMValue.padStart(2, '0')}/${formDDValue.padStart(2, '0')}`
    if (isYYYYMMDDInvalid(formYYYYValue, formMMValue, formDDValue)) {
      setformDateErrorMsg(`"${dateStr}" is not a valid date!`)
      isFailedValidation = true
    }

    if (!validateItems()) {
      isFailedValidation = true
    }

    if (isFailedValidation) {
      setIsLoading(false)
      return
    }

    // Submit to API
    if (docModalType == DocModalTypes.EDIT) {
      // Edit
      axiosPrivate
        .patch(`/api_docs/id/${doc_id}`, {
          order_id: parseInt(formOrderIDValue) || null,
          doc_type: formDocTypeCodeValue,
          doc_number: formDocNumberValue,
          customer_name: formCustName,
          customer_addr_1: formCustomerAddr1,
          customer_addr_2: formCustomerAddr2,
          customer_addr_3: formCustomerAddr3,
          customer_addr_4: formCustomerAddr4,
          cust_phone: formCustPhone,
          cust_fax: formCustFax,
          due_date: dateStr,
          discount: parseFloat(formDiscount) || 0,
          items: formItems.map((item) => ({
            item_name: item.name,
            item_price: parseFloat(item.price) || 0, // Assuming price can be a float, handle accordingly
            item_qty: parseInt(item.qty) || 0, // Assuming qty is an integer, handle accordingly
          })),
        })
        .then((response) => {
          performDownloadFromResponse(response, formDocNumberValue)
          setIsLoading(false)
          closeSelf()
        })
        .catch((error) => {
          console.error('Error submitting data', error)
          setFormSubmitErrorMsg('Error submitting data.')
          setIsLoading(false)
        })
    } else {
      // Creation
      axiosPrivate
        .post(`/api_docs`, {
          order_id: parseInt(formOrderIDValue) || null,
          doc_type: formDocTypeCodeValue,
          doc_number: formDocNumberValue,
          customer_name: formCustName,
          customer_addr_1: formCustomerAddr1,
          customer_addr_2: formCustomerAddr2,
          customer_addr_3: formCustomerAddr3,
          customer_addr_4: formCustomerAddr4,
          cust_phone: formCustPhone,
          cust_fax: formCustFax,
          due_date: dateStr,
          discount: parseFloat(formDiscount) || 0,
          items: formItems.map((item) => ({
            item_name: item.name,
            item_price: parseFloat(item.price) || 0, // Assuming price can be a float, handle accordingly
            item_qty: parseInt(item.qty) || 0, // Assuming qty is an integer, handle accordingly
          })),
        })
        .then((response) => {
          performDownloadFromResponse(response, formDocNumberValue)
          setIsLoading(false)
          closeSelf()
        })
        .catch((error) => {
          console.error('Error submitting data', error)
          setFormSubmitErrorMsg('Error submitting data.')
          setIsLoading(false)
        })
    }
  }

  const fetchData = () => {
    console.log('Inside FetchData')
    setIsLoading(true)
    setFormSubmitErrorMsg('')
    axiosPrivate
      .get(`/api_docs/id/${doc_id}`)
      .then((response) => {
        console.log('response.data')
        console.log(response.data)
        setDocData(response.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching doc list', err)
        setFormSubmitErrorMsg(err.message)
        setDocData({})
        setIsLoading(false)
        closeSelf()
      })
  }

  const populateItemsFromDetailPage = () => {
    return order_items_data.map((item) => ({
      name: item.product_name || '',
      nameErr: false,
      qty: item.quantity || 0,
      qtyErr: false,
      price: item.product_price || 0,
      priceErr: false,
    }))
  }

  const populateDocData = () => {
    if (docData) {
      setFormOrderIDValue(docData.order_id)
      setFormDocTypeCodeValue(docData.doc_type)
      setFormDocNumberValue(docData.doc_number)
      setFormCustName(docData.cust_name)
      setFormCustomerAddr1(docData.cust_addr_1)
      setFormCustomerAddr2(docData.cust_addr_2)
      setFormCustomerAddr3(docData.cust_addr_3)
      setFormCustomerAddr4(docData.cust_addr_4)
      setFormCustPhone(docData.cust_phone)
      setFormCustFax(docData.cust_fax)
      setFormDiscount(docData.discount)

      console.log(`due_date split ${docData.due_date}`)
      if (docData.due_date) {
        const date_parts = docData.due_date.split('/')
        setFormYYYYValue(date_parts[0])
        setFormMMValue(date_parts[1])
        setFormDDValue(date_parts[2])
      }

      if (docData.items) {
        const mapped_items = docData.items.map((item) => ({
          id: item.id,
          name: item.name || '',
          nameErr: false,
          qty: item.qty || 0,
          qtyErr: false,
          price: item.price || 0,
          priceErr: false,
        }))
        setFormItems(mapped_items)
      }
    }
  }

  const validateItems = () => {
    var isFailedValidation = false

    const updatedFormItems = formItems.map((item) => {
      let newItem = { ...item }

      if (newItem.name.trim() === '') {
        newItem.nameErr = true
        isFailedValidation = true
      } else {
        newItem.nameErr = false
      }

      if (newItem.qty === 0) {
        newItem.qtyErr = true
        isFailedValidation = true
      } else {
        newItem.qtyErr = false
      }

      if (newItem.price === 0) {
        newItem.priceErr = true
        isFailedValidation = true
      } else {
        newItem.priceErr = false
      }

      return newItem
    })

    setFormItems(updatedFormItems)

    return !isFailedValidation
  }

  const setDueDateToday = () => {
    const currentDate = new Date()
    currentDate.setUTCMinutes(
      currentDate.getUTCMinutes() + currentDate.getTimezoneOffset() + 7 * 60,
    ) // Convert to GMT+7
    currentDate.setDate(currentDate.getDate()) // Add 5 days

    setFormYYYYValue(currentDate.getUTCFullYear().toString())
    setFormMMValue((currentDate.getUTCMonth() + 1).toString().padStart(2, '0')) // Months are 0-based
    setFormDDValue(currentDate.getUTCDate().toString().padStart(2, '0'))
  }

  const generateDocNo = (doc_type, order_id) => {
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = romanMonths[currentDate.getMonth()]

    return `HCX/${doc_type}/${currentYear}/${currentMonth}/${order_id}`
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formItems]
    newItems[index][field] = value

    newItems[index].nameErr = false
    newItems[index].qtyErr = false
    newItems[index].priceErr = false

    setFormItems(newItems)
  }

  const handleItemAdd = () => {
    if (formItems.length < 19) {
      setFormItems([
        ...formItems,
        { name: '', nameErr: false, qty: '', qtyErr: false, price: '', priceErr: false },
      ])
    }
  }

  const handleItemRemove = (indexToRemove) => {
    if (formItems.length > 1) {
      const updatedItems = formItems.filter((_, index) => index !== indexToRemove)
      setFormItems(updatedItems)
    }
  }

  const handleOrderIDChange = (e) => {
    const id = e.target.value

    // Validation checks
    const numericRegex = /^[0-9]+$/
    if (!numericRegex.test(id)) {
      setFormOrderIDValueErrorMsg('Must contain only numeric digits')
    } else {
      setFormOrderIDValueErrorMsg('')
    }

    setFormOrderIDValue(id)
  }

  const handleCustNameChange = (e) => {
    const custName = e.target.value
    const maxLength = 30

    // Validation check
    if (custName.length > maxLength) {
      setFormCustNameErrorMsg(`Max ${maxLength} characters`)
    } else {
      setFormCustNameErrorMsg('')
    }

    setFormCustName(custName)
  }

  const handleDocNumberChange = (e) => {
    const newDocNo = e.target.value
    const maxLength = 30

    // Validation check
    if (newDocNo.length > maxLength) {
      setFormDocNumberValueErrorMsg(`Max ${maxLength} characters`)
    } else {
      setFormDocNumberValueErrorMsg('')
    }

    setFormDocNumberValue(newDocNo)
  }

  const handleCustomerAddr1Change = (e) => {
    const addr1 = e.target.value
    const maxLength = 44

    // Validation check
    if (addr1.length > maxLength) {
      setFormCustomerAddr1ErrorMsg(`Max ${maxLength} characters`)
    } else {
      setFormCustomerAddr1ErrorMsg('')
    }

    setFormCustomerAddr1(addr1)
  }
  const handleCustomerAddr2Change = (e) => {
    const addr2 = e.target.value
    const maxLength = 44

    // Validation check
    if (addr2.length > maxLength) {
      setFormCustomerAddr2ErrorMsg(`Max ${maxLength} characters`)
    } else {
      setFormCustomerAddr2ErrorMsg('')
    }

    setFormCustomerAddr2(addr2)
  }
  const handleCustomerAddr3Change = (e) => {
    const addr3 = e.target.value
    const maxLength = 44

    // Validation check
    if (addr3.length > maxLength) {
      setFormCustomerAddr3ErrorMsg(`Max ${maxLength} characters`)
    } else {
      setFormCustomerAddr3ErrorMsg('')
    }

    setFormCustomerAddr3(addr3)
  }
  const handleCustomerAddr4Change = (e) => {
    const addr4 = e.target.value
    const maxLength = 44

    // Validation check
    if (addr4.length > maxLength) {
      setFormCustomerAddr4ErrorMsg(`Max ${maxLength} characters`)
    } else {
      setFormCustomerAddr4ErrorMsg('')
    }

    setFormCustomerAddr4(addr4)
  }

  const handleCustPhoneChange = (e) => {
    const phone = e.target.value
    const maxLength = 30
    const phoneRegex = /^[0-9()-]+$/

    // Validation checks
    if (phone.length > maxLength) {
      setFormCustPhoneErrorMsg(`Max ${maxLength} characters`)
    } else if (!phoneRegex.test(phone)) {
      setFormCustPhoneErrorMsg('Invalid format')
    } else {
      setFormCustPhoneErrorMsg('')
    }

    setFormCustPhone(phone)
  }

  const handleCustFaxChange = (e) => {
    const fax = e.target.value
    const maxLength = 30
    const phoneRegex = /^[0-9()-]+$/

    // Validation checks
    if (fax.length > maxLength) {
      setFormCustFaxErrorMsg(`Max ${maxLength} characters`)
    } else if (!phoneRegex.test(fax)) {
      setFormCustFaxErrorMsg('Invalid format')
    } else {
      setFormCustFaxErrorMsg('')
    }

    setFormCustFax(fax)
  }

  const handleDiscountChange = (e) => {
    const discount = e.target.value
    const discountRegex = /^\d+$/

    // Validation check
    if (!discountRegex.test(discount)) {
      setFormDiscountErrorMsg('Must contain only numeric digits')
    } else {
      setFormDiscountErrorMsg('')
    }

    setFormDiscount(discount)
  }

  const handleYYYYChange = (e) => {
    const year = e.target.value
    const truncatedYear = year.slice(0, 4)

    const yearPattern = /^(20[0-9]{2}|29[0-9]{2})$/
    setformDateErrorMsg('')

    if (!yearPattern.test(truncatedYear)) {
      setFormYYYYErrorMsg('Invalid YYYY format')
    } else {
      setFormYYYYErrorMsg('') // Clear error message if validation passes
    }
    setFormYYYYValue(truncatedYear)
  }

  const handleMMChange = (e) => {
    const month = e.target.value

    const monthPattern = /^(0?[1-9]|1[0-2])$/
    setformDateErrorMsg('')
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
    setformDateErrorMsg('')
    if (!dayPattern.test(day)) {
      setFormDDErrorMsg('Invalid DD format')
    } else {
      setFormDDErrorMsg('') // Clear error message if validation passes
    }
    setFormDDValue(day)
  }

  const closeSelf = () => {
    if (isLoading) {
      return
    }
    onClose()
    clearFormValues()
  }

  const clearFormValues = () => {
    setFormOrderIDValue('')
    setFormOrderIDValueErrorMsg('')
    setFormDocTypeCodeValue('')
    setFormDocTypeCodeValueErrorMsg('')
    setFormDocNumberValue('')
    setFormDocNumberValueErrorMsg('')
    setFormCustName('')
    setFormCustNameErrorMsg('')
    setFormCustomerAddr1('')
    setFormCustomerAddr1ErrorMsg('')
    setFormCustomerAddr2('')
    setFormCustomerAddr2ErrorMsg('')
    setFormCustomerAddr3('')
    setFormCustomerAddr3ErrorMsg('')
    setFormCustomerAddr4('')
    setFormCustomerAddr4ErrorMsg('')
    setFormCustPhone('')
    setFormCustPhoneErrorMsg('')
    setFormCustFax('')
    setFormCustFaxErrorMsg('')
    setFormDiscount('')
    setFormDiscountErrorMsg('')
    setFormYYYYValue('')
    setFormYYYYErrorMsg('')
    setFormMMValue('')
    setFormMMErrorMsg('')
    setFormDDValue('')
    setFormDDErrorMsg('')
    setFormItems([{ name: '', nameErr: false, qty: '', qtyErr: false, price: '', priceErr: false }])
  }

  return (
    <CModal backdrop="static" alignment="center" visible={isOpen} onClose={closeSelf}>
      <CModalHeader>
        <CModalTitle>{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {isLoading ? (
          <CRow>
            <CCol className="d-flex justify-content-center">
              <CSpinner color="dark" />
            </CCol>
          </CRow>
        ) : (
          <>
            {formSubmitErrorMsg && <CAlert color="danger">{formSubmitErrorMsg}</CAlert>}

            <CForm className="row g-3">
              <CCol md={6}>
                <CFormLabel>OrderID</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>#</CInputGroupText>
                  <CFormInput
                    invalid={formOrderIDValueErrorMsg !== ''}
                    feedback={formOrderIDValueErrorMsg}
                    disabled
                    required
                    placeholder={docModalType == DocModalTypes.CREATE_MANUAL ? '' : '123'}
                    value={formOrderIDValue}
                    onChange={handleOrderIDChange}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  invalid={formDocTypeCodeValueErrorMsg !== ''}
                  feedback={formDocTypeCodeValueErrorMsg}
                  disabled={
                    docModalType == DocModalTypes.CREATE_INVOICE ||
                    docModalType == DocModalTypes.CREATE_QUOTATION ||
                    docModalType == DocModalTypes.EDIT
                  }
                  size="sm"
                  label="Type"
                  value={formDocTypeCodeValue}
                  onChange={(e) => {
                    setFormDocTypeCodeValue(e.target.value)
                  }}
                  options={[
                    { label: 'Invoice', value: 'I' },
                    { label: 'Quotation', value: 'Q' },
                  ]}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  invalid={formDocNumberValueErrorMsg !== ''}
                  feedback={formDocNumberValueErrorMsg}
                  disabled={
                    docModalType == DocModalTypes.CREATE_INVOICE ||
                    docModalType == DocModalTypes.CREATE_QUOTATION
                  }
                  required
                  label="Doc Number"
                  placeholder="HCX/INV/2024/II/245"
                  value={formDocNumberValue}
                  onChange={handleDocNumberChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  invalid={formCustNameErrorMsg !== ''}
                  feedback={formCustNameErrorMsg}
                  required
                  label="Customer Name"
                  placeholder="Jurgen"
                  value={formCustName}
                  onChange={handleCustNameChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  invalid={formCustomerAddr1ErrorMsg !== ''}
                  feedback={formCustomerAddr1ErrorMsg}
                  required
                  label="Address Line 1"
                  value={formCustomerAddr1}
                  onChange={handleCustomerAddr1Change}
                />
              </CCol>

              <CCol md={6}>
                <CFormInput
                  invalid={formCustomerAddr2ErrorMsg !== ''}
                  feedback={formCustomerAddr2ErrorMsg}
                  required
                  label="Address Line 2"
                  value={formCustomerAddr2}
                  onChange={handleCustomerAddr2Change}
                />
              </CCol>

              <CCol md={6}>
                <CFormInput
                  invalid={formCustomerAddr3ErrorMsg !== ''}
                  feedback={formCustomerAddr3ErrorMsg}
                  required
                  label="Address Line 3"
                  value={formCustomerAddr3}
                  onChange={handleCustomerAddr3Change}
                />
              </CCol>

              <CCol md={6}>
                <CFormInput
                  invalid={formCustomerAddr4ErrorMsg !== ''}
                  feedback={formCustomerAddr4ErrorMsg}
                  required
                  label="Address Line 4"
                  value={formCustomerAddr4}
                  onChange={handleCustomerAddr4Change}
                />
              </CCol>

              <CCol md={6}>
                <CFormInput
                  type="number"
                  className="hide-number-arrows"
                  invalid={formCustPhoneErrorMsg !== ''}
                  feedback={formCustPhoneErrorMsg}
                  required
                  label="Customer Phone"
                  value={formCustPhone}
                  onChange={handleCustPhoneChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="number"
                  className="hide-number-arrows"
                  invalid={formCustFaxErrorMsg !== ''}
                  feedback={formCustFaxErrorMsg}
                  required
                  label="Customer Fax"
                  value={formCustFax}
                  onChange={handleCustFaxChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="number"
                  className="hide-number-arrows"
                  invalid={formDiscountErrorMsg !== ''}
                  feedback={formDiscountErrorMsg}
                  required
                  label="Discount"
                  value={formDiscount}
                  onChange={handleDiscountChange}
                />
              </CCol>
              <CCol md={8}>
                <div style={{ marginBottom: '8px' }}>Due Date</div>
                <CInputGroup>
                  <CFormInput
                    type="number"
                    className="hide-number-arrows"
                    placeholder="YYYY"
                    value={formYYYYValue}
                    invalid={formYYYYErrorMsg !== ''}
                    onChange={handleYYYYChange}
                  />
                  <CInputGroupText>/</CInputGroupText>
                  <CFormInput
                    type="number"
                    className="hide-number-arrows"
                    placeholder="MM"
                    value={formMMValue}
                    invalid={formMMErrorMsg !== ''}
                    onChange={handleMMChange}
                  />
                  <CInputGroupText>/</CInputGroupText>
                  <CFormInput
                    type="number"
                    className="hide-number-arrows"
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
              <CCol>
                <CCol>
                  <CFormLabel>Invoice Items</CFormLabel>
                </CCol>
                {formItems.map((item, index) => (
                  <CRow key={index} className="mb-2 align-items-end">
                    <CCol xs={6} className="pe-0">
                      <CFormInput
                        type="text"
                        label={`Item #${index + 1}`}
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        invalid={item.nameErr}
                        placeholder="Item Name"
                        required
                      />
                    </CCol>
                    <CCol xs={3} className="pe-0">
                      <CFormInput
                        type="number"
                        className="hide-number-arrows"
                        label={`Price`}
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        invalid={item.priceErr}
                        placeholder="88.888"
                        required
                      />
                    </CCol>
                    <CCol xs={2} className="pe-0">
                      <CFormInput
                        type="number"
                        className="hide-number-arrows"
                        label={`Qty`}
                        value={item.qty}
                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                        invalid={item.qtyErr}
                        placeholder="88"
                        required
                      />
                    </CCol>
                    <CCol xs={1}>
                      <CButton
                        disabled={index === 0}
                        style={{ display: index === 0 ? 'none' : 'block' }}
                        color="danger"
                        variant="outline"
                        className="px-1"
                        onClick={() => handleItemRemove(index)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CCol>
                  </CRow>
                ))}
                <CCol className="text-center">
                  {formItems.length < 19 && (
                    <CButton color="dark" variant="outline" onClick={handleItemAdd}>
                      <CIcon icon={cilPlus} />
                    </CButton>
                  )}
                </CCol>
              </CCol>
            </CForm>
          </>
        )}
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

export default DocumentForm
