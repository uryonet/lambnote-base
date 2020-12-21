import {
  AuthenticationParameters,
  Configuration,
  UserAgentApplication
} from 'msal'
import { config } from './AzureConfig'

const signInOptions: AuthenticationParameters = {
  scopes: config.scopes,
  prompt: 'select_account'
}

const msalConfig: Configuration = {
  auth: {
    clientId: config.appId,
    redirectUri: config.redirectUri
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true
  }
}

const msalClient = new UserAgentApplication(msalConfig)

export const signIn = async () => {
  await msalClient.loginRedirect(signInOptions)
}

export const signOut = () => {
  msalClient.logout()
}

export const getToken = async (): Promise<string> => {
  const response = await msalClient.acquireTokenSilent(signInOptions)
  return response.accessToken
}

export const isAuth = (): boolean => {
  const account = msalClient.getAccount()
  return account !== null
}
