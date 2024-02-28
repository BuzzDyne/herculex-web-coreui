import React from 'react'
import DocumentForm from '../forms/DocumentForm'
import { DocModalTypes } from 'src/constant'

const DocumentCreateQuotationModal = ({ order_id, order_items_data, isOpen, onClose }) => {
  return (
    <DocumentForm
      modalTitle={`Create New Quotation for Order #${order_id}`}
      docModalType={DocModalTypes.CREATE_QUOTATION}
      order_id={order_id}
      order_items_data={order_items_data}
      doc_id={null}
      isOpen={isOpen}
      onClose={onClose}
    />
  )
}

export default DocumentCreateQuotationModal
