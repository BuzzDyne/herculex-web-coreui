import React, { useState } from 'react'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const UserDeleteModal = ({ userID, userName, isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const axiosPrivate = useAxiosPrivate()

  const closeSelf = () => {
    onClose()
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await axiosPrivate.delete(`/api_user/id/${userID}`)
      console.log(response.data)
    } catch (err) {
      console.error(err)
      return
    }
    closeSelf()
  }
  return (
    <CModal alignment="center" visible={isOpen} onClose={closeSelf}>
      <CModalHeader>
        <CModalTitle>Delete {userName}?</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>
          Are you sure to delete user <strong>'{userName}'</strong> ?
        </p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={closeSelf}>
          Close
        </CButton>
        {isLoading ? (
          <CButton color="danger" disabled>
            <CSpinner
              component="span"
              size="sm"
              aria-hidden="true"
              style={{ marginRight: '8px' }}
            />
            Loading...
          </CButton>
        ) : (
          <CButton color="danger" onClick={handleSubmit}>
            Delete
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  )
}
export default UserDeleteModal
