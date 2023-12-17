import {
  CAlert,
  CButton,
  CCol,
  CForm,
  CFormInput,
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
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from '../../hooks/useAuth'

const OrderInitialDataCreate = ({ isOpen, onClose, orderID }) => {
  const { auth } = useAuth()
  const [userList, setUserList] = useState([])
  const [selectedPIC, setSelectedPIC] = useState('')

  const sortedUserList = [...userList]
  sortedUserList.sort((a, b) => {
    const rolesOrder = ['admin', 'designer', 'printer', 'packer']
    const roleA = rolesOrder.indexOf(a.role_name)
    const roleB = rolesOrder.indexOf(b.role_name)
    if (roleA !== roleB) {
      return roleA - roleB
    }

    // If roles are the same, order alphabetically by username
    return a.username.localeCompare(b.username)
  })

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

  const [isLoading, setIsLoading] = useState(true)

  const axiosPrivate = useAxiosPrivate()

  const fetchDesigners = () => {
    setIsLoading(true)
    axiosPrivate
      .get('/api_user/get_designers')
      .then((response) => {
        setUserList(response.data)
        // console.log('response.data: ', response.data)
        setFormSubmitErrorMsg('')
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching user list', err)
        setFormSubmitErrorMsg(err.message)
        setUserList([])
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setIsLoading(true)
    const currentDate = new Date()
    currentDate.setUTCMinutes(
      currentDate.getUTCMinutes() + currentDate.getTimezoneOffset() + 7 * 60,
    ) // Convert to GMT+7
    currentDate.setDate(currentDate.getDate() + 5) // Add 5 days

    setFormYYYYValue(currentDate.getUTCFullYear().toString())
    setFormMMValue((currentDate.getUTCMonth() + 1).toString().padStart(2, '0')) // Months are 0-based
    setFormDDValue(currentDate.getUTCDate().toString().padStart(2, '0'))

    fetchDesigners()
  }, [isOpen])

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

    const picId = selectedPIC === 'None' ? undefined : selectedPIC

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

    // If everything is valid, make a POST request
    axiosPrivate
      .patch(`/api_order/id/${orderID}/submit_initial_data`, {
        cust_phone_no: formCustPhoneValue,
        user_deadline_prd: dateStr,
        user_id: auth.token_user_id,
        pic_user_id: picId,
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
    <CModal
      alignment="center"
      visible={isOpen}
      onClose={closeSelf}
      aria-labelledby="VerticallyCenteredExample"
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">
          Input Initial Data (Order #{orderID})
        </CModalTitle>
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
                <div style={{ marginBottom: '8px' }}>Deadline</div>
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
              <CCol md={12}>
                <CFormSelect
                  label="Designer PIC"
                  value={selectedPIC}
                  onChange={(e) => setSelectedPIC(e.target.value)}
                >
                  <option value="None">None</option>
                  {sortedUserList.map((user) => (
                    <option key={user.id} value={user.id}>
                      ({user.role_name}) <strong>{user.username}</strong>
                    </option>
                  ))}
                </CFormSelect>
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

export default OrderInitialDataCreate
