import React from 'react'
import DocumentForm from '../forms/DocumentForm'
import { DocModalTypes } from 'src/constant'

const DocumentCreateInvoiceModal = ({ order_id, order_items_data, isOpen, onClose }) => {
  return (
    <DocumentForm
      modalTitle={`Create New Invoice for Order #${order_id}`}
      docModalType={DocModalTypes.CREATE_INVOICE}
      order_id={order_id}
      order_items_data={order_items_data}
      isOpen={isOpen}
      onClose={onClose}
    />
  )
}

export default DocumentCreateInvoiceModal
