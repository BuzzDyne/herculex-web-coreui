import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CInputGroup,
  CRow,
  CSpinner,
} from '@coreui/react'
import { cilSend } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import useAuth from 'src/hooks/useAuth'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import { formatTStoPrettyString } from 'src/utils'

const OrderCommentList = ({ orderID, onClose }) => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formCommentValue, setFormCommentValue] = useState('')

  const [commentList, setCommentList] = useState([])

  const fetchData = () => {
    setIsLoading(true)
    axiosPrivate
      .get(`/api_order/id/${orderID}/get_comments`)
      .then((response) => {
        // console.log('/get_comments:', response.data)
        setCommentList(response.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching comment list', err)
        setCommentList([])
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setFormCommentValue('')
    fetchData()
  }, [orderID])

  const handleSendComment = () => {
    if (!formCommentValue) {
      fetchData()
      return
    }

    setIsSubmitting(true)

    axiosPrivate
      .post(`/api_order/id/${orderID}/post_comment`, {
        user_id: auth.token_user_id,
        comment: formCommentValue,
      })
      .then((response) => {
        // console.log('Submission successful', response.data)
        setFormCommentValue('')
        setIsSubmitting(false)
        fetchData()
        onClose()
      })
      .catch((error) => {
        console.error('Error submitting data', error)
        setIsSubmitting(false)
      })
  }

  const handleCommentChange = (event) => {
    const newValue = event.target.value
    // Add logic to limit the comment to 200 characters
    if (newValue.length <= 200) {
      setFormCommentValue(newValue)
    }
  }

  return (
    <>
      <CCard className="h-100">
        <CCardBody className="py-2">
          <CRow>
            <CCol>
              <h5>Comments</h5>
            </CCol>
          </CRow>
          <CRow>
            <CInputGroup className="mb-2">
              <CFormInput
                size="sm"
                disabled={isSubmitting}
                style={{ boxShadow: '0 0 transparent' }}
                placeholder="Add comments here (max 200 characters)"
                value={formCommentValue}
                onChange={handleCommentChange}
                maxLength={200}
              />
              <CButton
                type="button"
                color="primary"
                disabled={isSubmitting}
                onClick={handleSendComment}
              >
                <CIcon icon={cilSend} />
              </CButton>
            </CInputGroup>
          </CRow>

          {isLoading ? (
            <CRow>
              <CCol className="d-flex justify-content-center">
                <CSpinner color="dark" />
              </CCol>
            </CRow>
          ) : (
            <CRow xs={{ gutterY: 1 }}>
              {commentList.length > 0 ? (
                commentList.map((comment) => (
                  <CCol xs={12} key={comment.id}>
                    <CCard className="py-0 px-2">
                      <CRow>
                        <CCol>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: 700,
                              marginRight: '4px',
                            }}
                          >
                            {comment.creator_username}
                          </span>
                          {'|'}
                          <span
                            style={{
                              fontSize: '12px',
                              marginLeft: '2px',
                              fontWeight: 400,
                              color: 'rgb(96,96,96)',
                            }}
                          >
                            {formatTStoPrettyString(comment.comment_date)}
                          </span>
                        </CCol>
                        <CCol xs="12" style={{ fontSize: '14px', fontWeight: 400 }}>
                          {comment.comment_text}
                        </CCol>
                      </CRow>
                    </CCard>
                  </CCol>
                ))
              ) : (
                <CCol className="text-center my-4">
                  <p>No comments yet</p>
                </CCol>
              )}
            </CRow>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default OrderCommentList
