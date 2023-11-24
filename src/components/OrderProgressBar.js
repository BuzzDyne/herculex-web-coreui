import React from 'react'
import { CCol, CProgress, CProgressStacked, CRow } from '@coreui/react'
import { formatTStoPrettyString } from 'src/utils'

const CustomStackedProgressBar = ({ orderData }) => {
  const renderCProgress = (order_status) => {
    switch (order_status) {
      case '100': // Design
        return (
          <>
            <CProgress value={100 / 6} variant="striped" animated color="info" />
          </>
        )

      case '200': // Approval
        return (
          <>
            <CProgress value={100 / 6} color="info" />
            <CProgress value={100 / 6} variant="striped" animated color="danger" />
          </>
        )

      case '250': // BatchFile
        return (
          <>
            <CProgress value={100 / 6} color="info" />
            <CProgress value={100 / 6} color="danger" />
            <CProgress value={100 / 6} variant="striped" animated color="dark" />
          </>
        )

      case '300': // Printing
        return (
          <>
            <CProgress value={100 / 6} color="info" />
            <CProgress value={100 / 6} color="danger" />
            <CProgress value={100 / 6} color="dark" />
            <CProgress value={100 / 6} variant="striped" animated color="warning" />
          </>
        )

      case '400': // Packing
        return (
          <>
            <CProgress value={100 / 6} color="info" />
            <CProgress value={100 / 6} color="danger" />
            <CProgress value={100 / 6} color="dark" />
            <CProgress value={100 / 6} color="warning" />
            <CProgress value={100 / 6} variant="striped" animated color="primary" />
          </>
        )

      case '999': // Complete
        return (
          <>
            <CProgress value={100 / 6} color="info" />
            <CProgress value={100 / 6} color="danger" />
            <CProgress value={100 / 6} color="dark" />
            <CProgress value={100 / 6} color="warning" />
            <CProgress value={100 / 6} color="primary" />
            <CProgress value={100 / 6} color="success" />
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
            {formatTStoPrettyString(orderData.batch_done_dt)}
          </span>
          <b>BatchFile</b>
        </CCol>
        <CCol className="p-0" />
        <CCol className="text-center p-0">
          <span className="d-none d-md-block">
            {formatTStoPrettyString(orderData.packing_done_dt)}
          </span>
          <b>Packing</b>
        </CCol>
        <CCol className="p-0" />
      </CRow>
      <CProgressStacked>{renderCProgress(orderData.internal_status_id)}</CProgressStacked>
      <CRow className="mx-1">
        <CCol className="p-0" />
        <CCol className="text-center p-0">
          <b>Approval</b>
          <span className="d-none d-md-block">
            {formatTStoPrettyString(orderData.design_acc_dt)}
          </span>
        </CCol>
        <CCol className="p-0" />
        <CCol className="text-center p-0">
          <b>Printing</b>
          <span className="d-none d-md-block">
            {formatTStoPrettyString(orderData.print_done_dt)}
          </span>
        </CCol>
        <CCol className="p-0" />
        <CCol className="text-center p-0">
          <b>Done</b>
          <span className="d-none d-md-block">
            {formatTStoPrettyString(orderData.packing_done_dt)}
          </span>
        </CCol>
      </CRow>
    </>
  )
}

export default CustomStackedProgressBar
