import React, { useEffect } from 'react'
import { Header } from 'components/header/Header'
import { SectionsList } from 'features/sections/SectionsList'
import { PagesList } from 'features/pages/PagesList'
import { Editor } from 'features/editor/Editor'
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
      <div>
        <Header />
        <div className="content">
          <div className="sidebar">
            <SectionsList />
            <PagesList />
          </div>
          <Editor />
        </div>
      </div>
    )
  } else {
    return <LoginForm />
  }
}

export default App
