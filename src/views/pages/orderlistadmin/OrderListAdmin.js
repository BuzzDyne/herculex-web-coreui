import React, { useEffect, useState } from 'react'

import {
  CAlert,
  CBadge,
  CButton,
  CButtonGroup,
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
  CTooltip,
} from '@coreui/react'
import { cilPlus, cilPencil } from '@coreui/icons'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { INTERNAL_ORDER_STATUS } from '../../../constant'

const OrderListAdmin = () => {
  const filterOptions = [
    { name: 'All Orders', api_path: '/api_order/get_all_orders' },
    { name: 'Last 3 Month', api_path: '/api_order/last_3_months' },
    { name: 'DIVIDER', api_path: '' },
    { name: 'New Order', api_path: '/api_order/get_orders_by_status?status=000' },
    { name: 'Waiting Design', api_path: '/api_order/get_orders_by_status?status=100' },
    { name: 'Pending Approval', api_path: '/api_order/get_orders_by_status?status=200' },
    { name: 'Printing', api_path: '/api_order/get_orders_by_status?status=300' },
    { name: 'Packing', api_path: '/api_order/get_orders_by_status?status=400' },
    { name: 'Complete', api_path: '/api_order/get_orders_by_status?status=999' },
  ]

  const { id } = useParams()
  const [orderListAdmin, setOrderListAdmin] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[1])

  const [isLoading, setIsLoading] = useState(false)
  const [axiosErrMsg, setAxiosErrMsg] = useState('')

  const axiosPrivate = useAxiosPrivate()

  const fetchData = () => {
    setIsLoading(true)
    setAxiosErrMsg('')
    axiosPrivate
      .get(selectedFilter.api_path)
      .then((response) => {
        console.log(selectedFilter.name, ':', response.data)
        setOrderListAdmin(response.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching order list', err)
        setAxiosErrMsg(err.message)
        setOrderListAdmin([])
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [selectedFilter])

  const getEcomName = (ecommerce_code) => {
    switch (ecommerce_code) {
      case 'T':
        return 'Tokopedia'
      case 'S':
        return 'Shopee'
      default:
        return ecommerce_code
    }
  }

  const getStatusBadge = (internal_order_status) => {
    const statusInfo = INTERNAL_ORDER_STATUS[internal_order_status]

    if (statusInfo) {
      const { name, colorname } = statusInfo
      return (
        <CBadge size="lg" color={colorname}>
          {name}
        </CBadge>
      )
    } else {
      return (
        <CBadge size="lg" color="secondary">
          Unknown
        </CBadge>
      )
    }
  }

  const formatTimestamp = (timestamp) => {
    if (timestamp === null) {
      return '-'
    }
    const now = new Date(Date.now())
    const tsDate = new Date(timestamp)
    const timeDifference = now - tsDate
    const minutes = Math.floor(timeDifference / (1000 * 60))
    const hours = Math.floor(timeDifference / (1000 * 60 * 60))
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else if (days < 30) {
      return `${days}d ago`
    } else {
      return '>1 month ago'
    }
  }

  const handleFilterChange = (filter) => {
    if (filter.name !== selectedFilter.name) {
      setIsLoading(true)
      setSelectedFilter(filter)
    }
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center justify-content-between">
            <CCol xs="auto">
              <h5 style={{ marginBottom: 0 }}> Order List</h5>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CRow className="align-items-center justify-content-between" xs={{ gutterY: 2 }}>
            <CCol xs="auto">
              <CButtonGroup>
                <CDropdown variant="btn-group">
                  <CDropdownToggle color="primary">
                    Active Filter: {selectedFilter.name}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    {filterOptions.map((filter, index) =>
                      filter.name === 'DIVIDER' ? (
                        <CDropdownDivider key={index} />
                      ) : (
                        <CDropdownItem
                          key={index}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleFilterChange(filter)}
                        >
                          {filter.name}
                        </CDropdownItem>
                      ),
                    )}
                  </CDropdownMenu>
                </CDropdown>
              </CButtonGroup>
            </CCol>
            <CCol xs="2" className="text-end">
              <CButton color="success">
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
                <CTable
                  style={{ minHeight: '200px' }}
                  striped
                  small
                  hover
                  responsive
                  align="middle"
                >
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
                    {orderListAdmin.map((data) => (
                      <CTableRow key={data.order.id}>
                        <CTableHeaderCell className="text-center" scope="row">
                          {data.order.id}
                        </CTableHeaderCell>
                        <CTableDataCell className="text-center">
                          {getEcomName(data.order.ecommerce_code)}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {data.order.user_deadline_prd || '-'}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {getStatusBadge(data.order.internal_status_id)}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {data.pic_username || '-'}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {formatTimestamp(data.order.last_updated_ts)}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CDropdown>
                            <CDropdownToggle color="secondary" />
                            <CDropdownMenu>
                              <CDropdownItem style={{ cursor: 'pointer' }}>
                                Input Initial Data
                              </CDropdownItem>
                              <CDropdownItem style={{ cursor: 'pointer' }}>Set PIC</CDropdownItem>
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
    </>
  )
}

export default OrderListAdmin
