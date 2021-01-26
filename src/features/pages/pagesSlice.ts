import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import { RootState } from 'app/rootReducer'
import graphService from 'lib/graph/GraphService'
import { OnenotePage } from '@microsoft/microsoft-graph-types'
import { PageInfo } from './pageSlice'

interface PagesInfo {
  pages: OnenotePage[]
}

type PagesState = {
  isLoading: boolean
  error: string | null
} & PagesInfo

const initialState: PagesState = {
  isLoading: false,
  error: null,
  pages: []
}

const loadingStarted = (state: PagesState) => {
  state.isLoading = true
}

const loadingFailed = (state: PagesState, action: PayloadAction<string>) => {
  state.isLoading = false
  state.error = action.payload
  state.pages = []
}

export const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    startLoading: loadingStarted,
    failureLoading: loadingFailed,
    setPagesData: (state, action: PayloadAction<OnenotePage[]>) => {
      state.isLoading = false
      state.error = null
      state.pages = action.payload
    },
    setPagesTitle: (state, action: PayloadAction<PageInfo>) => {
      const { currentPageId, currentPageTitle } = action.payload
      state.pages = state.pages.map((n) => {
        if (n.id === currentPageId) {
          n.title = currentPageTitle
        }
        return n
      })
    },
    setNewPage: (state, action: PayloadAction<OnenotePage>) => {
      state.isLoading = false
      state.error = null
      state.pages.push(action.payload)
    },
    setDelPage: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = null
      state.pages = state.pages.filter((n) => n.id !== action.payload)
    }
  }
})

export const { startLoading, failureLoading, setPagesData, setPagesTitle, setNewPage, setDelPage } = pagesSlice.actions
export default pagesSlice.reducer

export const selectPages = (state: RootState) => state.pages

export const fetchPagesData = (sectionId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading())
    const pages = await graphService.getPages(sectionId)
    console.log('Pages: ')
    console.log(pages)
    dispatch(setPagesData(pages))
  } catch (e) {
    dispatch(failureLoading(e.toString()))
  }
}

export const createNewPage = (sectionId: string | undefined, pageName: string): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading())
    if (sectionId === undefined) {
      throw new Error('sectionId is undefined')
    }
    const newPage = await graphService.createNewPage(sectionId, pageName)
    console.log(newPage)
    dispatch(setNewPage(newPage))
  } catch (e) {
    dispatch(failureLoading(e.toString()))
  }
}

export const deletePage = (pageId: string | undefined): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading())
    if (pageId === undefined) {
      throw new Error('pageId is undefined')
    }
    await graphService.deletePage(pageId)
    dispatch(setDelPage(pageId))
  } catch (e) {
    dispatch(failureLoading(e.toString()))
  }
}
