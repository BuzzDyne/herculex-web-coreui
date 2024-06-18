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
import ConfirmationModal from 'src/views/modals/ConfirmationModal'
import ResellerEditModal from 'src/views/modals/ResellerEditModal'
import ResellerCreateModal from 'src/views/modals/ResellerCreateModal'

const OReseller = () => {
  const [resellerList, setResellerList] = useState([])
  const [isResellerCreateModalVisible, setIsResellerCreateModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [resellerToEdit, setResellerToEdit] = useState({})

  const [isLoading, setIsLoading] = useState(false)
  const [axiosErrMsg, setAxiosErrMsg] = useState('')

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)
  const [confirmModalData, setConfirmModalData] = useState({})

  const axiosPrivate = useAxiosPrivate()

  const fetchData = () => {
    setIsLoading(true)
    axiosPrivate
      .get('/api_orderanku/seller?sort_field=id&sort_order=asc&per_page=5000')
      .then((response) => {
        setResellerList(response.data.sellers)
        setAxiosErrMsg('')
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching seller list', err)
        setAxiosErrMsg(err.message)
        setResellerList([])
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Function to handle edit button click
  const handleEditClick = (sellerData) => {
    setResellerToEdit(sellerData)
    setIsEditModalVisible(true)
  }

  // Function to handle delete button click
  const handleDeleteClick = (sellerData) => {
    openConfirmModal({
      modalTitle: `Delete {${sellerData.seller_name}}`,
      modalText: `Are you sure you want to delete Seller ${sellerData.seller_name} (ID ${sellerData.id})?`,
      modalConfirmText: 'Delete',
      httpMethod: 'DELETE',
      httpEndpointURL: `/api_orderanku/seller/id/${sellerData.id}`,
    })
  }

  const openConfirmModal = (data) => {
    setConfirmModalData(data)
    setIsConfirmModalVisible(true)
  }

  const closeConfirmModal = () => {
    setIsConfirmModalVisible(false)
    setConfirmModalData({})
    fetchData()
  }
  return (
    <>
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center justify-content-between">
            <CCol xs="auto">
              <h5 style={{ marginBottom: 0 }}> Orderanku Seller List</h5>
            </CCol>
            <CCol xs="auto">
              <CButton
                color="success"
                onClick={() => setIsResellerCreateModalVisible(true)}
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
                            Seller Name
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" scope="col">
                            Seller Phone
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" scope="col">
                            Actions
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {resellerList.map((r) => (
                          <CTableRow key={r.id}>
                            <CTableHeaderCell className="text-center" scope="row">
                              {r.id}
                            </CTableHeaderCell>
                            <CTableDataCell className="text-center">{r.seller_name}</CTableDataCell>
                            <CTableDataCell className="text-center">
                              {r.seller_phone}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CButtonGroup role="group">
                                <CButton color="warning" onClick={() => handleEditClick(r)}>
                                  <CIcon icon={cilPencil} />
                                </CButton>
                                {r.id !== 1 && (
                                  <CButton color="danger" onClick={() => handleDeleteClick(r)}>
                                    <CIcon icon={cilTrash} />
                                  </CButton>
                                )}
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

      <ResellerCreateModal
        isOpen={isResellerCreateModalVisible}
        onClose={() => {
          setIsResellerCreateModalVisible(false)
          fetchData()
        }}
      />

      <ConfirmationModal
        isOpen={isConfirmModalVisible}
        onClose={closeConfirmModal}
        {...confirmModalData}
      />
      <ResellerEditModal
        sellerData={resellerToEdit}
        isOpen={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false)
          fetchData()
        }}
      />
    </>
  )
}

export default OReseller
