import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import { formatTStoPrettyString, getDocTypeName, performDownloadFromResponse } from 'src/utils'
import DocumentCreateManualModal from 'src/views/modals/DocumentCreateManualModal'
import DocumentEditModal from 'src/views/modals/DocumentEditModal'

const DocumentList = () => {
  const [docList, setDocList] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [axiosErrMsg, setAxiosErrMsg] = useState('')

  const [isManualModalVisible, setIsManualModalVisible] = useState(false)
  const openManualModal = () => {
    console.log(`inside openManualModal, isManualVisible ${isManualModalVisible}`)
    setIsManualModalVisible(true)
  }
  const [isEditDocModalOpen, setIsEditDocModalOpen] = useState(false)
  const [docIdSelected, setDocIdSelected] = useState()
  const openEditDocModal = (doc_id) => {
    setDocIdSelected(doc_id)
    setIsEditDocModalOpen(true)
  }

  const axiosPrivate = useAxiosPrivate()

  const fetchData = () => {
    setIsLoading(true)
    setAxiosErrMsg('')
    axiosPrivate
      .get('/api_docs/list/latest/200')
      .then((response) => {
        setDocList(response.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching doc list', err)
        setAxiosErrMsg(err.message)
        setOrderListAdmin([])
        setIsLoading(false)
      })
  }

  const getDownloadPDF = async (doc_id, filename) => {
    axiosPrivate
      .get(`/api_docs/download/id/${doc_id}`, {
        responseType: 'blob',
      })
      .then((response) => {
        // Create a blob URL for the PDF file
        performDownloadFromResponse(response, filename)
      })
      .catch((err) => {
        console.error(`Error downloading docID ${doc_id}`, err)
      })
  }

  useEffect(() => {
    // Fetch data when component mounts
    fetchData()
  }, [])

  return (
    <>
      <CCard className="mb-2">
        <CCardHeader>
          <CRow className="align-items-center justify-content-between">
            <CCol xs="auto">
              <h5 style={{ marginBottom: 0 }}>Document List</h5>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CRow className="align-items-center justify-content-between" xs={{ gutterY: 2 }}>
            <CCol xs="auto"></CCol>
            <CCol xs="2" className="text-end">
              <CButton color="success" onClick={() => openManualModal()}>
                <CIcon icon={cilPlus} />
              </CButton>
            </CCol>
            {axiosErrMsg && (
              <CCol xs={12}>
                <CAlert color="danger">
                  Something went wrong! <br />
                  {axiosErrMsg}
                </CAlert>
              </CCol>
            )}
            {isLoading ? (
              <CCol xs="12" className="d-flex justify-content-center">
                <CSpinner color="dark" />
              </CCol>
            ) : (
              <CCol xs="12">
                <CTable style={{ minHeight: '200px' }} small hover responsive align="middle">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="text-center" scope="col">
                        Order #
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" scope="col">
                        Type
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" scope="col">
                        Doc Number
                      </CTableHeaderCell>
                      {/* <CTableHeaderCell className="text-center" scope="col">
                        Customer Name
                      </CTableHeaderCell> */}
                      <CTableHeaderCell className="text-center" scope="col">
                        Time
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" scope="col">
                        Action
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {docList.map((data) => (
                      <CTableRow key={data.id}>
                        <CTableHeaderCell className="text-center" scope="row">
                          {data.order_id || '-'}
                        </CTableHeaderCell>
                        <CTableDataCell className="text-center">
                          {getDocTypeName(data.doc_type)}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {data.doc_number || '-'}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {formatTStoPrettyString(data.generated_date)}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CDropdown style={{ cursor: 'pointer' }}>
                            <CDropdownToggle color="light" />
                            <CDropdownMenu>
                              <CDropdownItem
                                onClick={() => getDownloadPDF(data.id, data.doc_number)}
                              >
                                Download
                              </CDropdownItem>
                              <CDropdownDivider />
                              <CDropdownItem onClick={() => openEditDocModal(data.id)}>
                                Edit
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCol>
            )}
          </CRow>
        </CCardBody>
      </CCard>
      <DocumentCreateManualModal
        isOpen={isManualModalVisible}
        onClose={() => {
          setIsManualModalVisible(false)
          fetchData()
        }}
      />
      <DocumentEditModal
        doc_id={docIdSelected}
        isOpen={isEditDocModalOpen}
        onClose={() => {
          setIsEditDocModalOpen(false)
          fetchData()
        }}
      />
    </>
  )
}

export default DocumentList
