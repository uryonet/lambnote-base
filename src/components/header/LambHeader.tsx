import React from 'react'
import {
  IconButton,
  IContextualMenuProps,
  IButtonStyles
} from '@fluentui/react'
import * as authService from '../../lib/graph/AuthService'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/users/userSlice'

export const LambHeader: React.FC = () => {
  const user = useSelector(selectUser)

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'userName',
        text: user.displayName
      },
      {
        key: 'email',
        text: user.email
      },
      {
        key: 'signOut',
        text: 'サインアウト',
        onClick: () => authService.signOut()
      }
    ],
    alignTargetEdge: true,
    directionalHintFixed: true
  }

  const iconBtnStyle: IButtonStyles = {
    rootHovered: {
      background: '#9953c0'
    },
    rootPressed: {
      background: '#9953c0'
    },
    rootExpanded: {
      background: '#9953c0'
    }
  }

  return (
    <header className="lamb-header">
      <h1>LambNote</h1>
      <IconButton
        className="user-icon"
        allowDisabledFocus={true}
        iconProps={{ iconName: 'Contact' }}
        menuProps={menuProps}
        styles={iconBtnStyle}
      />
    </header>
  )
}
