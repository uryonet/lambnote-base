import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import { RootState } from 'app/rootReducer'
import graphService from 'lib/graph/GraphService'
import { OnenotePage } from '@microsoft/microsoft-graph-types'

interface PageInfo {
  currentPageId: string
  currentPageTitle: string
  currentPageRaw: string
}

interface PagesInfo {
  pages: OnenotePage[]
}

type PagesState = {
  isLoading: boolean
  error: string | null
} & PagesInfo & PageInfo

const initialState: PagesState = {
  isLoading: false,
  error: null,
  pages: [],
  currentPageId: '',
  currentPageTitle: '',
  currentPageRaw: ''
}

export interface UpdateContent {
  target: string
  action: string
  content: string
}

const loadingStarted = (state: PagesState) => {
  state.isLoading = true
}

const loadingFailed = (state: PagesState, action: PayloadAction<string>) => {
  state.isLoading = false
  state.error = action.payload
  state.pages = []
  state.currentPageId = ''
  state.currentPageTitle = ''
  state.currentPageRaw = ''
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
    setPageData: (state, action: PayloadAction<PageInfo>) => {
      const { currentPageId, currentPageTitle, currentPageRaw } = action.payload
      state.isLoading = false
      state.error = null
      state.currentPageId = currentPageId
      state.currentPageTitle = currentPageTitle
      state.currentPageRaw = currentPageRaw
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.currentPageTitle = action.payload
    }
  }
})

export const { startLoading, failureLoading, setPagesData, setPageData, setPageTitle } = pagesSlice.actions
export default pagesSlice.reducer

export const selectPages = (state: RootState) => state.pages

export const fetchPagesData = (sectionId: string): AppThunk => async dispatch => {
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

export const fetchPageData = (pageId: string): AppThunk => async dispatch => {
  try {
    dispatch(startLoading())
    const page = await graphService.getPage(pageId)
    const { title } = new DOMParser().parseFromString(page, 'text/html')
    console.log(page)
    const payload: PageInfo = {
      currentPageId: pageId,
      currentPageTitle: title,
      currentPageRaw: page
    }
    dispatch(setPageData(payload))
  } catch (e) {
    dispatch(failureLoading(e.toString()))
  }
}

export const updatePageTitle = (
  pageId: string,
  title: string
): AppThunk => async dispatch => {
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
