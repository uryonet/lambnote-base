export interface AzureConfig {
  appId: string
  redirectUri: string
  scopes: string[]
}

export const config: AzureConfig = {
  appId: process.env.REACT_APP_AZURE_APP_ID as string,
  redirectUri: process.env.REACT_APP_AZURE_REDIRECT_URL as string,
  scopes: ['user.read', 'notes.readwrite', 'notes.create']
}
