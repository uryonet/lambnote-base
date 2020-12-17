import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from 'features/users/userSlice'
import * as authService from 'lib/graph/AuthService'

export const LambHeader: React.FC = () => {
  const { displayName, email } = useSelector(selectUser)

  const handleSignOut = () => {
    authService.signOut()
  }

  return (
    <header>
      <h1>LambNote</h1>
      <div className="user-info">
        <h2>ユーザー情報</h2>
        <ul>
          <li>{displayName}</li>
          <li>{email}</li>
          <li>
            <a href="" onClick={handleSignOut}>
              サインアウト
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
