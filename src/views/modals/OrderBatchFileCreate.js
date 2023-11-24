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

const OrderBatchFileCreate = ({ isOpen, onClose, listOrderIDs }) => {
  const { auth } = useAuth()

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

    axiosPrivate
      .post(`/api_order/batchfile/new`, {
        designer_id: auth.token_user_id,
        order_ids: listOrderIDs,
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

  return (
    <CModal alignment="center" visible={isOpen} onClose={closeSelf}>
      <CModalHeader>
        <CModalTitle>Create a new Batch Printing File?</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {formSubmitErrorMsg && <CAlert color="danger">{formSubmitErrorMsg}</CAlert>}
        <p>
          Are you sure to create a new Batch Printing File for these orders:
          <ul>
            {listOrderIDs.map((orderId) => (
              <li key={orderId}>
                <strong>#{orderId}</strong>
              </li>
            ))}
          </ul>
        </p>
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

export default OrderBatchFileCreate
