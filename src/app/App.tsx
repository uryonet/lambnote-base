import React, { useEffect } from 'react'
import { LambHeader } from 'components/header/LambHeader'
import { LambSectionBar } from 'components/sidebar/LambSectionBar'
import { LambPageBar } from 'components/sidebar/LambPageBar'
import { LambEditor } from 'components/editor/LambEditor'
import { LoginForm } from 'components/LoginForm'

import * as authService from 'lib/graph/AuthService'
import { useDispatch } from 'react-redux'
import { fetchUserData } from 'features/users/userSlice'
import { fetchLambNotebookData } from 'features/notes/noteSlice'

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
      <div className="container">
        <LambHeader />
        <div className="content">
          <LambSectionBar />
          <LambPageBar />
          <LambEditor />
        </div>
      </div>
    )
  } else {
    return <LoginForm />
  }
}

export default App
