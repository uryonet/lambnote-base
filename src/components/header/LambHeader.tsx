import React, { FormEvent } from 'react'
import {
  IconButton,
  IContextualMenuProps,
  IButtonStyles,
  Dropdown,
  IDropdownOption
} from '@fluentui/react'
import * as authService from '../../lib/graph/AuthService'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../store/UserSlice'
import { setNoteId, selectNoteList } from '../../store/NoteSlice'

export const LambHeader: React.FC = () => {
  const dispatch = useDispatch()

  const user = useSelector(selectUser)
  const noteList = useSelector(selectNoteList)

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'userName',
        text: user.isLoad ? user.displayName : ''
      },
      {
        key: 'email',
        text: user.isLoad ? user.email : ''
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

  const onChange = (
    event: FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
    dispatch(setNoteId(option ? option.key.toString() : undefined))
  }

  return (
    <header className="lamb-header">
      <h1>ZeroNote</h1>
      <Dropdown
        className="note-select"
        onChange={onChange}
        placeholder="ノートを選択"
        options={noteList}
      />
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
