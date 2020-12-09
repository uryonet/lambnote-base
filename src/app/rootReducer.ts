import { combineReducers } from '@reduxjs/toolkit'
import userReducer from 'features/users/userSlice'
import noteReducer from 'features/notes/noteSlice'

const rootReducer = combineReducers({
  user: userReducer,
  note: noteReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
