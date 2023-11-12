import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROLE_NAMES } from 'src/constant'
import {
  formatTStoPrettyString,
  getEcomName,
  getStatusBadge,
  formatPeriodToString,
} from 'src/utils'

const OrderBacklogList = ({
  roleID,
  isLoading,
  orderList,
  openPICModal,
  openOrderInitialDataCreateModal,
  openPICToMeModal,
}) => {
  const navigate = useNavigate()

  const dataToRender = orderList || []
  const filteredOrders = dataToRender.filter((data) => data.order.pic_user_id === null)

  const handleGoToOrderDetail = (orderId) => {
    navigate(`/order_detail/${orderId}`)
  }

  return (
    <>
      <CCard className="text-center">
        <CCardHeader>
          <h5 className="mb-0">Task List ({ROLE_NAMES[roleID]})</h5>
        </CCardHeader>
        <CCardBody>
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
                      ID
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">
                      Platform
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">
                      Deadline
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">
                      Status
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">
                      PIC
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">
                      Last Updated
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" scope="col">
                      Action
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredOrders.map((data) => (
                    <CTableRow key={data.order.id}>
                      <CTableHeaderCell className="text-center" scope="row">
                        <span
                          onClick={() => handleGoToOrderDetail(data.order.id)}
                          style={{
                            cursor: 'pointer',
                            color: 'blue',
                            textDecoration: 'underline',
                          }}
                        >
                          {data.order.id}
                        </span>
                      </CTableHeaderCell>
                      <CTableDataCell className="text-center">
                        {getEcomName(data.order.ecommerce_code)}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {formatPeriodToString(data.order.user_deadline_prd)}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {getStatusBadge(data.order.internal_status_id)}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {data.pic_username || '-'}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {formatTStoPrettyString(data.order.last_updated_ts)}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CDropdown style={{ cursor: 'pointer' }}>
                          <CDropdownToggle color="light" />
                          <CDropdownMenu>
                            {roleID === 1 && data.order.internal_status_id === '000' && (
                              <>
                                <CDropdownItem
                                  onClick={() => openOrderInitialDataCreateModal(data.order.id)}
                                >
                                  Input Initial Data
                                </CDropdownItem>
                                <CDropdownDivider />
                              </>
                            )}

                            <CDropdownItem onClick={() => openPICToMeModal(data.order)}>
                              Assign to me
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
        </CCardBody>
      </CCard>
    </>
  )
}

export default OrderBacklogList
