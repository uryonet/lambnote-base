import React from 'react'
import ReactDOM from 'react-dom'
import './assets/index.scss'
import { loadTheme } from '@fluentui/react'
import { initializeIcons } from '@uifabric/icons'
import App from './app/App'
import { store } from './app/store'
import { Provider } from 'react-redux'

loadTheme({
  palette: {
    themePrimary: '#7719aa',
    themeLighterAlt: '#f9f3fc',
    themeLighter: '#e6d1f2',
    themeLight: '#d1abe6',
    themeTertiary: '#a864cd',
    themeSecondary: '#862eb5',
    themeDarkAlt: '#6c179a',
    themeDark: '#5b1382',
    themeDarker: '#430e60',
    neutralLighterAlt: '#f3f3f3',
    neutralLighter: '#efefef',
    neutralLight: '#e5e5e5',
    neutralQuaternaryAlt: '#d6d6d6',
    neutralQuaternary: '#cccccc',
    neutralTertiaryAlt: '#c4c4c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#fafafa'
  }
})

initializeIcons()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
