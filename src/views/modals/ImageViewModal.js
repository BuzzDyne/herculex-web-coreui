import React from 'react'
import { CImage, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import { getImageURLorNoImg } from 'src/utils'

const ImageViewModal = ({ orderData, isOpen, onClose }) => {
  return (
    <CModal alignment="center" visible={isOpen} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Order #{orderData.id}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CImage className="w-100" src={getImageURLorNoImg(orderData.thumb_url)} />
      </CModalBody>
    </CModal>
  )
}

export default ImageViewModal
