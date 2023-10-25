import React, { useEffect, useState } from 'react'
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

const UserEditModal = ({ userData, isOpen, onClose }) => {
  const [formPwdErrorMsg, setFormPwdErrorMsg] = useState('')
  const [formRePwdErrorMsg, setFormRePwdErrorMsg] = useState('')
  const [formSubmitErrorMsg, setFormSubmitErrorMsg] = useState('')

  const [formUsernameValue, setFormUsernameValue] = useState('')
  const [formRoleValue, setFormRoleValue] = useState('')
  const [formPwdValue, setFormPwdValue] = useState('')
  const [formRePwdValue, setFormRePwdValue] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    setFormUsernameValue(userData.username)
    setFormRoleValue(userData.role_name)
  }, [userData])

  const handleRoleChange = (e) => {
    setFormRoleValue(e.target.value)
  }
  const handlePwdChange = (e) => {
    const password = e.target.value

    // Validation checks for password
    if (password.length === 0) {
      // Clear RePwd and its error message if password is empty
      setFormRePwdValue('')
      setFormRePwdErrorMsg('')
    } else if (password.length < 4) {
      setFormPwdErrorMsg('Password must be at least 4 characters long')
    } else {
      setFormPwdErrorMsg('') // Clear error message if validation passes
    }

    // Update the password value in the state
    setFormPwdValue(password)

    // Check if RePwd needs validation
    if (password.length >= 4 && formRePwdValue !== password) {
      console.log(password.length)
      setFormRePwdErrorMsg('Passwords do not match')
    } else {
      setFormRePwdErrorMsg('') // Clear error message if passwords match
    }
  }

  const handleRePwdChange = (e) => {
    const rePassword = e.target.value

    // Validation checks for re-entered password
    if (formPwdValue.length >= 4 && rePassword !== formPwdValue) {
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

    setFormPwdErrorMsg('')
    setFormRePwdErrorMsg('')
    setFormSubmitErrorMsg('')

    setFormUsernameValue('')
    setFormRoleValue('')
    setFormPwdValue('')
    setFormRePwdValue('')
  }

  const handleSubmit = async () => {
    let hasValidationErrors = false
    setIsLoading(true)

    // Validation checks for password
    if (formPwdValue.length < 4 && formPwdValue.length > 0) {
      setFormPwdErrorMsg('Must be at least 4 chars long')
      hasValidationErrors = true
    } else {
      setFormPwdErrorMsg('')
    }

    // Validation checks for re-entered password
    if (formPwdValue !== formRePwdValue && formPwdValue.length > 0) {
      setFormRePwdErrorMsg('Passwords do not match')
      hasValidationErrors = true
    } else {
      setFormRePwdErrorMsg('')
    }

    // If any field has validation errors, return without making the API call
    if (hasValidationErrors) {
      setIsLoading(false)
      return
    }

    // If all fields pass validation, make the API call to submit the data
    try {
      const payload = {
        password: formPwdValue,
        rolename: formRoleValue,
      }
      await axiosPrivate.patch(`/api_user/id/${userData.id}`, payload)
    } catch (err) {
      console.log(err)
      setFormSubmitErrorMsg(err)
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
        <CModalTitle id="VerticallyCenteredExample">Edit User</CModalTitle>
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
            <CFormInput label="Username" disabled value={formUsernameValue} />
          </CCol>
          <CCol md={6}>
            <CFormSelect
              size="sm"
              label="Role"
              value={formRoleValue}
              onChange={handleRoleChange}
              options={[
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
              label="New Pasword"
              value={formPwdValue}
              onChange={handlePwdChange}
              placeholder="Keep Existing Pwd"
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              invalid={formRePwdErrorMsg !== ''}
              feedback={formRePwdErrorMsg}
              disabled={formPwdValue === ''}
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
export default UserEditModal
