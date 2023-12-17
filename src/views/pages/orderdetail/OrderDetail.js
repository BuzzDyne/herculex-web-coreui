import {
  CButton,
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImage,
  CRow,
  CSpinner,
  CTooltip,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import OrderCommentList from 'src/components/OrderCommentList'
import OrderDetailListItem from 'src/components/OrderDetailListItem'
import OrderHistoryList from 'src/components/OrderHistoryList'
import CustomStackedProgressBar from 'src/components/OrderProgressBar'
import { cibWhatsapp, cilFolderOpen, cilCopy } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  formatPeriodToString,
  getColorBasedOnDeadline,
  getEcomBadge,
  getEcomOrderID,
  getImageURLorNoImg,
  openWhatsappChat,
} from 'src/utils'
import useAuth from 'src/hooks/useAuth'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import OrderUpdateThumb from 'src/views/modals/OrderUpdateThumb'

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const [order, setOrder] = useState({})
  const [orderItems, setOrderItems] = useState([])
  const [orderTrackings, setOrderTrackings] = useState([])
  const [picUsername, setPicUsername] = useState('')
  const [batchName, setBatchName] = useState('')

  const ecomOrderID = getEcomOrderID(order)
  const [copied, setCopied] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [refreshDataFlag, setRefreshDataFlag] = useState(false)
  const toggleRefreshDataFlag = () => {
    setRefreshDataFlag((prevFlag) => !prevFlag)
  }

  const [isUpdateThumbModalOpen, setIsUpdateThumbModalOpen] = useState(false)
  const openDesignLinksModal = () => {
    setIsUpdateThumbModalOpen(true)
  }

  useEffect(() => {
    setIsLoading(true)

    const api_path = `/api_order/id/${id}`

    axiosPrivate
      .get(api_path)
      .then((response) => {
        // console.log(api_path, ':', response.data)
        setOrder(response.data.order_data)
        setOrderItems(response.data.order_items_data)
        setOrderTrackings(response.data.order_trackings)
        setPicUsername(response.data.pic_username)
        setBatchName(response.data.batch_name)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching OrderDetail', err)
        setOrder('')
        setIsLoading(false)
        if (err.response.status === 404 && err.response.data.detail === 'ID not found') {
          // console.log('inside 404 call')
          navigate('/404')
          return
        }
        navigate('/500')
      })
  }, [id, refreshDataFlag])

  const handleCopy = () => {
    navigator.clipboard
      .writeText(ecomOrderID)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) // Reset the "copied" state after 2 seconds
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error)
      })
  }

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
                  src={getImageURLorNoImg(order.thumb_url)}
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
                  <CCardTitle className="fw-bold fs-3">
                    <span style={{ color: getColorBasedOnDeadline(order.user_deadline_prd) }}>
                      Order #{id}
                    </span>
                    <span className="ms-1" style={{ fontSize: 'medium' }}>
                      {getEcomBadge(order.ecommerce_code)}
                    </span>
                  </CCardTitle>
                  <CCardText>
                    <CRow>
                      <CCol>
                        <div>
                          <b>Platform ID</b>:
                          <CTooltip content="Copied!" visible={copied} trigger={['focus']}>
                            <button
                              onClick={handleCopy}
                              style={{ cursor: 'pointer', border: 'none', background: 'none' }}
                            >
                              <CIcon icon={cilCopy} />
                            </button>
                          </CTooltip>
                          <br className="d-xs-block d-sm-none" />
                          <span>{ecomOrderID}</span>
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
                          <b>BatchFile</b>: <br className="d-xs-block d-sm-none" />
                          {batchName || '-'}
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
                      <CCol xs={'auto'} className="ps-0">
                        <CDropdown style={{ cursor: 'pointer' }}>
                          <CDropdownToggle color="primary" size="sm" />
                          <CDropdownMenu>
                            <CDropdownItem
                              style={{ fontSize: 'small' }}
                              onClick={() => openDesignLinksModal()}
                            >
                              Set Thumbnail
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
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
              <OrderCommentList orderID={id} />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <OrderHistoryList historyList={orderTrackings} />
          </CRow>
        </>
      )}

      <OrderUpdateThumb
        isOpen={isUpdateThumbModalOpen}
        onClose={() => {
          setIsUpdateThumbModalOpen(false)
          toggleRefreshDataFlag()
        }}
        orderData={order}
      />
    </>
  )
}

export default OrderDetail
