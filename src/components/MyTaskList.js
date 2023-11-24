import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CPlaceholder,
  CRow,
} from '@coreui/react'
import { cibWhatsapp, cilFolderOpen } from '@coreui/icons'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { INTERNAL_ORDER_STATUS } from 'src/constant'
import useAuth from 'src/hooks/useAuth'
import { getStatusBadge, formatPeriodToString, openWhatsappChat } from 'src/utils'

const MyTaskList = ({
  isLoading,
  orderList,
  openOrderInitialDataCreateModal,
  openDesignLinksModal,
  openApproveDesignModal,
  openRejectDesignModal,
  openDonePrintingModal,
  openDonePackingModal,
}) => {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const dataToRender = orderList || []

  const filteredOrders = dataToRender.filter(
    (data) => data.order.pic_user_id === auth.token_user_id,
  )

  const handleGoToOrderDetail = (orderId) => {
    navigate(`/order_detail/${orderId}`)
  }

  const renderPlaceholderCard = (index) => (
    <CCol key={index} xs="6" sm="4" md="3" xl="2">
      <CCard>
        <CCardImage
          component="svg"
          orientation="top"
          width="100%"
          height="162"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Placeholder"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <title>Placeholder</title>
          <rect width="100%" height="100%" fill="#868e96"></rect>
        </CCardImage>
        <CCardBody className="p-2">
          <CPlaceholder component={CCardTitle} animation="wave" xs={12}>
            <CPlaceholder xs={6} />
          </CPlaceholder>
          <CPlaceholder component={CCardText} animation="wave">
            <CPlaceholder xs={4} />
            {' | '}
            <CPlaceholder xs={4} />
            <CPlaceholder xs={8} />
          </CPlaceholder>
          <CPlaceholder component={CButton} disabled tabIndex={-1} xs={12}></CPlaceholder>
          <br />
          <CPlaceholder component={CCardText} animation="wave">
            <CPlaceholder xs={4} />{' '}
          </CPlaceholder>
        </CCardBody>
      </CCard>
    </CCol>
  )

  const handleProcessButtonClick = (order) => {
    const internalStatusId = order.internal_status_id

    switch (internalStatusId) {
      case '000':
        openOrderInitialDataCreateModal(order.id)
        break
      case '100':
        openDesignLinksModal(order)
        break
      case '200':
        openApproveDesignModal(order)
        break
      case '300':
        openDonePrintingModal(order)
        break
      case '400':
        openDonePackingModal(order)
        break
      default:
        // Default logic or handle other internal statuses
        console.log('Processing order with unknown internal status', order)
    }
  }

  return (
    <CCard className="text-center mb-4">
      <CCardHeader>
        <h5 className="mb-0">My Tasks</h5>
      </CCardHeader>
      <CCardBody>
        {isLoading ? (
          <CRow xs={{ gutter: 2 }} className="justify-content-center">
            {[...Array(3)].map((_, index) => renderPlaceholderCard(index))}
          </CRow>
        ) : (
          <>
            {filteredOrders.length === 0 ? (
              <p className="text-medium-emphasis text-center">You don't have any ongoing tasks.</p>
            ) : (
              <CRow xs={{ gutter: 2 }} className="justify-content-center">
                {filteredOrders.map((data) => (
                  <CCol key={data.order.id} xs="10" sm="4" md="3" xl="2">
                    <CCard className="h-100">
                      {data.order.thumb_url && (
                        <CCardImage orientation="top" src={data.order.thumb_url} />
                      )}
                      <CCardBody
                        className={`d-flex flex-column align-items-center ${
                          data.order.thumb_url ? 'pt-1' : ''
                        }`}
                      >
                        <CCardTitle className="mt-1 flex-grow-1 d-flex align-items-center">
                          <span
                            onClick={() => handleGoToOrderDetail(data.order.id)}
                            style={{
                              cursor: 'pointer',
                            }}
                          >
                            Order #{data.order.id}
                          </span>
                        </CCardTitle>
                        <CCardText className="text-center mb-1">
                          {getStatusBadge(data.order.internal_status_id)}
                          <br />
                          <p className="mb-0">
                            {formatPeriodToString(data.order.user_deadline_prd)}
                          </p>
                        </CCardText>
                        <CRow xs={{ gutter: 1 }} className="mb-1 w-100">
                          {data.order.internal_status_id === '200' && (
                            <CButton
                              size="sm"
                              color="danger"
                              style={{ color: 'white' }}
                              onClick={() => openRejectDesignModal(data.order)}
                            >
                              Reject Design
                            </CButton>
                          )}
                          <CButton size="sm" onClick={() => handleProcessButtonClick(data.order)}>
                            {INTERNAL_ORDER_STATUS[data.order.internal_status_id]['buttonText']}
                          </CButton>
                        </CRow>
                        <CRow xs={{ gutter: 0 }} className="mb-1 px-0 w-100">
                          {auth.token_role_id === 1 && (
                            <CCol>
                              <CButton
                                className="w-100"
                                xs="1"
                                size="sm"
                                color={data.order.cust_phone_no ? 'success' : 'secondary'}
                                disabled={!data.order.cust_phone_no}
                                onClick={() => {
                                  openWhatsappChat(data.order.cust_phone_no)
                                }}
                              >
                                <CIcon icon={cibWhatsapp} />
                              </CButton>
                            </CCol>
                          )}

                          {data.order.google_folder_url && (
                            <CCol className={auth.token_role_id === 1 ? 'ms-1' : ''}>
                              <CButton
                                className="w-100"
                                xs="1"
                                size="sm"
                                color={data.order.google_folder_url ? 'info' : 'secondary'}
                                disabled={!data.order.google_folder_url}
                                onClick={() => {
                                  window.open(data.order.google_folder_url, '_blank')
                                }}
                              >
                                <CIcon icon={cilFolderOpen} />
                              </CButton>
                            </CCol>
                          )}
                        </CRow>

                        <CRow>
                          <CButton
                            size="sm"
                            color="link"
                            onClick={() => handleGoToOrderDetail(data.order.id)}
                          >
                            See Details
                          </CButton>
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            )}
          </>
        )}
      </CCardBody>
    </CCard>
  )
}

export default MyTaskList
