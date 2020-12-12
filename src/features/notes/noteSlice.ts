import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import { RootState } from 'app/rootReducer'
import graphService from 'lib/graph/GraphService'
import { Notebook } from '@microsoft/microsoft-graph-types'

interface NoteInfo {
  lambnoteId: string | undefined
}

type NoteState = {
  isLoading: boolean
  error: string | null
} & NoteInfo

const initialState: NoteState = {
  isLoading: false,
  error: null,
  lambnoteId: undefined
}

const startLoading = (state: NoteState) => {
  state.isLoading = true
}

const loadingFailed = (state: NoteState, action: PayloadAction<string>) => {
  state.isLoading = false
  state.error = action.payload
  state.lambnoteId = undefined
}

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    startGetNote: startLoading,
    failureGetNote: loadingFailed,
    setLambNoteId: (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false
      state.error = null
      state.lambnoteId = action.payload
    }
  }
})

export const { startGetNote, failureGetNote, setLambNoteId } = noteSlice.actions
export default noteSlice.reducer

export const selectNote = (state: RootState) => state.note

export const fetchLambNotebookData = (): AppThunk => async dispatch => {
  try {
    dispatch(startGetNote())
    const notebooks = await graphService.getLambNotebook()
    console.log('Notebooks: ')
    console.log(notebooks)
    let notebook: Notebook
    if (notebooks.length == 0) {
      notebook = await graphService.createLambNotebook()
    } else {
      notebook = notebooks[0]
    }
    dispatch(setLambNoteId(notebook.id))
  } catch (e) {
    dispatch(failureGetNote(e.toString()))
  }
}
