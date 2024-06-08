import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="d-none d-md-block">
      <div className="d-flex text-center">
        <div className="mx-auto">
          <span className="me-1">Herculex Indonesia</span>
          {/* <a href="https://www.instagram.com/rickyganii/" target="_blank" rel="noopener noreferrer">
            Ricky
          </a> */}
        </div>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
