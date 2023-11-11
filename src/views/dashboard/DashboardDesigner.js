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
  // Add more data as needed
]

function DashboardDesigner() {
  const [refreshDataFlag, setRefreshDataFlag] = useState(false)

  const toggleRefreshDataFlag = () => {
    setRefreshDataFlag((prevFlag) => !prevFlag)
  }

  const [selectedOrderData, setSelectedOrderData] = useState({})
  const [isPICToMeModalVisible, setIsPICToMeModalVisible] = useState(false)
  const openPICToMeModal = (orderData) => {
    setSelectedOrderData(orderData)
    setIsPICToMeModalVisible(true)
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
                    <CCardTitle>Order #123</CCardTitle>
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
          <h5 className="mb-0">Task List (Designer)</h5>
        </CCardHeader>
        <CCardBody>
          <OrderBacklogList
            api_path="/api_order/get_orders_by_status?status=100"
            isAdmin={false}
            refreshDataFlag={refreshDataFlag}
            openPICToMeModal={openPICToMeModal}
          />
        </CCardBody>
      </CCard>
      <OrderPICToMe
        isOpen={isPICToMeModalVisible}
        onClose={() => {
          setIsPICToMeModalVisible(false)
          toggleRefreshDataFlag()
        }}
        orderData={selectedOrderData}
      />
    </>
  )
}

export default DashboardDesigner
