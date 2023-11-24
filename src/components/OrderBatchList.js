import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardSubtitle,
  CCardTitle,
  CCol,
  CImage,
  CListGroup,
  CListGroupItem,
  CRow,
  CSpinner,
} from '@coreui/react'
import { cilFolderOpen } from '@coreui/icons'
import React, { useEffect, useState } from 'react'
import { formatTStoPrettyString, getImageURLorNoImg } from 'src/utils'
import CIcon from '@coreui/icons-react'
import 'src/assets/css/styles.css'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom'
import OrderBatchFileDone from 'src/views/modals/OrderBatchFileDone'
import ImageViewModal from 'src/views/modals/ImageViewModal'

const OrderBatchList = () => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [axiosErrMsg, setAxiosErrMsg] = useState('')
  const [refreshDataFlag, setRefreshDataFlag] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState({})
  const toggleRefreshDataFlag = () => {
    setRefreshDataFlag((prevFlag) => !prevFlag)
  }

  const [batchesData, setBatchesData] = useState([])

  const [isBatchDoneModalOpen, setIsBatchDoneModalOpen] = useState(false)
  const openCreateBatchModal = (batchData) => {
    setSelectedBatch(batchData)
    setIsBatchDoneModalOpen(true)
  }

  const [selectedOrderData, setSelectedOrderData] = useState({})
  const [isImageViewModalVisible, setIsImageViewModalVisible] = useState(false)
  const openImageViewModal = (orderData) => {
    setSelectedOrderData(orderData)
    setIsImageViewModalVisible(true)
  }

  const axiosPrivate = useAxiosPrivate()
  const fetchData = () => {
    setIsLoading(true)
    setAxiosErrMsg('')

    const apiPath = '/api_order/batchfile/active'

    axiosPrivate
      .get(apiPath)
      .then((response) => {
        // console.log(apiPath, ':', response.data)
        setBatchesData(response.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching task data', err)
        setAxiosErrMsg(err.message)
        setBatchesData([])
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [refreshDataFlag])

  const handleGoToOrderDetail = (orderId) => {
    navigate(`/order_detail/${orderId}`)
  }

  return (
    <>
      <CCard className="text-center mb-4">
        <CCardHeader>
          <h5 className="mb-0">Printing BatchFile List</h5>
        </CCardHeader>
        <CCardBody>
          {axiosErrMsg && (
            <CRow className="justify-content-center">
              <CCol>
                <CAlert color="danger" className="p-1">
                  Something went wrong! <br />
                  {axiosErrMsg}
                </CAlert>
              </CCol>
            </CRow>
          )}

          {isLoading ? (
            <CRow>
              <CCol className="d-flex justify-content-center">
                <CSpinner color="dark" />
              </CCol>
            </CRow>
          ) : (
            <CRow xs={{ gutter: 2 }} className="justify-content-center">
              {batchesData.length > 0 ? (
                batchesData.map((batch) => (
                  <CCol xs="12" sm="6">
                    <CCard className="hoverable">
                      <CRow className="py-2">
                        <CCol>
                          <CRow className="ms-1">
                            <CCol xs={12}>
                              <CCardTitle className="mb-1" style={{ textAlign: 'left' }}>
                                Batch {batch.batch_name}
                              </CCardTitle>
                            </CCol>
                            <CCol xs={12}>
                              <CRow>
                                <CCol className="pe-0">
                                  <CCardSubtitle
                                    className="mb-0 text-muted"
                                    style={{ textAlign: 'left', fontSize: 'x-small' }}
                                  >
                                    Created: {formatTStoPrettyString(batch.create_dt)} <br />
                                    Designer: {batch.designer_username}
                                  </CCardSubtitle>
                                </CCol>
                                <CCol>
                                  <CCardSubtitle
                                    className="mb-0 text-muted"
                                    style={{ textAlign: 'left', fontSize: 'x-small' }}
                                  >
                                    Printed: {formatTStoPrettyString(batch.printed_dt)} <br />
                                    Printer: {batch.printer_username || '-'}
                                  </CCardSubtitle>
                                </CCol>
                              </CRow>
                            </CCol>
                          </CRow>
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                          <CListGroup className="w-100">
                            {batch.batch_order_list.map((order) => (
                              <CListGroupItem style={{ borderRadius: 0, paddingX: 0 }}>
                                <CRow>
                                  <CCol xs={'auto'}>
                                    <div
                                      style={{
                                        width: '50px', // Set a fixed width for the container
                                        height: '50px', // Set a fixed height for the container
                                        overflow: 'hidden', // Hide any content that overflows the container
                                        position: 'relative', // Set position to relative for absolute centering
                                        cursor: 'pointer',
                                      }}
                                      onClick={() => openImageViewModal(order)}
                                    >
                                      <CImage
                                        src={getImageURLorNoImg(order.thumb_url)}
                                        alt="placeholder"
                                        style={{
                                          width: '100%', // Ensure the image takes up the full width of its container
                                          height: '100%', // Ensure the image takes up the full height of its container
                                          objectFit: 'cover', // Ensure the image covers the entire container
                                          objectPosition: '50% 50%', // Center-cut the image
                                          maxHeight: '100%', // Set the maximum height to the height of the container
                                          maxWidth: '100%', // Set the maximum width to the width of the container
                                        }}
                                      />
                                    </div>
                                  </CCol>
                                  <CCol
                                    className="px-0 d-flex align-items-center"
                                    style={{ textAlign: 'left' }}
                                  >
                                    <CCardSubtitle
                                      className="mb-0 small"
                                      onClick={() => handleGoToOrderDetail(order.id)}
                                      style={{
                                        cursor: 'pointer',
                                      }}
                                    >
                                      Order #{order.id}
                                    </CCardSubtitle>
                                  </CCol>

                                  <CCol xs={'auto'} className="d-flex align-items-center">
                                    <CButton
                                      className="w-100 mt-1"
                                      size="sm"
                                      color={'info'}
                                      onClick={() => {
                                        window.open(order.google_folder_url, '_blank')
                                      }}
                                    >
                                      <CIcon icon={cilFolderOpen} />
                                    </CButton>
                                  </CCol>
                                </CRow>
                              </CListGroupItem>
                            ))}
                          </CListGroup>
                        </CCol>
                      </CRow>
                      <CCardFooter>
                        <CButton
                          className="w-100"
                          color="success"
                          size="sm"
                          onClick={() => openCreateBatchModal(batch)}
                        >
                          Done
                        </CButton>
                      </CCardFooter>
                    </CCard>
                  </CCol>
                ))
              ) : (
                <CCol className="text-center my-4">
                  <p>No active batch file...</p>
                </CCol>
              )}
              {/* TODO MAP Batch Item*/}
            </CRow>
          )}
        </CCardBody>
      </CCard>
      <OrderBatchFileDone
        isOpen={isBatchDoneModalOpen}
        onClose={() => {
          setIsBatchDoneModalOpen(false)
          toggleRefreshDataFlag()
        }}
        batchData={selectedBatch}
      />

      <ImageViewModal
        isOpen={isImageViewModalVisible}
        onClose={() => {
          setIsImageViewModalVisible(false)
        }}
        orderData={selectedOrderData}
      />
    </>
  )
}

export default OrderBatchList
