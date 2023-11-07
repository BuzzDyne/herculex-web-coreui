import React, { Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import useAuth from '../hooks/useAuth'

// routes config
import routes from '../routes'

const ProtectedRoute = ({ element: Element, isPrivate, ...rest }) => {
  const { auth } = useAuth()

  const isAuthenticated = () => !!auth?.token_username

  if (isPrivate && !isAuthenticated()) {
    return <Navigate to="/login" />
  }

  return <Element {...rest} />
}

const AppContent = () => {
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<ProtectedRoute element={route.element} isPrivate={route.isPrivate} />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
