import React from 'react'

import useAuth from 'src/hooks/useAuth'
import { ROLE_NAMES } from 'src/constant'
import DashboardTasks from './DashboardTasks'

const Dashboard = () => {
  const { auth } = useAuth()
  const userRole = ROLE_NAMES[auth.token_role_id] || ''

  let dashboardToRender

  switch (userRole) {
    case 'Admin':
      dashboardToRender = <DashboardTasks roleID={1} />
      break
    case 'Designer':
      dashboardToRender = <DashboardTasks roleID={2} />
      break
    case 'Printer':
      dashboardToRender = <DashboardTasks roleID={3} />
      break
    case 'Packer':
      dashboardToRender = <DashboardTasks roleID={4} />
      break
    default:
      dashboardToRender = <div>No Dashboard Available</div>
  }

  return dashboardToRender
}

export default Dashboard
