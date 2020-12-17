import React from 'react'
import * as authService from '../../lib/graph/AuthService'

export const LoginForm: React.FC = () => {
  const handleSignIn = () => {
    authService.signIn().then((r) => console.log(r))
  }

  return (
    <div>
      <h1>LambNote</h1>
      <p>Lambnoteのご利用にはMicrosoftアカウントでのサインインが必要です。</p>
      <button onClick={handleSignIn}>サインイン</button>
    </div>
  )
}
