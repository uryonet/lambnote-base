import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from './store'
import graphService from '../lib/graph/GraphService'
import { Notebook, OnenotePage, OnenoteSection } from "@microsoft/microsoft-graph-types";

interface NoteState {
  lambnoteId: string | undefined
  sections: OnenoteSection[]
  pages: OnenotePage[]
  page: PageInfo
}

interface PageInfo {
  pageRaw: string
  pageId: string
  title: string
}

const initialState: NoteState = {
  lambnoteId: undefined,
  sections: [],
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
    setLambNoteId: (state, action: PayloadAction<string | undefined>) => {
      state.lambnoteId = action.payload
    },
    setNewSection: (state, action: PayloadAction<OnenoteSection>) => {
      state.sections.push(action.payload)
    },
    setNotebookData: (state, action: PayloadAction<Notebook[]>) => {
      state.sections = action.payload
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
  setLambNoteId,
  setNewSection,
  setNotebookData,
  setPageData,
  setPageTitle
} = noteSlice.actions

export const fetchLambNotebookData = (): AppThunk => async (dispatch) => {
  try {
    const notebooks = await graphService.getLambNotebook()
    console.log(notebooks)
    let notebook: Notebook
    if (notebooks.length == 0) {
      notebook = await graphService.createLambNotebook()
    } else {
      notebook = notebooks[0]
    }
    dispatch(setLambNoteId(notebook.id))
  } catch (e) {
    dispatch(setLambNoteId(undefined))
  }
}

export const createNewSection = (lambnoteId: string, sectionName: string): AppThunk => async (dispatch) => {
  try {
    const section = await graphService.createNewSection(lambnoteId, sectionName)
    console.log(section)
    dispatch(setNewSection(section))
  } catch (e) {
    console.log('Error: Create new section: ' + e)
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

export const selectLambnoteId = (state: RootState) => {
  return state.note.lambnoteId ?? ''
}
export const selectSectionList = (state: RootState) => state.note.sections

export const selectPageList = (state: RootState) => state.note.pages

export const selectPageContent = (state: RootState): PageInfo => state.note.page

export default noteSlice.reducer
