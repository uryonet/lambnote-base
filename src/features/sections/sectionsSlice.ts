import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import { RootState } from 'app/rootReducer'
import graphService from 'lib/graph/GraphService'
import { OnenoteSection } from '@microsoft/microsoft-graph-types'

interface SectionInfo {
  currentSectionId: string | undefined
  currentSectionName: string | undefined
}

type SectionsState = {
  isLoading: boolean
  error: string | null
  sections: OnenoteSection[]
} & SectionInfo

const initialState: SectionsState = {
  isLoading: false,
  error: null,
  currentSectionId: undefined,
  currentSectionName: undefined,
  sections: []
}

const loadingStarted = (state: SectionsState) => {
  state.isLoading = true
}

const loadingFailed = (state: SectionsState, action: PayloadAction<string>) => {
  state.isLoading = false
  state.error = action.payload
  state.currentSectionId = undefined
  state.currentSectionName = undefined
  state.sections = []
}

export const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    startLoading: loadingStarted,
    failureLoading: loadingFailed,
    setCurrentSectionInfo: (state, action: PayloadAction<SectionInfo>) => {
      const { currentSectionId, currentSectionName } = action.payload
      state.error = null
      state.currentSectionId = currentSectionId
      state.currentSectionName = currentSectionName
    },
    setSectionsData: (state, action: PayloadAction<OnenoteSection[]>) => {
      state.isLoading = false
      state.error = null
      state.sections = action.payload
    },
    setNewSection: (state, action: PayloadAction<OnenoteSection>) => {
      state.isLoading = false
      state.error = null
      state.sections.push(action.payload)
    },
    setChangedSectionName: (state, action: PayloadAction<SectionInfo>) => {
      const { currentSectionId, currentSectionName } = action.payload
      state.isLoading = false
      state.error = null
      state.sections = state.sections.map((s) => {
        if (s.id === currentSectionId) {
          s.displayName = currentSectionName
        }
        return s
      })
    },
    setDelSection: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = null
      state.sections = state.sections.filter((n) => n.id !== action.payload)
    }
  }
})

export const {
  startLoading,
  failureLoading,
  setCurrentSectionInfo,
  setSectionsData,
  setNewSection,
  setChangedSectionName,
  setDelSection
} = sectionsSlice.actions
export default sectionsSlice.reducer

export const selectSections = (state: RootState) => state.sections

export const fetchSectionsData = (lambnoteId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading())
    const sections = await graphService.getSectionsList(lambnoteId)
    console.log('Sections: ')
    console.log(sections)
    dispatch(setSectionsData(sections))
  } catch (e) {
    dispatch(failureLoading(e.toString()))
  }
}

export const createNewSection = (lambnoteId: string | undefined, sectionName: string): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading())
    if (lambnoteId === undefined) {
      throw new Error('lambnoteId is undefined')
    }
    const newSection = await graphService.createNewSection(lambnoteId, sectionName)
    console.log(newSection)
    dispatch(setNewSection(newSection))
  } catch (e) {
    dispatch(failureLoading(e.toString()))
  }
}

export const changeSectionName = (sectionId: string | undefined, sectionName: string): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading())
    if (sectionId === undefined) {
      throw new Error('sectionId is undefined')
    }
    await graphService.changeSectionName(sectionId, sectionName)
    dispatch(setChangedSectionName({ currentSectionId: sectionId, currentSectionName: sectionName }))
  } catch (e) {
    dispatch(failureLoading(e.toString()))
  }
}

export const deleteSection = (sectionId: string | undefined): AppThunk => async (dispatch) => {
  try {
    dispatch(startLoading())
    if (sectionId === undefined) {
      throw new Error('sectionId is undefined')
    }
    await graphService.deleteSection(sectionId)
    dispatch(setDelSection(sectionId))
  } catch (e) {
    dispatch(failureLoading(e.toString()))
  }
}
