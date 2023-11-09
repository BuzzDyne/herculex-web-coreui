import React from 'react'
import { CCol, CProgress, CProgressStacked, CRow } from '@coreui/react'
import { INTERNAL_ORDER_STATUS } from 'src/constant'

const CustomStackedProgressBar = ({ statusName }) => {
  const calculateProgress = (name) => {
    switch (name) {
      case 'New Order':
        return 0
      case 'Waiting Design':
        return 20
      case 'Pending Approval':
        return 40
      case 'Printing':
        return 60
      case 'Packing':
        return 80
      case 'Complete':
        return 100
      default:
        return 0
    }
  }

  const progress = calculateProgress(statusName)

  return (
    <>
      <CRow className="mx-1">
        <CCol className="text-center">
          <span className="d-none d-md-block">2023-10-12 14:30</span>
          <b>Design</b>
        </CCol>
        <CCol />
        <CCol className="text-center">
          <span className="d-none d-md-block">2023-10-12 14:30</span>
          <b>Printing</b>
        </CCol>
        <CCol />
        <CCol className="text-center">
          <span className="d-none d-md-block">2023-10-12 14:30</span>
          <b>Complete</b>
        </CCol>
      </CRow>
      <CProgressStacked>
        <CProgress value={20} variant="striped" animated color="info" />
        <CProgress value={20} variant="striped" animated color="danger" />
        <CProgress value={20} variant="striped" animated color="warning" />
        <CProgress value={20} variant="striped" animated color="primary" />
        <CProgress value={20} variant="striped" animated color="success" />
      </CProgressStacked>
      <CRow className="mx-1">
        <CCol />
        <CCol className="text-center">
          <b>Approval</b>
          <span className="d-none d-md-block">2023-10-12 14:30</span>
        </CCol>
        <CCol />
        <CCol className="text-center">
          <b>Packing</b>
          <span className="d-none d-md-block">2023-10-12 14:30</span>
        </CCol>
        <CCol />
      </CRow>
    </>
  )
}

export default CustomStackedProgressBar
