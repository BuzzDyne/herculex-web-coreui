import React, { Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import useAuth from '../hooks/useAuth'

// routes config
import routes from '../routes'

const ProtectedRoute = ({ element: Element }) => {
  const { auth } = useAuth()
  const location = useLocation()

  const isAuthenticated = () => !!auth?.token_username

  if (!isAuthenticated()) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace={true} />
  }

  // Render the protected route's element if authenticated
  return <Element />
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
                  element={<ProtectedRoute element={route.element} />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          {/* Catch-all route for unmatched routes */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
