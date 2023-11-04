import React from 'react'

import DashboardAdmin from './DashboardAdmin'
import DashboardDesigner from './DashboardDesigner'
import DashboardPacker from './DashboardPacker'
import DashboardPrinter from './DashboardPrinter'
import useAuth from 'src/hooks/useAuth'
import { ROLE_NAMES } from 'src/constant'

const Dashboard = () => {
  const { auth, setAuth } = useAuth()
  const userRole = ROLE_NAMES[auth.token_role_id] || ''

  let dashboardToRender

  switch (userRole) {
    case 'Admin':
      dashboardToRender = <DashboardAdmin />
      break
    case 'Designer':
      dashboardToRender = <DashboardDesigner />
      break
    case 'Packer':
      dashboardToRender = <DashboardPacker />
      break
    case 'Printer':
      dashboardToRender = <DashboardPrinter />
      break
    default:
      dashboardToRender = <div>No Dashboard Available</div>
  }

  return dashboardToRender
}

export default Dashboard
