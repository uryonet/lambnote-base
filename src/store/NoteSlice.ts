import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from './store'
import graphService from '../lib/GraphService'
import { Notebook, OnenotePage } from '@microsoft/microsoft-graph-types'
import { IDropdownOption } from '@fluentui/react'

interface NoteState {
  currentNoteId: string | undefined
  notebooks: Notebook[]
  pages: OnenotePage[]
  page: PageInfo
}

interface PageInfo {
  pageRaw: string
  pageId: string
  title: string
}

const initialState: NoteState = {
  currentNoteId: undefined,
  notebooks: [],
  pages: [],
  page: {
    pageRaw: '',
    pageId: '',
    title: ''
  }
}

export interface UpdateContent {
  target: string
  action: string
  content: string
}

export const fetchPageContent = createAsyncThunk(
  'page/content',
  async (arg: { pageId: string }) => {
    const { pageId } = arg
    const pageRaw = await graphService.getPageContent(pageId)
    const { title } = new DOMParser().parseFromString(pageRaw, 'text/html')
    const page: PageInfo = {
      pageRaw,
      pageId,
      title
    }
    return page
  }
)

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setNoteId: (state, action: PayloadAction<string | undefined>) => {
      state.currentNoteId = action.payload
    },
    setNotebookData: (state, action: PayloadAction<Notebook[]>) => {
      state.notebooks = action.payload
    },
    setPageData: (state, action: PayloadAction<OnenotePage[]>) => {
      state.pages = action.payload
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.page.title = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPageContent.fulfilled, (state, action) => {
      return {
        ...state,
        page: action.payload
      }
    })
  }
})

export const {
  setNoteId,
  setNotebookData,
  setPageData,
  setPageTitle
} = noteSlice.actions

export const fetchNoteData = (): AppThunk => async (dispatch) => {
  try {
    const note = await graphService.getNotebooks()
    console.log(note)
    dispatch(setNotebookData(note))
  } catch (e) {
    const emptyNotebooks: Notebook[] = []
    dispatch(setNotebookData(emptyNotebooks))
  }
}

export const fetchPageData = (sectionId: string): AppThunk => async (
  dispatch
) => {
  try {
    const pages = await graphService.getPages(sectionId)
    console.log(pages)
    dispatch(setPageData(pages))
  } catch (e) {
    const emptyPages: OnenotePage[] = []
    dispatch(setPageData(emptyPages))
  }
}

export const updatePageTitle = (
  pageId: string,
  title: string
): AppThunk => async (dispatch) => {
  try {
    const stream: UpdateContent[] = [
      {
        target: 'title',
        action: 'replace',
        content: title
      }
    ]
    const result = await graphService.updatePageTitle(pageId, stream)
    if (result) {
      dispatch(setPageTitle(title))
    }
  } catch (e) {
    console.log(e)
  }
}

export const selectNoteList = (state: RootState) => {
  const noteList: IDropdownOption[] = []
  state.note.notebooks.forEach((note) => {
    noteList.push({ key: note.id ?? '', text: note.displayName ?? '' })
  })
  return noteList
}

export const selectSectionList = (state: RootState) => {
  const currentNote = state.note.notebooks.find(
    (note) => note.id === state.note.currentNoteId
  )
  return currentNote?.sections ?? []
}

export const selectPageList = (state: RootState) => state.note.pages

export const selectPageContent = (state: RootState): PageInfo => state.note.page

export default noteSlice.reducer
