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

const OrderSubmitDesign = ({ isOpen, onClose, orderData }) => {
  const { auth } = useAuth()

  const [formFolderLinkErrMsg, setFormFolderLinkErrMsg] = useState('')
  const [formThumbLinkErrMsg, setFormThumbLinkErrMsg] = useState('')
  const [formSubmitErrorMsg, setFormSubmitErrorMsg] = useState('')

  const [formFolderLinkValue, setFormFolderLinkValue] = useState('')
  const [formThumbLinkValue, setFormThumbLinkValue] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && orderData) {
      setFormFolderLinkValue(orderData.google_folder_url || '')
      setFormThumbLinkValue(orderData.google_file_url || '')
    }
  }, [isOpen, orderData])

  const axiosPrivate = useAxiosPrivate()

  const handleSubmit = () => {
    setIsLoading(true)

    // Form Validation
    const folderLinkRegex = /^https:\/\/drive\.google\.com\/drive\/folders\/.*$/i
    const thumbLinkRegex = /^https:\/\/drive\.google\.com\/file.*$/i

    // Initialize error flags
    let hasError = false

    // Check folder link
    if (!folderLinkRegex.test(formFolderLinkValue)) {
      setFormFolderLinkErrMsg('URL is invalid')
      hasError = true
    }

    // Check thumb link
    if (!thumbLinkRegex.test(formThumbLinkValue)) {
      setFormThumbLinkErrMsg('URL is invalid')
      hasError = true
    }

    // Check if there are any errors
    if (hasError) {
      setIsLoading(false) // Set isLoading to false
      return
    }

    // Both URLs are valid, proceed with the submission
    axiosPrivate
      .patch(`/api_order/id/${orderData.id}/submit_url`, {
        folder_url: formFolderLinkValue,
        thumb_file_url: formThumbLinkValue,
        user_id: auth.token_user_id,
      })
      .then((response) => {
        console.log('Submission successful', response.data)
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

    setFormFolderLinkValue('')
    setFormThumbLinkValue('')

    setFormFolderLinkErrMsg('')
    setFormThumbLinkErrMsg('')
    setFormSubmitErrorMsg('')
  }

  return (
    <CModal alignment="center" visible={isOpen} onClose={closeSelf}>
      <CModalHeader>
        <CModalTitle>Design Links (Order #{orderData.id})</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {formSubmitErrorMsg && <CAlert color="danger">{formSubmitErrorMsg}</CAlert>}
        <CForm className="row g-3">
          <CCol md={12}>
            <CFormInput
              type="text"
              invalid={formFolderLinkErrMsg !== ''}
              feedback={formFolderLinkErrMsg}
              required
              label="Folder URL"
              value={formFolderLinkValue}
              onChange={(e) => {
                setFormFolderLinkValue(e.target.value)
                setFormFolderLinkErrMsg('')
              }}
            />
          </CCol>
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

export default OrderSubmitDesign
