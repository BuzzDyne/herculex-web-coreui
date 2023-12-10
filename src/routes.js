import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const UserMgmt = React.lazy(() => import('./views/pages/usermgmt/UserMgmt'))
const OrderListAdmin = React.lazy(() => import('./views/pages/orderlistadmin/OrderListAdmin'))
const OrderDetail = React.lazy(() => import('./views/pages/orderdetail/OrderDetail'))
const BatchList = React.lazy(() => import('./views/pages/batchlist/BatchList'))

const routes = [
  { path: '/', exact: true, name: 'Home', isPrivate: true },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, isPrivate: true },
  { path: '/admin_order_list', name: 'Order List', element: OrderListAdmin, isPrivate: true },
  { path: '/order_detail/:id', name: 'Order Detail', element: OrderDetail, isPrivate: true },
  { path: '/theme', name: 'Theme', element: Colors, exact: true, isPrivate: true },
  { path: '/user_management', name: 'User Management', element: UserMgmt, isPrivate: true },
  { path: '/batch_list', name: 'BatchList', element: BatchList, isPrivate: true },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons, isPrivate: true },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons, isPrivate: true },
  { path: '/icons/flags', name: 'Flags', element: Flags, isPrivate: true },
  { path: '/icons/brands', name: 'Brands', element: Brands, isPrivate: true },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true, isPrivate: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts, isPrivate: true },
  { path: '/notifications/badges', name: 'Badges', element: Badges, isPrivate: true },
  { path: '/notifications/modals', name: 'Modals', element: Modals, isPrivate: true },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts, isPrivate: true },
  { path: '/widgets', name: 'Widgets', element: Widgets, isPrivate: true },
]

export default routes
