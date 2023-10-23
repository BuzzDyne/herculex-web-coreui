import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import CIcon from '@coreui/icons-react'
import UserCreateModal from '../../modals/UserCreateModal'
import UserDeleteModal from '../../modals/UserDeleteModal'

const UserMgmt = () => {
  const [userList, setUserList] = useState([])
  const [isUserCreateModalVisible, setIsUserCreateModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [userToDelete, setUserToDelete] = useState({
    id: null,
    username: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [axiosErrMsg, setAxiosErrMsg] = useState('')

  const axiosPrivate = useAxiosPrivate()

  const fetchData = () => {
    console.log('fetchData start')
    setIsLoading(true)
    axiosPrivate
      .get('/api_user/get_list')
      .then((response) => {
        setUserList(response.data)
        setAxiosErrMsg('')
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching user list', err)
        setAxiosErrMsg(err.message)
        setUserList([])
        setIsLoading(false)
      })
    console.log('fetchData end')
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Function to handle edit button click
  const handleEditClick = (userId) => {
    // Implement your edit functionality here
    console.log('Edit user with ID:', userId)
  }

  // Function to handle delete button click
  const handleDeleteClick = (userId, username) => {
    // Set the user to delete and show the delete modal
    setUserToDelete({ id: userId, username })
    setIsDeleteModalVisible(true)
  }

  // Function to format the date to show only the date part (YYYY-MM-DD)
  const formatDate = (isoDate) => {
    const date = new Date(isoDate)
    return date.toISOString().split('T')[0]
  }

  const formatDateTime = (isoDate) => {
    if (isoDate) {
      return isoDate.replace('T', ' ')
    } else {
      return '-' // or any other default value or message you want to display
    }
  }
  return (
    <>
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center justify-content-between">
            <CCol xs="auto">
              <h5 style={{ marginBottom: 0 }}> User Management</h5>
            </CCol>
            <CCol xs="auto">
              <CButton
                color="success"
                onClick={() => setIsUserCreateModalVisible(true)}
                className="text-right"
              >
                <CIcon icon={cilPlus} />
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CContainer>
            {isLoading ? (
              <CRow>
                <CCol className="d-flex justify-content-center">
                  <CSpinner color="dark" />
                </CCol>
              </CRow>
            ) : (
              <>
                {axiosErrMsg && (
                  <CAlert color="danger">
                    Something went wrong! <br />
                    {axiosErrMsg}
                  </CAlert>
                )}

                <CRow className="align-items-center justify-content-end" xs={{ gutterY: 1 }}>
                  <CCol>
                    <CTable hover responsive align="middle">
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell className="text-center" scope="col">
                            ID
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" scope="col">
                            Username
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" scope="col">
                            Role
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" scope="col">
                            Created
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" scope="col">
                            Last Login
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" scope="col">
                            Actions
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {userList.map((user) => (
                          <CTableRow key={user.id}>
                            <CTableHeaderCell className="text-center" scope="row">
                              {user.id}
                            </CTableHeaderCell>
                            <CTableDataCell className="text-center">{user.username}</CTableDataCell>
                            <CTableDataCell className="text-center">
                              {user.role_name}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {formatDate(user.created_dt)}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {formatDateTime(user.last_login_dt)}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CButtonGroup role="group" aria-label="Basic example">
                                <CButton color="warning" onClick={() => handleEditClick(user.id)}>
                                  <CIcon icon={cilPencil} />
                                </CButton>
                                <CButton
                                  color="danger"
                                  onClick={() => handleDeleteClick(user.id, user.username)}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </CButtonGroup>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CCol>
                </CRow>
              </>
            )}
          </CContainer>
        </CCardBody>
      </CCard>
      <UserCreateModal
        isOpen={isUserCreateModalVisible}
        onClose={() => {
          setIsUserCreateModalVisible(false)
          fetchData() // Call the fetchData function after closing the modal
        }}
      />
      <UserDeleteModal
        userID={userToDelete.id}
        userName={userToDelete.username}
        isOpen={isDeleteModalVisible}
        onClose={() => {
          setIsDeleteModalVisible(false)
          // Optionally, you can re-fetch the user list after the deletion
          fetchData()
        }}
      />
    </>
  )
}

export default UserMgmt
