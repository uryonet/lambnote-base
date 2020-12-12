import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import { RootState } from 'app/rootReducer'
import graphService from 'lib/graph/GraphService'

interface UserState {
  user:
    | {
    isLoad: false
    isLoading: boolean
  }
    | {
    isLoad: true
    isLoading: boolean
    displayName: string
    email: string
    avatar: string
  }
}

const initialState: UserState = {
  user: {
    isLoad: false,
    isLoading: false
  }
}

const startLoading = (state: UserState) => {
  state.user.isLoading = true
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startGetUser: startLoading,
    setUserData: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload.user
    }
  }
})

export const { startGetUser, setUserData } = userSlice.actions

export const selectUser = (state: RootState) => state.user.user

export default userSlice.reducer

export const fetchUserData = (): AppThunk => async dispatch => {
  try {
    dispatch(startGetUser())
    const user = await graphService.getUserInfo()
    const avatar = await graphService.getUserAvatar()
    const payload: UserState = {
      user: {
        isLoad: true,
        isLoading: false,
        displayName: user.displayName || '',
        email: user.userPrincipalName || '',
        avatar: avatar
      }
    }
    dispatch(setUserData(payload))
  } catch (e) {
    const payload: UserState = {
      user: {
        isLoad: false,
        isLoading: false
      }
    }
    dispatch(setUserData(payload))
  }
}
