import { CBadge } from '@coreui/react'
import { INTERNAL_ORDER_STATUS } from './constant'

export const getEcomName = (ecommerce_code) => {
  switch (ecommerce_code) {
    case 'T':
      return 'Tokopedia'
    case 'S':
      return 'Shopee'
    case 'X':
      return 'Manual (T)'
    case 'Y':
      return 'Manual (S)'
    case 'Z':
      return 'Manual'
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

export const formatPeriodToString = (timePeriod) => {
  return timePeriod
    ? `${timePeriod.slice(0, 4)}/${timePeriod.slice(4, 6)}/${timePeriod.slice(6)}`
    : '-'
}

export const getEcomOrderID = (orderData) => {
  const { ecommerce_code, invoice_ref, ecom_order_id } = orderData

  if (ecommerce_code === 'T') {
    return invoice_ref !== null ? invoice_ref : '-'
  } else {
    return ecom_order_id !== null ? ecom_order_id : '-'
  }
}

export const getImageURLorNoImg = (imageURL) =>
  imageURL ? imageURL : 'https://placehold.co/400?text=No+Image'

export const formatTStoPrettyString = (timestamp) => {
  if (timestamp === null) {
    return '-'
  }
  const now = new Date(Date.now())
  const tsDate = new Date(timestamp)
  const timeDifference = now - tsDate - 7 * 60 * 60 * 1000
  const minutes = Math.floor(timeDifference / (1000 * 60))
  const hours = Math.floor(timeDifference / (1000 * 60 * 60))
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  if (minutes < 1) {
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

export const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString)

  // Subtract 7 hours from the timestamp
  const adjustedTimestamp = date.getTime() + 7 * 60 * 60 * 1000
  const adjustedDate = new Date(adjustedTimestamp)

  const year = adjustedDate.getFullYear()
  const month = String(adjustedDate.getMonth() + 1).padStart(2, '0')
  const day = String(adjustedDate.getDate()).padStart(2, '0')
  const hours = String(adjustedDate.getHours()).padStart(2, '0')
  const minutes = String(adjustedDate.getMinutes()).padStart(2, '0')

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`

  return formattedDateTime
}

export const openWhatsappChat = (phoneNo) => {
  const waNumber = `62${phoneNo && !phoneNo.startsWith('0') ? phoneNo.substring(1) : phoneNo || ''}`
  const waLink = `https://api.whatsapp.com/send?phone=${waNumber}&text=Hello%20this%20is%20Herculex`
  window.open(waLink)
}

export const formatNumberWithCommas = (number) => {
  return `Rp${number.toLocaleString('en-US')}`
}
