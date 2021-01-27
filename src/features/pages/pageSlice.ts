import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import graphService from 'lib/graph/GraphService'
import { setPagesTitle } from './pagesSlice'
import { RootState } from '../../app/rootReducer'

export interface PageTitleInfo {
  currentPageId: string
  currentPageTitle: string
}

export type PageInfo = {
  currentPageBody: string
  currentDivId: string | undefined
} & PageTitleInfo

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
    }
  }
})

export const { startLoading, failureLoading, setPageData } = pageSlice.actions
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

export const updatePageData = (
  pageId: string,
  title: string,
  divId: string | undefined,
  body: string
): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(startLoading())
    let stream: UpdateContent[] = []
    //更新後タイトルと更新前タイトルの値を比較
    const { currentPageTitle, currentPageBody } = getState().page
    if (title !== currentPageTitle) {
      stream.push({
        target: 'title',
        action: 'replace',
        content: title
      })
      dispatch(
        setPagesTitle({
          currentPageId: pageId,
          currentPageTitle: title
        })
      )
    }
    //更新後ボディと更新前ボディの値を比較
    if (body !== currentPageBody) {
      if (divId) {
        stream.push({
          target: divId,
          action: 'replace',
          content: body
        })
      } else {
        stream.push({
          target: 'body',
          action: 'append',
          content: body
        })
      }
    }
    if (stream.length) {
      await graphService.updatePageContent(pageId, stream)
    }
    dispatch(fetchPageData(pageId))
  } catch (e) {
    console.log(e)
  }
}
