import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
} from '@coreui/react'
import React, { useState } from 'react'
import OrderBacklogList from 'src/components/OrderBacklogList'
import OrderPICManage from '../modals/OrderPICManage'
import OrderInitialDataCreate from '../modals/OrderInitialDataCreate'
import OrderPICToMe from '../modals/OrderPICToMe'

const data = [
  {
    id: 1,
    imageUrl: 'https://placehold.co/200',
    title: 'Card 1',
    text: 'Some quick example text for Card 1',
  },
  {
    id: 2,
    imageUrl: 'https://placehold.co/200',
    title: 'Card 2',
    text: 'Some quick example text for Card 2',
  },
  {
    id: 3,
    imageUrl: 'https://placehold.co/200',
    title: 'Card 3',
    text: 'Some quick example text for Card 3',
  },
  {
    id: 4,
    imageUrl: 'https://placehold.co/200',
    title: 'Card 4',
    text: 'Some quick example text for Card 4',
  },
  {
    id: 5,
    imageUrl: 'https://placehold.co/200',
    title: 'Card 5',
    text: 'Some quick example text for Card 5',
  },
]

function DashboardAdmin() {
  const [refreshDataFlag, setRefreshDataFlag] = useState(false)

  const toggleRefreshDataFlag = () => {
    setRefreshDataFlag((prevFlag) => !prevFlag)
  }

  // Modals
  const [selectedOrderData, setSelectedOrderData] = useState({})
  const [isPICModalVisible, setIsPICModalVisible] = useState(false)
  const openPICModal = (orderData) => {
    setSelectedOrderData(orderData)
    setIsPICModalVisible(true)
  }

  const [selectedOrderID, setSelectedOrderID] = useState('')
  const [isInitialCreateModalVisible, setIsInitialCreateModalVisible] = useState(false)
  const openOrderInitialDataCreateModal = (orderID) => {
    setSelectedOrderID(orderID)
    setIsInitialCreateModalVisible(true)
  }

  return (
    <>
      <CCard className="text-center mb-4">
        <CCardHeader>
          <h5 className="mb-0">My Tasks</h5>
        </CCardHeader>
        <CCardBody>
          <CRow xs={{ gutter: 2 }}>
            {data.map((card) => (
              <CCol key={card.id} xs="6" sm="4" md="3" xl="2">
                <CCard>
                  <CCardImage orientation="top" src={card.imageUrl} />
                  <CCardBody className="p-2">
                    <CCardTitle>Order #{card.id}</CCardTitle>
                    <CCardText>{card.text}</CCardText>
                    <CButton href="#" size="sm">
                      Submit Design
                    </CButton>
                    <br />
                    <CButton href="#" size="sm" color="link">
                      See Details
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        </CCardBody>
      </CCard>
      <CCard className="text-center">
        <CCardHeader>
          <h5 className="mb-0">Task List (Admin)</h5>
        </CCardHeader>
        <CCardBody>
          <OrderBacklogList
            api_path="/api_order/get_orders_by_status?status=admin"
            isAdmin={true}
            refreshDataFlag={refreshDataFlag}
            openPICModal={openPICModal}
            openOrderInitialDataCreateModal={openOrderInitialDataCreateModal}
          />
        </CCardBody>
      </CCard>

      <OrderPICManage
        isOpen={isPICModalVisible}
        onClose={() => {
          setIsPICModalVisible(false)
          toggleRefreshDataFlag()
        }}
        orderData={selectedOrderData}
      />
      <OrderInitialDataCreate
        isOpen={isInitialCreateModalVisible}
        onClose={() => {
          setIsInitialCreateModalVisible(false)
          toggleRefreshDataFlag()
        }}
        orderID={selectedOrderID}
      />
    </>
  )
}

export default DashboardAdmin
