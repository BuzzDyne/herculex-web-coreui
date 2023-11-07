export const ROLE_NAMES = {
  1: 'Admin',
  2: 'Designer',
  3: 'Printer',
  4: 'Packer',
}

// prettier-ignore
export const INTERNAL_ORDER_STATUS = {
  '000': { name: 'New Order', colorname: 'dark' },
  '100': { name: 'Waiting Design', colorname: 'info' },
  '200': { name: 'Pending Approval', colorname: 'danger' },
  '300': { name: 'Printing', colorname: 'warning' },
  '400': { name: 'Packing', colorname: 'primary' },
  '999': { name: 'Complete', colorname: 'success' },
}
