import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/users/userSlice'

import { Avatar } from 'primereact/avatar'

export const UserInfo: React.FC = () => {
  const { displayName, avatar } = useSelector(selectUser)
  return (
    <div className="sidebar-header">
      <h2>LambNote</h2>
      <div className="user-info">
        <Avatar className="avatar-icon" image={avatar} size="large" shape="circle" />
        <span>{displayName}</span>
      </div>
    </div>
  )
}
