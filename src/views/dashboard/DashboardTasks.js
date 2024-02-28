import React, { useEffect, useState } from 'react'
import { CAlert, CCol } from '@coreui/react'
import OrderBacklogList from 'src/components/OrderBacklogList'
import { ROLE_DASHBOARD_API_MAPPING } from 'src/constant'
import OrderPICManage from '../modals/OrderPICManage'
import OrderInitialDataCreate from '../modals/OrderInitialDataCreate'
import OrderPICToMe from '../modals/OrderPICToMe'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import MyTaskList from 'src/components/MyTaskList'
import OrderSubmitDesign from '../modals/OrderSubmitDesign'
import OrderApproveDesign from '../modals/OrderApproveDesign'
import OrderDonePrinting from '../modals/OrderDonePrinting'
import OrderDonePacking from '../modals/OrderDonePacking'
import OrderRejectDesign from '../modals/OrderRejectDesign'
import ImageViewModal from '../modals/ImageViewModal'
import OrderToBatchFileList from 'src/components/OrderToBatchFileList'
import useAuth from 'src/hooks/useAuth'
import OrderBatchList from 'src/components/OrderBatchList'

const DashboardTasks = ({ roleID }) => {
  const { auth } = useAuth()
  const [orderList, setOrderList] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [axiosErrMsg, setAxiosErrMsg] = useState('')

  const [refreshDataFlag, setRefreshDataFlag] = useState(false)
  const toggleRefreshDataFlag = () => {
    setRefreshDataFlag((prevFlag) => !prevFlag)
  }

  const axiosPrivate = useAxiosPrivate()

  // Modals
  const [selectedOrderData, setSelectedOrderData] = useState({})
  const [isPICModalVisible, setIsPICModalVisible] = useState(false)
  const openPICModal = (orderData) => {
    setSelectedOrderData(orderData)
    setIsPICModalVisible(true)
  }

  const [isImageViewModalVisible, setIsImageViewModalVisible] = useState(false)
  const openImageViewModal = (orderData) => {
    setSelectedOrderData(orderData)
    setIsImageViewModalVisible(true)
  }

  const [isPICToMeModalVisible, setIsPICToMeModalVisible] = useState(false)
  const openPICToMeModal = (orderData) => {
    setSelectedOrderData(orderData)
    setIsPICToMeModalVisible(true)
  }

  const [isDesignLinksModalVisible, setIsDesignLinksModalVisible] = useState(false)
  const openDesignLinksModal = (orderData) => {
    setSelectedOrderData(orderData)
    setIsDesignLinksModalVisible(true)
  }

  const [isApproveDesignModalVisible, setIsApproveDesignModalVisible] = useState(false)
  const openApproveDesignModal = (orderData) => {
    setSelectedOrderData(orderData)
    setIsApproveDesignModalVisible(true)
  }

  const [isRejectDesignModalVisible, setIsRejectDesignModalVisible] = useState(false)
  const openRejectDesignModal = (orderData) => {
    setSelectedOrderData(orderData)
    setIsRejectDesignModalVisible(true)
  }

  const [isDonePrintingModalVisible, setIsDonePrintingModalVisible] = useState(false)
  const openDonePrintingModal = (orderData) => {
    setSelectedOrderData(orderData)
    setIsDonePrintingModalVisible(true)
  }

  const [isDonePackingModalVisible, setIsDonePackingModalVisible] = useState(false)
  const openDonePackingModal = (orderData) => {
    setSelectedOrderData(orderData)
    setIsDonePackingModalVisible(true)
  }

  const [selectedOrderID, setSelectedOrderID] = useState('')
  const [isInitialCreateModalVisible, setIsInitialCreateModalVisible] = useState(false)
  const openOrderInitialDataCreateModal = (orderID) => {
    setSelectedOrderID(orderID)
    setIsInitialCreateModalVisible(true)
  }

  const fetchData = () => {
    setIsLoading(true)
    setAxiosErrMsg('')

    const apiPath = ROLE_DASHBOARD_API_MAPPING[roleID]

    axiosPrivate
      .get(apiPath)
      .then((response) => {
        // console.log(apiPath, ':', response.data)
        setOrderList(response.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching task data', err)
        setAxiosErrMsg(err.message)
        setOrderList([])
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [refreshDataFlag])

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

      {auth.token_role_id === 1 && (
        <>
          <MyTaskList
            isLoading={isLoading}
            orderList={orderList}
            openOrderInitialDataCreateModal={openOrderInitialDataCreateModal}
            openDesignLinksModal={openDesignLinksModal}
            openApproveDesignModal={openApproveDesignModal}
            openRejectDesignModal={openRejectDesignModal}
            openDonePrintingModal={openDonePrintingModal}
            openDonePackingModal={openDonePackingModal}
          />
          <OrderBacklogList
            roleID={roleID}
            isLoading={isLoading}
            orderList={orderList}
            openPICModal={openPICModal}
            openOrderInitialDataCreateModal={openOrderInitialDataCreateModal}
            openPICToMeModal={openPICToMeModal}
            openImageViewModal={openImageViewModal}
          />
        </>
      )}

      {auth.token_role_id === 2 && (
        <>
          <OrderToBatchFileList />
          <MyTaskList
            isLoading={isLoading}
            orderList={orderList}
            openOrderInitialDataCreateModal={openOrderInitialDataCreateModal}
            openDesignLinksModal={openDesignLinksModal}
            openApproveDesignModal={openApproveDesignModal}
            openRejectDesignModal={openRejectDesignModal}
            openDonePrintingModal={openDonePrintingModal}
            openDonePackingModal={openDonePackingModal}
          />
        </>
      )}

      {auth.token_role_id === 3 && <OrderBatchList compType="packer" />}

      {auth.token_role_id === 4 && (
        <>
          <MyTaskList
            isLoading={isLoading}
            orderList={orderList}
            openOrderInitialDataCreateModal={openOrderInitialDataCreateModal}
            openDesignLinksModal={openDesignLinksModal}
            openApproveDesignModal={openApproveDesignModal}
            openRejectDesignModal={openRejectDesignModal}
            openDonePrintingModal={openDonePrintingModal}
            openDonePackingModal={openDonePackingModal}
          />
          <OrderBacklogList
            roleID={roleID}
            isLoading={isLoading}
            orderList={orderList}
            openPICModal={openPICModal}
            openOrderInitialDataCreateModal={openOrderInitialDataCreateModal}
            openPICToMeModal={openPICToMeModal}
            openImageViewModal={openImageViewModal}
          />
        </>
      )}

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

      <OrderPICToMe
        isOpen={isPICToMeModalVisible}
        onClose={() => {
          setIsPICToMeModalVisible(false)
          toggleRefreshDataFlag()
        }}
        orderData={selectedOrderData}
      />

      <OrderSubmitDesign
        isOpen={isDesignLinksModalVisible}
        onClose={() => {
          setIsDesignLinksModalVisible(false)
          toggleRefreshDataFlag()
        }}
        orderData={selectedOrderData}
      />

      <OrderApproveDesign
        isOpen={isApproveDesignModalVisible}
        onClose={() => {
          setIsApproveDesignModalVisible(false)
          toggleRefreshDataFlag()
        }}
        orderData={selectedOrderData}
      />

      <OrderRejectDesign
        isOpen={isRejectDesignModalVisible}
        onClose={() => {
          setIsRejectDesignModalVisible(false)
          toggleRefreshDataFlag()
        }}
        orderData={selectedOrderData}
      />

      <OrderDonePrinting
        isOpen={isDonePrintingModalVisible}
        onClose={() => {
          setIsDonePrintingModalVisible(false)
          toggleRefreshDataFlag()
        }}
        orderData={selectedOrderData}
      />

      <OrderDonePacking
        isOpen={isDonePackingModalVisible}
        onClose={() => {
          setIsDonePackingModalVisible(false)
          toggleRefreshDataFlag()
        }}
        orderData={selectedOrderData}
      />

      <ImageViewModal
        isOpen={isImageViewModalVisible}
        onClose={() => {
          setIsImageViewModalVisible(false)
        }}
        orderData={selectedOrderData}
      />
    </>
  )
}

export default DashboardTasks
