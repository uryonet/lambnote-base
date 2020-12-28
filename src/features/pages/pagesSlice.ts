import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import { RootState } from 'app/rootReducer'
import graphService from 'lib/graph/GraphService'
import { OnenotePage } from '@microsoft/microsoft-graph-types'

interface PageInfo {
  currentPageId: string
  currentPageTitle: string
  currentPageBody: string
}

interface PagesInfo {
  pages: OnenotePage[]
}

type PagesState = {
  isLoading: boolean
  error: string | null
} & PagesInfo &
  PageInfo

const initialState: PagesState = {
  isLoading: false,
  error: null,
  pages: [],
  currentPageId: '',
  currentPageTitle: '',
  currentPageBody: ''
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
  state.currentPageBody = ''
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
      const { currentPageId, currentPageTitle, currentPageBody } = action.payload
      console.log('タイトル: ')
      console.log(currentPageTitle)
      console.log('ボディ: ')
      console.log(currentPageBody)
      state.isLoading = false
      state.error = null
      state.currentPageId = currentPageId
      state.currentPageTitle = currentPageTitle
      state.currentPageBody = currentPageBody
    },
    setPageTitle: (state, action: PayloadAction<PageInfo>) => {
      const { currentPageId, currentPageTitle } = action.payload
      state.currentPageTitle = currentPageTitle
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

export const {
  startLoading,
  failureLoading,
  setPagesData,
  setPageData,
  setPageTitle,
  setNewPage,
  setDelPage
} = pagesSlice.actions
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

export const fetchPageData = (pageId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading())
    const page = await graphService.getPage(pageId)
    const { title, body } = new DOMParser().parseFromString(page, 'text/html')
    const payload: PageInfo = {
      currentPageId: pageId,
      currentPageTitle: title,
      currentPageBody: body.innerHTML
    }
    dispatch(setPageData(payload))
  } catch (e) {
    dispatch(failureLoading(e.toString()))
  }
}

export const updatePageTitle = (pageId: string, title: string): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading())
    const stream: UpdateContent[] = [
      {
        target: 'title',
        action: 'replace',
        content: title
      }
    ]
    await graphService.updatePageTitle(pageId, stream)
    dispatch(setPageTitle({ currentPageId: pageId, currentPageTitle: title, currentPageBody: '' }))
  } catch (e) {
    console.log(e)
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
