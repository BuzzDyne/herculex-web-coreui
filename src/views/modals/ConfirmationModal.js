import {
  CAlert,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import React, { useState } from 'react'
import useAuth from 'src/hooks/useAuth'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import { performDownloadFromResponse, performPrintFromResponse } from 'src/utils'

const ConfirmationModal = (props) => {
  const {
    isOpen,
    onClose,
    modalTitle,
    modalText,
    modalConfirmText,
    httpMethod,
    httpEndpointURL,
    httpPayload,
  } = props

  const [formSubmitErrorMsg, setFormSubmitErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const axiosPrivate = useAxiosPrivate()
  const closeSelf = () => {
    onClose()
    setIsLoading(false)

    setFormSubmitErrorMsg('')
  }

  const handleSubmit = () => {
    setIsLoading(true)

    const axiosRequest = (method) => {
      axiosPrivate[method](httpEndpointURL, httpPayload)
        .then((response) => {
          // console.log('Submission successful', response.data)
          setIsLoading(false)
          onClose()
        })
        .catch((error) => {
          console.error('Error submitting data', error)
          setFormSubmitErrorMsg('Error submitting data.')
          setIsLoading(false)
        })
    }

    switch (httpMethod) {
      case 'POST':
      case 'PATCH':
      case 'DELETE':
        axiosRequest(httpMethod.toLowerCase())
        break
      case 'DELETE-BATCH':
        axiosRequest('patch')
        break
      case 'DOWNLOAD':
        const ts = Math.round(Date.now() / 1000).toString()
        axiosPrivate
          .post(httpEndpointURL, httpPayload)
          .then((response) => {
            performPrintFromResponse(response)
            setIsLoading(false)
            onClose()
          })
          .catch((err) => {
            console.error(`Error Downloading Invoice`, err)
            setFormSubmitErrorMsg('Error Downloading Invoice')
            setIsLoading(false)
          })
        break
      default: // GET
        axiosRequest('get')
        break
    }
  }

  return (
    <CModal alignment="center" visible={isOpen} onClose={closeSelf}>
      <CModalHeader>
        <CModalTitle>{modalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {formSubmitErrorMsg && <CAlert color="danger">{formSubmitErrorMsg}</CAlert>}
        <p>{modalText}</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={closeSelf}>
          Cancel
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
          // <CButton color="danger" style={{ color: 'white' }} onClick={handleSubmit}>
          //   Reject Design
          // </CButton>
          <CButton
            onClick={handleSubmit}
            color={httpMethod === 'DELETE' || httpMethod === 'DELETE-BATCH' ? 'danger' : 'primary'}
          >
            {modalConfirmText}
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  )
}

export default ConfirmationModal
