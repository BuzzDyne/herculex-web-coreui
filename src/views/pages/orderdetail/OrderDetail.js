import {
  CButton,
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CCol,
  CImage,
  CRow,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OrderCommentList from 'src/components/OrderCommentList'
import OrderDetailListItem from 'src/components/OrderDetailListItem'
import OrderHistoryList from 'src/components/OrderHistoryList'
import CustomStackedProgressBar from 'src/components/OrderProgressBar'
import { cibWhatsapp, cilFolderOpen } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  formatPeriodToString,
  formatTStoPrettyString,
  getEcomName,
  openWhatsappChat,
} from 'src/utils'
import useAuth from 'src/hooks/useAuth'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const [order, setOrder] = useState({})
  const [orderItems, setOrderItems] = useState([])
  const [orderTrackings, setOrderTrackings] = useState([])
  const [picUsername, setPicUsername] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    const api_path = `/api_order/id/${id}`

    axiosPrivate
      .get(api_path)
      .then((response) => {
        console.log(api_path, ':', response.data)
        setOrder(response.data.order_data)
        setOrderItems(response.data.order_items_data)
        setOrderTrackings(response.data.order_trackings)
        setPicUsername(response.data.pic_username)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching OrderDetail', err)
        setOrder('')
        setIsLoading(false)
        if (err.response.status === 404 && err.response.data.detail === 'ID not found') {
          console.log('inside 404 call')
          navigate('/404')
          return
        }
        navigate('/500')
      })
  }, [id])

  return (
    <>
      {isLoading ? (
        <CRow>
          <CCol className="d-flex justify-content-center">
            <CSpinner color="dark" />
          </CCol>
        </CRow>
      ) : (
        <>
          <CRow className="mb-3" xs={{ gutterX: 2 }}>
            <CCol xs="12" md="3">
              <div
                style={{
                  height: 0,
                  paddingBottom: '100%',
                  position: 'relative',
                }}
              >
                <CImage
                  src={order.thumb_url ? order.thumb_url : 'https://placehold.co/400?text=No+Image'}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                  }}
                />
              </div>
            </CCol>

            <CCol xs="12" md="9">
              <CCard style={{ height: '100%' }}>
                <CCardBody className="py-2">
                  <CCardTitle className="fw-bold fs-3">Order #{id}</CCardTitle>
                  <CCardText>
                    <CRow>
                      <CCol>
                        <div>
                          <b>Platform</b>: <br className="d-xs-block d-sm-none" />
                          {getEcomName(order.ecommerce_code)}
                        </div>
                        <div>
                          <b>Phone</b>: <br className="d-xs-block d-sm-none" />
                          {order.cust_phone_no || '-'}
                        </div>
                        <div>
                          <b>Deadline</b>: <br className="d-xs-block d-sm-none" />
                          {formatPeriodToString(order.user_deadline_prd)}
                        </div>
                      </CCol>
                      <CCol>
                        <div>
                          <b>Ecom Status</b>: <br className="d-xs-block d-sm-none" />
                          {order.ecom_order_status}
                        </div>
                        <div>
                          <b>Last Activity</b>: <br className="d-xs-block d-sm-none" />
                          {formatTStoPrettyString(order.last_updated_ts)}
                        </div>
                        <div>
                          <b>Current PIC</b>: <br className="d-xs-block d-sm-none" />
                          {picUsername || '-'}
                        </div>
                      </CCol>
                    </CRow>
                  </CCardText>
                  <CCardText>
                    <CRow className="justify-content-start">
                      {auth.token_role_id === 1 && (
                        <CCol>
                          <CButton
                            className="w-100"
                            type="button"
                            size="sm"
                            color={order.cust_phone_no ? 'success' : 'secondary'}
                            disabled={!order.cust_phone_no}
                            onClick={() => {
                              openWhatsappChat(order.cust_phone_no)
                            }}
                          >
                            <CIcon icon={cibWhatsapp} />
                          </CButton>
                        </CCol>
                      )}
                      <CCol>
                        <CButton
                          className="w-100"
                          type="button"
                          size="sm"
                          color={order.google_folder_url ? 'info' : 'secondary'}
                          disabled={!order.google_folder_url}
                          onClick={() => {
                            window.open(order.google_folder_url, '_blank')
                          }}
                        >
                          <CIcon icon={cilFolderOpen} />
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCardText>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol xs="12">
              <CustomStackedProgressBar orderData={order}></CustomStackedProgressBar>
            </CCol>
          </CRow>
          <CRow xs={{ gutterX: 1 }}>
            <CCol xs="12" md="6" className="mb-3">
              <CCard style={{ height: '100%' }}>
                <CCardBody className="py-2">
                  <h5>Items</h5>
                  <CCol>
                    {orderItems.length > 0 ? (
                      orderItems.map((item) => (
                        <OrderDetailListItem key={item.id} itemData={item} />
                      ))
                    ) : (
                      <p>No order items available.</p>
                    )}
                  </CCol>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs="12" md="6" className="mb-3">
              <OrderCommentList />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <OrderHistoryList historyList={orderTrackings} />
          </CRow>
        </>
      )}
    </>
  )
}

export default OrderDetail
