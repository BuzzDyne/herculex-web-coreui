import React, { useEffect } from 'react'

const MyTaskList = (props) => {
  const { api_path } = props

  useEffect(() => {
    console.log('api_path', api_path)
  }, [])

  return <div></div>
}

export default MyTaskList
