import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import { RootState } from 'app/rootReducer'
import graphService from 'lib/graph/GraphService'

interface UserInfo {
  displayName: string
  email: string
  avatar: string
}

type UserState = {
  isLoading: boolean
  error: string | null
} & UserInfo

const initialState: UserState = {
  isLoading: false,
  error: null,
  displayName: '',
  email: '',
  avatar: ''
}

const loadingStarted = (state: UserState) => {
  state.isLoading = true
}

const loadingFailed = (state: UserState, action: PayloadAction<string>) => {
  state.isLoading = false
  state.error = action.payload
  state.displayName = ''
  state.email = ''
  state.avatar = ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startLoading: loadingStarted,
    failureLoading: loadingFailed,
    setUserData: (state, action: PayloadAction<UserInfo>) => {
      const { displayName, email, avatar } = action.payload
      state.isLoading = false
      state.error = null
      state.displayName = displayName
      state.email = email
      state.avatar = avatar
    }
  }
})

export const { startLoading, failureLoading, setUserData } = userSlice.actions
export default userSlice.reducer

export const selectUser = (state: RootState) => state.user

export const fetchUserData = (): AppThunk => async dispatch => {
  try {
    dispatch(startLoading())
    const user = await graphService.getUserInfo()
    const avatar = await graphService.getUserAvatar()
    const payload: UserInfo = {
      displayName: user.displayName || '',
      email: user.userPrincipalName || '',
      avatar: avatar
    }
    dispatch(setUserData(payload))
  } catch (e) {
    dispatch(failureLoading(e.toString()))
  }
}
