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

const UserCreateModal = ({ isOpen, onClose }) => {
  const [formUsernameErrorMsg, setFormUsernameErrorMsg] = useState('')
  const [formRoleErrorMsg, setFormRoleErrorMsg] = useState('')
  const [formPwdErrorMsg, setFormPwdErrorMsg] = useState('')
  const [formRePwdErrorMsg, setFormRePwdErrorMsg] = useState('')
  const [formSubmitErrorMsg, setFormSubmitErrorMsg] = useState('')

  const [formUsernameValue, setFormUsernameValue] = useState('')
  const [formRoleValue, setFormRoleValue] = useState('')
  const [formPwdValue, setFormPwdValue] = useState('')
  const [formRePwdValue, setFormRePwdValue] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const axiosPrivate = useAxiosPrivate()

  const handleUsernameChange = (e) => {
    const username = e.target.value

    // Validation checks
    if (username.length < 4) {
      setFormUsernameErrorMsg('Must be at least 4 chars long')
    } else if (!/^[a-zA-Z]/.test(username)) {
      setFormUsernameErrorMsg('Must start with a letter')
    } else {
      setFormUsernameErrorMsg('') // Clear error message if validation passes
    }

    // Update the username value in the state
    setFormUsernameValue(username)
  }

  const handleRoleChange = (e) => {
    const role = e.target.value

    // Validation checks for role
    if (role === '-- Select a role --') {
      setFormRoleErrorMsg('Please select a role')
    } else {
      setFormRoleErrorMsg('') // Clear error message if a role is selected
    }

    // Update the role value in the state
    setFormRoleValue(role)
  }

  const handlePwdChange = (e) => {
    const password = e.target.value

    // Validation checks for password
    if (password.length < 4) {
      setFormPwdErrorMsg('Password must be at least 4 characters long')
    } else {
      setFormPwdErrorMsg('') // Clear error message if validation passes
    }

    // Update the password value in the state
    setFormPwdValue(password)
  }

  const handleRePwdChange = (e) => {
    const rePassword = e.target.value

    // Validation checks for re-entered password
    if (rePassword !== formPwdValue) {
      setFormRePwdErrorMsg('Passwords do not match')
    } else {
      setFormRePwdErrorMsg('') // Clear error message if passwords match
    }

    // Update the re-entered password value in the state
    setFormRePwdValue(rePassword)
  }

  const closeSelf = () => {
    onClose()
    setIsLoading(false)
    setFormUsernameErrorMsg('')
    setFormRoleErrorMsg('')
    setFormPwdErrorMsg('')
    setFormRePwdErrorMsg('')
    setFormUsernameValue('')
    setFormRoleValue('')
    setFormPwdValue('')
    setFormRePwdValue('')
    setFormSubmitErrorMsg('')
  }

  const handleSubmit = async () => {
    let hasValidationErrors = false
    setIsLoading(true)

    // Validation checks for username
    if (formUsernameValue.length < 4) {
      setFormUsernameErrorMsg('Must be at least 4 chars long')
      hasValidationErrors = true
    } else {
      setFormUsernameErrorMsg('') // Clear error message if validation passes
    }

    // Validation checks for role
    if (formRoleValue === '') {
      setFormRoleErrorMsg('Please select a role')
      hasValidationErrors = true
    } else {
      setFormRoleErrorMsg('') // Clear error message if a role is selected
    }

    // Validation checks for password
    if (formPwdValue.length < 4) {
      setFormPwdErrorMsg('Must be at least 4 chars long')
      hasValidationErrors = true
    } else {
      setFormPwdErrorMsg('') // Clear error message if validation passes
    }

    // Validation checks for re-entered password
    if (formPwdValue !== formRePwdValue) {
      setFormRePwdErrorMsg('Passwords do not match')
      hasValidationErrors = true
    } else if (!formRePwdValue) {
      setFormRePwdErrorMsg('Must not be empty')
      hasValidationErrors = true
    } else {
      setFormRePwdErrorMsg('') // Clear error message if passwords match
    }

    // If any field has validation errors, return without making the API call
    if (hasValidationErrors) {
      setIsLoading(false)
      return
    }

    // If all fields pass validation, make the API call to submit the data
    axiosPrivate
      .post('/auth/signup', {
        username: formUsernameValue,
        password: formPwdValue,
        rolename: formRoleValue,
      })
      .then((response) => {
        setIsLoading(false)
        closeSelf()
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.detail ?? err.message
        setFormSubmitErrorMsg(errorMessage)
        console.error('Error signing up user', err)
        setIsLoading(false)
        return
      })
  }

  return (
    <CModal
      alignment="center"
      visible={isOpen}
      onClose={closeSelf}
      aria-labelledby="VerticallyCenteredExample"
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">Create New User</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {formSubmitErrorMsg && <CAlert color="danger">{formSubmitErrorMsg}</CAlert>}

        <CForm className="row g-3">
          <CCol md={6}>
            <CFormInput
              invalid={formUsernameErrorMsg !== ''}
              feedback={formUsernameErrorMsg}
              required
              label="Username"
              value={formUsernameValue}
              onChange={handleUsernameChange}
            />
          </CCol>
          <CCol md={6}>
            <CFormSelect
              invalid={formRoleErrorMsg !== ''}
              feedback={formRoleErrorMsg}
              size="sm"
              label="Role"
              value={formRoleValue}
              onChange={handleRoleChange}
              options={[
                '-- Select a role --',
                { label: 'Admin', value: 'admin' },
                { label: 'Designer', value: 'designer' },
                { label: 'Printer', value: 'printer' },
                { label: 'Packer', value: 'packer' },
              ]}
            />
          </CCol>

          <CCol md={6}>
            <CFormInput
              invalid={formPwdErrorMsg !== ''}
              feedback={formPwdErrorMsg}
              required
              type="password"
              label="Password"
              value={formPwdValue}
              onChange={handlePwdChange}
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              invalid={formRePwdErrorMsg !== ''}
              feedback={formRePwdErrorMsg}
              required
              type="password"
              label="Re-enter Password"
              value={formRePwdValue}
              onChange={handleRePwdChange}
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

export default UserCreateModal
