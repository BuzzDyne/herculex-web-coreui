import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCardTitle,
  CCol,
  CRow,
  CSpinner,
} from '@coreui/react'
import { cilFolderOpen, cilCheck } from '@coreui/icons'
import React, { useEffect, useState } from 'react'
import { getImageURLorNoImg, getStatusBadge } from 'src/utils'
import CIcon from '@coreui/icons-react'
import 'src/assets/css/styles.css'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import OrderBatchFileCreate from 'src/views/modals/OrderBatchFileCreate'

const OrderToBatchFileList = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [axiosErrMsg, setAxiosErrMsg] = useState('')
  const [refreshDataFlag, setRefreshDataFlag] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState([])
  const toggleRefreshDataFlag = () => {
    setRefreshDataFlag((prevFlag) => !prevFlag)
  }

  const [orders, setOrders] = useState([])

  const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = useState(false)
  const openCreateBatchModal = () => {
    setIsCreateBatchModalOpen(true)
  }

  const axiosPrivate = useAxiosPrivate()
  const fetchData = () => {
    setIsLoading(true)
    setAxiosErrMsg('')

    const apiPath = '/api_order/get_orders_by_status?status=250'

    axiosPrivate
      .get(apiPath)
      .then((response) => {
        // console.log(apiPath, ':', response.data)
        setOrders(response.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching task data', err)
        setAxiosErrMsg(err.message)
        setOrders([])
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
    setSelectedOrders([])
  }, [refreshDataFlag])

  const toggleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelectedOrders) => {
      if (prevSelectedOrders.includes(orderId)) {
        return prevSelectedOrders.filter((id) => id !== orderId)
      } else {
        return [...prevSelectedOrders, orderId]
      }
    })
  }

  return (
    <>
      <CCard className="text-center mb-4">
        <CCardHeader>
          <h5 className="mb-0">BatchFile Queue</h5>
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
            <>
              <CRow className="justify-content-center">
                <CCol className="mb-2" xs="12" sm="6">
                  <CButton
                    color="success"
                    className="w-100"
                    disabled={selectedOrders.length === 0}
                    onClick={openCreateBatchModal}
                  >
                    Create BatchFile <CBadge color="dark">{selectedOrders.length}</CBadge>
                  </CButton>
                </CCol>
              </CRow>

              <CRow xs={{ gutter: 2 }} className="justify-content-center">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <CCol xs="6" sm="4" md="3" xl="2" key={order.order.id}>
                      <CCard
                        position="relative"
                        style={{
                          cursor: 'pointer',
                          border: selectedOrders.includes(order.order.id)
                            ? '2px solid #2eb85c'
                            : '1px solid rgba(0, 0, 21, 0.176)',
                        }}
                        className="hoverable"
                        onClick={() => toggleSelectOrder(order.order.id)}
                      >
                        {selectedOrders.includes(order.order.id) && (
                          <CBadge
                            color={'success'}
                            className="position-absolute top-0 start-50 translate-middle mt-2"
                            style={{ zIndex: 999 }}
                          >
                            <CIcon icon={cilCheck} />
                          </CBadge>
                        )}
                        <CCardImage
                          orientation="top"
                          src={getImageURLorNoImg(order.order.thumb_url)}
                        />
                        <CCardBody className="py-2 ">
                          <CCardTitle>Order #{order.order.id}</CCardTitle>
                          {getStatusBadge(order.order.internal_status_id)}
                          <CButton
                            className="w-100 mt-1"
                            size="sm"
                            color={order.order.google_folder_url ? 'info' : 'secondary'}
                            disabled={!order.order.google_folder_url}
                            onClick={() => {
                              window.open(order.order.google_folder_url, '_blank')
                            }}
                          >
                            <CIcon icon={cilFolderOpen} />
                          </CButton>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))
                ) : (
                  <CCol className="text-center my-4">
                    <p>No orders waiting batch file...</p>
                  </CCol>
                )}
              </CRow>
            </>
          )}
        </CCardBody>
      </CCard>
      <OrderBatchFileCreate
        isOpen={isCreateBatchModalOpen}
        onClose={() => {
          setIsCreateBatchModalOpen(false)
          toggleRefreshDataFlag()
        }}
        listOrderIDs={selectedOrders}
      />
    </>
  )
}
export default OrderToBatchFileList
