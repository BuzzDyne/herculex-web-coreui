import { CBadge } from '@coreui/react'
import { INTERNAL_ORDER_STATUS } from './constant'

export const getEcomName = (ecommerce_code) => {
  switch (ecommerce_code) {
    case 'T':
      return 'Tokopedia'
    case 'S':
      return 'Shopee'
    default:
      return ecommerce_code
  }
}

export const getStatusBadge = (internal_order_status) => {
  const statusInfo = INTERNAL_ORDER_STATUS[internal_order_status]

  if (statusInfo) {
    const { name, colorname } = statusInfo
    return (
      <CBadge size="lg" color={colorname}>
        {name}
      </CBadge>
    )
  } else {
    return (
      <CBadge size="lg" color="secondary">
        Unknown
      </CBadge>
    )
  }
}

export const formatTStoPrettyString = (timestamp) => {
  if (timestamp === null) {
    return '-'
  }
  const now = new Date(Date.now())
  const tsDate = new Date(timestamp)
  const timeDifference = now - tsDate
  const minutes = Math.floor(timeDifference / (1000 * 60))
  const hours = Math.floor(timeDifference / (1000 * 60 * 60))
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  if (minutes < 2) {
    return `Just now`
  } else if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else if (days < 30) {
    return `${days}d ago`
  } else {
    return '>1 month ago'
  }
}
