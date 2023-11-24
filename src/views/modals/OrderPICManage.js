import {
  CAlert,
  CBadge,
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
  CRow,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import useAuth from 'src/hooks/useAuth'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'

const OrderPICManage = ({ isOpen, onClose, orderData }) => {
  const { auth } = useAuth()
  const [userList, setUserList] = useState([])
  const [selectedPIC, setSelectedPIC] = useState('')

  const sortedUserList = [...userList]
  // Sort the user list by role and username
  sortedUserList.sort((a, b) => {
    // Order by role
    const rolesOrder = ['admin', 'designer', 'printer', 'packer']
    const roleA = rolesOrder.indexOf(a.role_name)
    const roleB = rolesOrder.indexOf(b.role_name)
    if (roleA !== roleB) {
      return roleA - roleB
    }

    // If roles are the same, order alphabetically by username
    return a.username.localeCompare(b.username)
  })

  const [formSubmitErrorMsg, setFormSubmitErrorMsg] = useState('')

  const [isLoading, setIsLoading] = useState(true)

  const axiosPrivate = useAxiosPrivate()

  const closeSelf = () => {
    onClose()
    setIsLoading(false)

    setFormSubmitErrorMsg('')
  }

  const fetchData = () => {
    setIsLoading(true)
    axiosPrivate
      .get('/api_user/get_list')
      .then((response) => {
        setUserList(response.data)
        // console.log('response.data: ', response.data)
        setSelectedPIC(orderData.pic_user_id)
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
    fetchData()
  }, [isOpen])

  const handleSubmit = () => {
    setIsLoading(true)

    const picId = selectedPIC === 'None' ? undefined : selectedPIC

    axiosPrivate
      .patch(`/api_order/id/${orderData.id}/update_pic`, {
        user_id: auth.token_user_id,
        pic_id: picId,
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
        <CModalTitle>Manage PIC (Order #{orderData.id})</CModalTitle>
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
                <CFormSelect
                  label="PIC"
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

export default OrderPICManage
