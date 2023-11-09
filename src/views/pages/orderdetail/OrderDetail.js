import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CImage,
  CProgress,
  CProgressBar,
  CProgressStacked,
  CRow,
} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import OrderCommentList from 'src/components/OrderCommentList'
import OrderDetailListItem from 'src/components/OrderDetailListItem'
import OrderHistoryList from 'src/components/OrderHistoryList'
import CustomStackedProgressBar from 'src/components/OrderProgressBar'
import { cibWhatsapp, cilFolderOpen } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const OrderDetail = () => {
  const { id } = useParams()

  const [isLoading, setIsLoading] = useState(false)
  const [axiosErrMsg, setAxiosErrMsg] = useState('')

  return (
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
              src="https://placehold.co/400x350"
              style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
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
                      Shopee
                    </div>
                    <div>
                      <b>Phone</b>: <br className="d-xs-block d-sm-none" />
                      08151023912
                    </div>
                    <div>
                      <b>Deadline</b>: <br className="d-xs-block d-sm-none" />
                      2023/10/31
                    </div>
                  </CCol>
                  <CCol>
                    <div>
                      <b>Last Activity</b>: <br className="d-xs-block d-sm-none" />
                      2023-10-31 21:00
                    </div>
                    <div>
                      <b>Deadline</b>: <br className="d-xs-block d-sm-none" />
                      2023/10/31
                    </div>
                    <div>
                      <b>Current PIC</b>: <br className="d-xs-block d-sm-none" />
                      ricky <Link>Assign to me</Link> <Link>Set PIC</Link>
                    </div>
                  </CCol>
                </CRow>
              </CCardText>
              <CCardText>
                <CRow className="justify-content-start">
                  <CCol>
                    <CButton type="button" color="success" size="sm">
                      <CIcon icon={cibWhatsapp} />
                    </CButton>
                    <CButton type="button" color="info" size="sm" className="ms-2">
                      <CIcon icon={cilFolderOpen} />
                    </CButton>
                    <CButton type="button" color="primary" size="sm" className="ms-2">
                      Submit Design
                    </CButton>
                  </CCol>
                  {/* <CCol className="text-end align-self-end">
                    <small className="text-medium-emphasis">Last updated 3 mins ago</small>
                  </CCol> */}
                </CRow>
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow className="mb-3">
        <CCol xs="12">
          <CustomStackedProgressBar statusName="Packing"></CustomStackedProgressBar>
        </CCol>
      </CRow>
      <CRow xs={{ gutterX: 1 }}>
        <CCol xs="12" md="6" className="mb-3">
          <CCard style={{ height: '100%' }}>
            <CCardBody className="py-2">
              <h5>Items</h5>
              <CCol>
                <OrderDetailListItem />
                <OrderDetailListItem />
                <OrderDetailListItem />
              </CCol>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs="12" md="6" className="mb-3">
          <OrderCommentList />
        </CCol>
      </CRow>
      <CRow className="mb-3">
        <OrderHistoryList />
      </CRow>
    </>
  )
}

export default OrderDetail
