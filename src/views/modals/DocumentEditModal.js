import React from 'react'
import DocumentForm from '../forms/DocumentForm'
import { DocModalTypes } from 'src/constant'

const DocumentEditModal = ({ doc_id, isOpen, onClose }) => {
  return (
    <DocumentForm
      modalTitle={`Edit Document`}
      docModalType={DocModalTypes.EDIT}
      order_id={null}
      order_items_data={null}
      doc_id={doc_id}
      isOpen={isOpen}
      onClose={onClose}
    />
  )
}

export default DocumentEditModal
