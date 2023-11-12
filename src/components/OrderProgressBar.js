import React from 'react'
import { CCol, CProgress, CProgressStacked, CRow } from '@coreui/react'
import { formatTStoPrettyString } from 'src/utils'

const CustomStackedProgressBar = ({ orderData }) => {
  const renderCProgress = (order_status) => {
    switch (order_status) {
      case '100':
        return (
          <>
            <CProgress value={20} variant="striped" animated color="info" />
          </>
        )

      case '200':
        return (
          <>
            <CProgress value={20} color="info" />
            <CProgress value={20} variant="striped" animated color="danger" />
          </>
        )

      case '300':
        return (
          <>
            <CProgress value={20} color="info" />
            <CProgress value={20} color="danger" />
            <CProgress value={20} variant="striped" animated color="warning" />
          </>
        )

      case '400':
        return (
          <>
            <CProgress value={20} color="info" />
            <CProgress value={20} color="danger" />
            <CProgress value={20} color="warning" />
            <CProgress value={20} variant="striped" animated color="primary" />
          </>
        )

      case '999':
        return (
          <>
            <CProgress value={20} color="info" />
            <CProgress value={20} color="danger" />
            <CProgress value={20} color="warning" />
            <CProgress value={20} color="primary" />
            <CProgress value={20} color="success" />
          </>
        )

      default:
        return <></>
    }
  }

  return (
    <>
      <CRow className="mx-1">
        <CCol className="text-center p-0">
          <span className="d-none d-md-block">
            {formatTStoPrettyString(orderData.design_sub_dt)}
          </span>
          <b>Design</b>
        </CCol>
        <CCol className="p-0" />
        <CCol className="text-center p-0">
          <span className="d-none d-md-block">
            {formatTStoPrettyString(orderData.print_done_dt)}
          </span>
          <b>Printing</b>
        </CCol>
        <CCol className="p-0" />
        <CCol className="text-center p-0">
          <span className="d-none d-md-block">
            {formatTStoPrettyString(orderData.packing_done_dt)}
          </span>
          <b>Complete</b>
        </CCol>
      </CRow>
      <CProgressStacked>{renderCProgress(orderData.internal_status_id)}</CProgressStacked>
      <CRow className="">
        <CCol className="p-0" />
        <CCol className="text-center p-0">
          <b>Approval</b>
          <span className="d-none d-md-block">
            {formatTStoPrettyString(orderData.design_acc_dt)}
          </span>
        </CCol>
        <CCol className="p-0" />
        <CCol className="text-center p-0">
          <b>Packing</b>
          <span className="d-none d-md-block">
            {formatTStoPrettyString(orderData.packing_done_dt)}
          </span>
        </CCol>
        <CCol className="p-0" />
      </CRow>
    </>
  )
}

export default CustomStackedProgressBar
