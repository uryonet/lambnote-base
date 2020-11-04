import React from 'react'
import { PrimaryButton } from '@fluentui/react'
import * as authService from '../lib/graph/AuthService'

export const LoginForm: React.FC = () => {
  return (
    <div className="login-container">
      <div className="login-form">
        <h1>
          ZeroNoteのご利用にはMicrosoftアカウントでのサインインが必要です。
        </h1>
        <PrimaryButton text="サインイン" onClick={authService.signIn} />
      </div>
    </div>
  )
}
