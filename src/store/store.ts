import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import userReducer from './UserSlice'
import noteReducer from './NoteSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    note: noteReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
