import React from 'react'
import DocumentForm from '../forms/DocumentForm'
import { DocModalTypes } from 'src/constant'

const DocumentCreateManualModal = ({ isOpen, onClose }) => {
  return (
    <DocumentForm
      modalTitle={'Create New Invoice (Manual)'}
      docModalType={DocModalTypes.CREATE_MANUAL}
      order_id={null}
      order_items_data={null}
      doc_id={null}
      isOpen={isOpen}
      onClose={onClose}
    />
  )
}

export default DocumentCreateManualModal
