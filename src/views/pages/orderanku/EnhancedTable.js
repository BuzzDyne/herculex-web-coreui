import * as React from 'react'
import PropTypes from 'prop-types'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import PrintIcon from '@mui/icons-material/Print'
import PriceCheckIcon from '@mui/icons-material/PriceCheck'
import { visuallyHidden } from '@mui/utils'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import CIcon from '@coreui/icons-react'
import { cilCheck } from '@coreui/icons'
import { CCard, CCardBody, CCardText, CCardTitle, CContainer } from '@coreui/react'
import ConfirmationModal from 'src/views/modals/ConfirmationModal'
import OrderankuEditModal from 'src/views/modals/OrderankuEditModal'
import OrderankuCreateModal from 'src/views/modals/OrderankuCreateModal'

function createData(id, name, calories, fat, carbs, protein) {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
  }
}

const rows = [
  createData(1, 'Cupcake', 305, 3.7, 67, 4.3),
  createData(2, 'Donut', 452, 25.0, 51, 4.9),
  createData(3, 'Eclair', 262, 16.0, 24, 6.0),
  createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
  createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),
  createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0),
  createData(9, 'KitKat', 518, 26.0, 65, 7.0),
  createData(10, 'Lollipop', 392, 0.2, 98, 0.0),
  createData(11, 'Marshmallow', 318, 0, 81, 2.0),
  createData(12, 'Nougat', 360, 19.0, 9, 37.0),
  createData(13, 'Oreo', 437, 18.0, 63, 4.0),
]

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells = [
  { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
  { id: 'created_date', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'recipient_name', numeric: false, disablePadding: false, label: 'Recipient Name' },
  {
    id: 'recipient_address_display',
    numeric: false,
    disablePadding: false,
    label: 'Recipient Address',
  },
  { id: 'order_total', numeric: true, disablePadding: false, label: 'Order Total' },
  { id: 'print_flag', numeric: false, disablePadding: false, label: 'Print' },
  { id: 'paid_flag', numeric: false, disablePadding: false, label: 'Paid' },
]

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all orders',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <b>{headCell.label}</b>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    onBatchPrintClick,
    onBatchPaidClick,
    onBatchDeleteClick,
    onEditClick,
    onCreateClick,
  } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Orders
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          {numSelected === 1 && (
            <Tooltip title="Edit">
              <IconButton onClick={onEditClick}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Print">
            <IconButton onClick={onBatchPrintClick}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Paid">
            <IconButton onClick={onBatchPaidClick}>
              <PriceCheckIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton sx={{ marginLeft: '16px' }} onClick={onBatchDeleteClick}>
              <DeleteIcon sx={{ color: '#D42136' }} />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Add New Order">
          <IconButton onClick={onCreateClick}>
            <AddIcon /> {/* TODO Create Order*/}
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onBatchPrintClick: PropTypes.func.isRequired,
  onBatchPaidClick: PropTypes.func.isRequired,
  onBatchDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onCreateClick: PropTypes.func.isRequired,
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0] // returns yyyy-mm-dd format
}

const formatCurrency = (amount) => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

const truncateStr = (text, limit) => {
  return text.length > limit ? text.slice(0, limit) + '...' : text
}

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('calories')
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(true)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [orderDataList, setOrderDataList] = React.useState([])
  const [visibleRows, setVisibleRows] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [axiosErrMsg, setAxiosErrMsg] = React.useState('')

  const [isConfirmModalVisible, setIsConfirmModalVisible] = React.useState(false)
  const [confirmModalData, setConfirmModalData] = React.useState({})

  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false)
  const [editModalData, setEditModalData] = React.useState({})

  const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false)

  const axiosPrivate = useAxiosPrivate()
  React.useEffect(() => {
    fetchData()
  }, [])

  React.useEffect(() => {
    setVisibleRows(
      stableSort(orderDataList, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    )
  }, [orderDataList, order, orderBy, page, rowsPerPage])

  const fetchData = () => {
    setIsLoading(true)
    axiosPrivate
      .get('/api_orderanku/order?per_page=1000')
      .then((response) => {
        setOrderDataList(response.data.sellers) // Adjust to response data structure
        console.log('Response.Data.Sellers:', response.data.sellers)
        setAxiosErrMsg('')
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching order list', err)
        setAxiosErrMsg(err.message)
        setOrderDataList([])
        setIsLoading(false)
      })
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = orderDataList.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event) => {
    setDense(event.target.checked)
  }

  const isSelected = (id) => selected.indexOf(id) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderDataList.length) : 0

  const openConfirmModal = (data) => {
    setConfirmModalData(data)
    setIsConfirmModalVisible(true)
  }

  const closeConfirmModal = () => {
    setIsConfirmModalVisible(false)
    setConfirmModalData({})
    setSelected([])
    fetchData()
  }

  const openEditModal = () => {
    setEditModalData(orderDataList.find((o) => o.id === selected[0]))
    setIsEditModalVisible(true)
  }

  const closeEditModal = () => {
    setIsEditModalVisible(false)
    setEditModalData({})
    setSelected([])
    fetchData()
  }

  const openCreateModal = () => {
    setIsCreateModalVisible(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalVisible(false)
    setSelected([])
    fetchData()
  }

  const handleBatchPrint = () => {
    openConfirmModal({
      modalTitle: 'Print',
      modalText: `Are you sure you want to print Order IDs (${selected.join(', ')})?`,
      modalConfirmText: 'Print',
      httpMethod: 'DOWNLOAD',
      httpEndpointURL: '/api_orderanku/order/batch_print',
      httpPayload: {
        order_ids: selected,
      },
    })
  }

  const handleBatchPaid = () => {
    openConfirmModal({
      modalTitle: 'Paid',
      modalText: `Are you sure you want to set Order IDs (${selected.join(', ')}) to paid?`,
      modalConfirmText: 'Make Paid',
      httpMethod: 'PATCH',
      httpEndpointURL: '/api_orderanku/order/batch_paid',
      httpPayload: {
        order_ids: selected,
      },
    })
  }

  const handleBatchDelete = () => {
    openConfirmModal({
      modalTitle: 'Delete Orders',
      modalText: `Are you sure you want to DELETE Order IDs (${selected.join(', ')})?`,
      modalConfirmText: 'Delete',
      httpMethod: 'DELETE-BATCH',
      httpEndpointURL: '/api_orderanku/order/batch_delete',
      httpPayload: {
        order_ids: selected,
      },
    })
  }

  const handleEdit = (row) => {
    openEditModal()
  }

  if (isLoading) {
    return <div>Loading...</div> // TODO Use Spinner
  }

  if (axiosErrMsg) {
    return <div>Error: {axiosErrMsg}</div> // TODO Show Pretty Alert
  }

  return (
    <>
      <CCard className="mb-2">
        <CCardBody>
          <CContainer>
            <CCardTitle>Filter</CCardTitle>
            <CCardText>Hi</CCardText>
          </CContainer>
        </CCardBody>
      </CCard>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            onBatchPrintClick={handleBatchPrint}
            onBatchPaidClick={handleBatchPaid}
            onBatchDeleteClick={handleBatchDelete}
            onEditClick={openEditModal}
            onCreateClick={openCreateModal}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={orderDataList.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.id}
                      </TableCell>
                      <TableCell>{formatDate(row.created_date)}</TableCell>
                      <TableCell>{row.recipient_name}</TableCell>
                      <TableCell>{truncateStr(row.recipient_address_display, 65)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.order_total)}</TableCell>
                      <TableCell align="center">
                        {row.print_date ? <CIcon icon={cilCheck} /> : '-'}
                      </TableCell>
                      <TableCell align="center">
                        {row.paid_date ? <CIcon icon={cilCheck} /> : '-'}
                      </TableCell>
                    </TableRow>
                  )
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={8} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={orderDataList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>

      <ConfirmationModal
        isOpen={isConfirmModalVisible}
        onClose={closeConfirmModal}
        {...confirmModalData}
      />
      <OrderankuEditModal
        isOpen={isEditModalVisible}
        onClose={closeEditModal}
        orderData={editModalData}
      />
      <OrderankuCreateModal isOpen={isCreateModalVisible} onClose={closeCreateModal} />
    </>
  )
}
