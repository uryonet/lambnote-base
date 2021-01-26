import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import graphService from 'lib/graph/GraphService'
import { setPagesTitle } from './pagesSlice'
import { RootState } from '../../app/rootReducer'

export interface PageInfo {
  currentPageId: string
  currentPageTitle: string
  currentPageBody: string
  currentDivId: string | undefined
}

type PageState = {
  isLoading: boolean
  error: string | null
} & PageInfo

const initialState: PageState = {
  isLoading: false,
  error: null,
  currentPageId: '',
  currentPageTitle: '',
  currentPageBody: '',
  currentDivId: undefined
}

export interface UpdateContent {
  target: string
  action: string
  content: string
}

const loadingStarted = (state: PageState) => {
  state.isLoading = true
}

const loadingFailed = (state: PageState, action: PayloadAction<string>) => {
  state.isLoading = false
  state.error = action.payload
  state.currentPageId = ''
  state.currentPageTitle = ''
  state.currentPageBody = ''
  state.currentDivId = undefined
}

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    startLoading: loadingStarted,
    failureLoading: loadingFailed,
    setPageData: (state, action: PayloadAction<PageInfo>) => {
      const { currentPageId, currentPageTitle, currentPageBody, currentDivId } = action.payload
      console.log('タイトル: ')
      console.log(currentPageTitle)
      console.log('ボディ: ')
      console.log(currentPageBody)
      state.isLoading = false
      state.error = null
      state.currentPageId = currentPageId
      state.currentPageTitle = currentPageTitle
      state.currentPageBody = currentPageBody
      state.currentDivId = currentDivId
    },
    setPageTitle: (state, action: PayloadAction<PageInfo>) => {
      const { currentPageTitle } = action.payload
      state.currentPageTitle = currentPageTitle
    }
  }
})

export const { startLoading, failureLoading, setPageData, setPageTitle } = pageSlice.actions
export default pageSlice.reducer

export const selectPage = (state: RootState) => state.page

export const fetchPageData = (pageId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading())
    const page = await graphService.getPage(pageId)
    console.log(page)
    const { title, body } = new DOMParser().parseFromString(page, 'text/html')
    console.log('ページのコンテンツ解析用：')
    let divId: string | undefined = undefined
    const divEl = body.firstElementChild
    console.log(body.firstElementChild)
    if (divEl) {
      if (divEl.getAttribute('data-id') === '_default') {
        divId = divEl.id
      }
    }
    const payload: PageInfo = {
      currentPageId: pageId,
      currentPageTitle: title,
      currentPageBody: body.innerHTML,
      currentDivId: divId
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
    await graphService.updatePageContent(pageId, stream)
    const pageInfo: PageInfo = {
      currentPageId: pageId,
      currentPageTitle: title,
      currentPageBody: '',
      currentDivId: undefined
    }
    dispatch(setPageTitle(pageInfo))
    dispatch(setPagesTitle(pageInfo))
    dispatch(fetchPageData(pageId))
  } catch (e) {
    console.log(e)
  }
}

export const updatePageContent = (pageId: string, divId: string | undefined, body: string): AppThunk => async (
  dispatch
) => {
  try {
    dispatch(startLoading())
    let stream: UpdateContent[]
    if (divId) {
      stream = [
        {
          target: divId,
          action: 'replace',
          content: body
        }
      ]
    } else {
      stream = [
        {
          target: 'body',
          action: 'append',
          content: body
        }
      ]
    }
    await graphService.updatePageContent(pageId, stream)
    dispatch(fetchPageData(pageId))
  } catch (e) {
    console.log(e)
  }
}
