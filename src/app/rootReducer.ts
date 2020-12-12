import { combineReducers } from '@reduxjs/toolkit'
import userReducer from 'features/users/userSlice'
import noteReducer from 'features/notes/noteSlice'
import sectionsReducer from 'features/sections/sectionsSlice'
import pagesReducer from 'features/pages/pagesSlice'

const rootReducer = combineReducers({
  user: userReducer,
  note: noteReducer,
  sections: sectionsReducer,
  pages: pagesReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
