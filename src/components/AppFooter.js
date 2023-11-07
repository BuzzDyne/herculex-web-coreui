import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div className="ms-auto">
        <span className="me-1">Created by:</span>
        <a href="https://www.instagram.com/rickyganii/" target="_blank" rel="noopener noreferrer">
          Ricky
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
