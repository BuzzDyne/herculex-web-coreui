export const ROLE_NAMES = {
  1: 'Admin',
  2: 'Designer',
  3: 'Printer',
  4: 'Packer',
}

export const ROLE_DASHBOARD_API_MAPPING = {
  1: '/api_order/get_orders_by_status?status=admin',
  2: '/api_order/get_orders_by_status?status=100',
  3: '/api_order/get_orders_by_status?status=300',
  4: '/api_order/get_orders_by_status?status=400',
}

// prettier-ignore
export const INTERNAL_ORDER_STATUS = {
  '000': { name: 'New Order', colorname: 'dark', buttonText: 'Input Data' }, 
  '100': { name: 'Waiting Design', colorname: 'info', buttonText: 'Submit Design' }, 
  '200': { name: 'Pending Approval', colorname: 'danger', buttonText: 'Approve Design' }, 
  '300': { name: 'Printing', colorname: 'warning', buttonText: 'Done Printing' }, 
  '400': { name: 'Packing', colorname: 'primary', buttonText: 'Done Packing' }, 
  '999': { name: 'Complete', colorname: 'success', buttonText: '' },
}
