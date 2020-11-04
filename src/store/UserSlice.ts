import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from './store'
import graphService from '../lib/graph/GraphService'

interface UserState {
  user:
    | {
        isLoad: false
      }
    | {
        isLoad: true
        displayName: string
        email: string
        avatar: string
      }
}

const initialState: UserState = {
  user: {
    isLoad: false
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload.user
    }
  }
})

export const { setUserData } = userSlice.actions

export const fetchUserData = (): AppThunk => async (dispatch) => {
  try {
    const user = await graphService.getUserInfo()
    console.log(user)
    const avatar = await graphService.getUserAvatar()
    const payload: UserState = {
      user: {
        isLoad: true,
        displayName: user.displayName || '',
        email: user.userPrincipalName || '',
        avatar: avatar
      }
    }
    dispatch(setUserData(payload))
  } catch (e) {
    const payload: UserState = {
      user: {
        isLoad: false
      }
    }
    dispatch(setUserData(payload))
  }
}

export const selectUser = (state: RootState) => state.user.user

export default userSlice.reducer
