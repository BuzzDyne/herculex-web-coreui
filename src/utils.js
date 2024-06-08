import { CBadge } from '@coreui/react'
import { INTERNAL_ORDER_STATUS } from './constant'

export const getColorBasedOnDeadline = (deadlineDate, currentDate = '') => {
  if (!currentDate) {
    currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  }

  if (!deadlineDate) {
    return 'black'
  }

  const parseDate = (dateString) => {
    const year = parseInt(dateString.substring(0, 4), 10)
    const month = parseInt(dateString.substring(4, 6), 10) - 1 // Month is 0-based
    const day = parseInt(dateString.substring(6, 8), 10)
    return new Date(year, month, day)
  }

  const deadlineTimestamp = parseDate(deadlineDate).getTime()
  const currentTimestamp = parseDate(currentDate).getTime()

  if (isNaN(deadlineTimestamp) || isNaN(currentTimestamp)) {
    // Handle invalid date format
    console.error('Invalid date format. Deadline:', deadlineDate, 'Current date:', currentDate)
    return 'black'
  }

  const timeDiff = Math.floor((deadlineTimestamp - currentTimestamp) / (24 * 60 * 60 * 1000))

  if (timeDiff === 0) {
    return '#CC3300'
  } else if (timeDiff <= 2) {
    return '#FF9900'
  } else {
    return 'black'
  }
}

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

export const getEcomBadge = (ecommerce_code) => {
  switch (ecommerce_code) {
    case 'T':
      return (
        <CBadge size="lg" color="success">
          Tokopedia
        </CBadge>
      )

    case 'S':
      return (
        <CBadge size="lg" color="warning">
          Shopee
        </CBadge>
      )
    case 'X':
      return (
        <CBadge size="lg" color="success">
          Tokopedia (Manual)
        </CBadge>
      )
    case 'Y':
      return (
        <CBadge size="lg" color="warning">
          Shopee (Manual)
        </CBadge>
      )
    case 'Z':
      return (
        <CBadge size="lg" color="primary">
          Manual
        </CBadge>
      )
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

export const getDocTypeName = (docTypeCode) => {
  const docTypeMap = {
    I: 'Invoice',
    Q: 'Quotation',
  }

  return docTypeMap[docTypeCode] || 'Other'
}

export const isYYYYMMDDInvalid = (yyyy, mm, dd) => {
  const year = parseInt(yyyy)
  const month = parseInt(mm) - 1 // Months are 0-based
  const day = parseInt(dd)
  const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0))

  return (
    isNaN(date.getTime()) ||
    date.getDate() !== day ||
    date.getMonth() !== month ||
    date.getUTCFullYear() !== year
  )
}

export const performDownloadFromResponse = (response, filename) => {
  const blobUrl = window.URL.createObjectURL(new Blob([response.data]))

  // Create an anchor element to trigger the download
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = `${filename}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const performPrintFromResponse = (response) => {
  // Create a blob URL for the PDF content
  const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))

  // Open the PDF content in a new window for printing
  const pdfWindow = window.open(blobUrl)

  // Print the PDF content
  pdfWindow.print()
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
