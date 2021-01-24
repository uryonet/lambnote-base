import React, { useEffect } from 'react'
import { SidebarMenu } from 'components/SidebarMenu'
import { Editor } from 'features/editor/Editor'
import { LoginForm } from 'features/users/LoginForm'

import * as authService from 'lib/graph/AuthService'
import { useDispatch } from 'react-redux'
import { fetchUserData } from 'features/users/userSlice'
import { fetchLambNotebookData } from 'features/notes/noteSlice'
import { BottomMenu } from '../components/BottomMenu'

const App: React.FC = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (authService.isAuth()) {
      dispatch(fetchUserData())
      dispatch(fetchLambNotebookData())
    }
  }, [dispatch])

  if (authService.isAuth()) {
    return (
      <div className="wrapper">
        <SidebarMenu />
        <Editor />
        <BottomMenu />
      </div>
    )
  } else {
    return <LoginForm />
  }
}

export default App
