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
import { cibWhatsapp, cilFolderOpen, cilCopy, cilPen } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  formatPeriodToString,
  getColorBasedOnDeadline,
  getEcomBadge,
  getEcomOrderID,
  getImageURLorNoImg,
  openWhatsappChat,
  performDownloadFromResponse,
} from 'src/utils'
import useAuth from 'src/hooks/useAuth'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import OrderUpdateThumb from 'src/views/modals/OrderUpdateThumb'
import DocumentCreateInvoiceModal from 'src/views/modals/DocumentCreateInvoiceModal'
import DocumentCreateQuotationModal from 'src/views/modals/DocumentCreateQuotationModal'
import DocumentEditModal from 'src/views/modals/DocumentEditModal'

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
  const [invoiceDocID, setInvoiceDocID] = useState()
  const [quotationDocID, setQuotationDocID] = useState()

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
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false)
  const openCreateInvoiceModal = () => {
    setIsCreateInvoiceModalOpen(true)
  }
  const [isCreateQuotationModalOpen, setIsCreateQuotationModalOpen] = useState(false)
  const openCreateQuotationModal = () => {
    setIsCreateQuotationModalOpen(true)
  }
  const [isEditDocModalOpen, setIsEditDocModalOpen] = useState(false)
  const [docIdSelected, setDocIdSelected] = useState()
  const openEditDocModal = (doc_id) => {
    setDocIdSelected(doc_id)
    setIsEditDocModalOpen(true)
  }

  useEffect(() => {
    setIsLoading(true)

    const api_path = `/api_order/id/${id}`
    const doc_api_path = `/api_docs/inquiry/order_id/${id}`

    axiosPrivate
      .get(doc_api_path)
      .then((response) => {
        setInvoiceDocID(response.data.latest_invoice_id)
        setQuotationDocID(response.data.latest_quote_id)
      })
      .catch((err) => {
        console.error('Error fetching OrderDocs', err)
        setInvoiceDocID(null)
        setQuotationDocID(null)
      })

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
                        {auth.token_role_id === 1 && (
                          <div>
                            <b>Quotation</b>: <br className="d-xs-block d-sm-none" />
                            {quotationDocID ? (
                              <>
                                <CButton
                                  size="sm"
                                  color="dark"
                                  className="me-1"
                                  onClick={() => getDownloadPDF(quotationDocID, 'Quotation')}
                                >
                                  Download
                                </CButton>
                                <CButton
                                  size="sm"
                                  color="warning"
                                  onClick={() => openEditDocModal(quotationDocID)}
                                >
                                  <CIcon icon={cilPen} />
                                </CButton>
                              </>
                            ) : (
                              <CButton
                                size="sm"
                                color="dark"
                                onClick={() => openCreateQuotationModal()}
                              >
                                Create
                              </CButton>
                            )}
                          </div>
                        )}
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
                        {auth.token_role_id === 1 && (
                          <div>
                            <b>Invoice</b>: <br className="d-xs-block d-sm-none" />
                            {invoiceDocID ? (
                              <>
                                <CButton
                                  size="sm"
                                  color="dark"
                                  className="me-1"
                                  onClick={() => getDownloadPDF(invoiceDocID, 'Invoice')}
                                >
                                  Download
                                </CButton>
                                <CButton
                                  size="sm"
                                  color="warning"
                                  onClick={() => openEditDocModal(invoiceDocID)}
                                >
                                  <CIcon icon={cilPen} />
                                </CButton>
                              </>
                            ) : (
                              <CButton
                                size="sm"
                                color="dark"
                                onClick={() => openCreateInvoiceModal()}
                              >
                                Create
                              </CButton>
                            )}
                          </div>
                        )}
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
      <DocumentCreateInvoiceModal
        order_id={id}
        order_items_data={orderItems}
        isOpen={isCreateInvoiceModalOpen}
        onClose={() => {
          setIsCreateInvoiceModalOpen(false)
          toggleRefreshDataFlag()
        }}
      />
      <DocumentCreateQuotationModal
        order_id={id}
        order_items_data={orderItems}
        isOpen={isCreateQuotationModalOpen}
        onClose={() => {
          setIsCreateQuotationModalOpen(false)
          toggleRefreshDataFlag()
        }}
      />
      <DocumentEditModal
        doc_id={docIdSelected}
        isOpen={isEditDocModalOpen}
        onClose={() => {
          setIsEditDocModalOpen(false)
          toggleRefreshDataFlag()
        }}
      />
    </>
  )
}

export default OrderDetail
