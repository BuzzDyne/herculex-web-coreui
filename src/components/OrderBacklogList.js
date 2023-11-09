import {
  CAlert,
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
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import { formatTStoPrettyString, getEcomName, getStatusBadge } from 'src/utils'

const OrderBacklogList = (props) => {
  //props.api_path
  const navigate = useNavigate()

  const [orderList, setOrderList] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [axiosErrMsg, setAxiosErrMsg] = useState('')

  const [isInitialCreateModalVisible, setIsInitialCreateModalVisible] = useState(false)
  const [isInitialEditModalVisible, setIsInitialEditModalVisible] = useState(false)
  const [isPICModalVisible, setIsPICModalVisible] = useState(false)
  const [selectedOrderID, setSelectedOrderID] = useState('')
  const [selectedOrderData, setSelectedOrderData] = useState({})

  const axiosPrivate = useAxiosPrivate()

  const fetchData = () => {
    setIsLoading(true)
    setAxiosErrMsg('')
    axiosPrivate
      .get(props.api_path)
      .then((response) => {
        console.log(props.api_path, ':', response.data)
        setOrderList(response.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching order list', err)
        setAxiosErrMsg(err.message)
        setOrderList([])
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleGoToOrderDetail = (orderId) => {
    navigate(`/order_detail/${orderId}`)
  }

  const openOrderInitialDataCreateModal = (orderID) => {
    setSelectedOrderID(orderID)
    setIsInitialCreateModalVisible(true)
  }

  const openOrderInitialDataEditModal = (orderData) => {
    setSelectedOrderData(orderData)
    setIsInitialEditModalVisible(true)
  }

  const openPICModal = (orderData) => {
    setSelectedOrderData(orderData)
    setIsPICModalVisible(true)
  }

  return (
    <>
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
              {orderList.map((data) => (
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
                    {data.order.user_deadline_prd
                      ? `${data.order.user_deadline_prd.slice(
                          0,
                          4,
                        )}/${data.order.user_deadline_prd.slice(
                          4,
                          6,
                        )}/${data.order.user_deadline_prd.slice(6)}`
                      : '-'}
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
                        <CDropdownItem onClick={() => openPICModal(data.order)}>
                          Set PIC
                        </CDropdownItem>
                        <CDropdownDivider />
                        {data.order.user_deadline_prd ? (
                          // Render this menu if user_deadline_prd is not null or empty
                          <CDropdownItem onClick={() => openOrderInitialDataEditModal(data.order)}>
                            Edit Initial Data
                          </CDropdownItem>
                        ) : (
                          // Render this menu if user_deadline_prd is null or empty
                          <CDropdownItem
                            onClick={() => openOrderInitialDataCreateModal(data.order.id)}
                          >
                            Input Initial Data
                          </CDropdownItem>
                        )}
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCol>
      )}
    </>
  )
}

export default OrderBacklogList
