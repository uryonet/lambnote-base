import React, { useEffect } from 'react'
import { LambHeader } from 'components/header/LambHeader'
import { SectionsList } from 'features/sections/SectionsList'
import { PagesList } from 'features/pages/PagesList'
import { LambEditor } from 'components/editor/LambEditor'
import { LoginForm } from 'features/users/LoginForm'

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
          <SectionsList />
          <PagesList />
          <LambEditor />
        </div>
      </div>
    )
  } else {
    return <LoginForm />
  }
}

export default App
