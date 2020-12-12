import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import { RootState } from 'app/rootReducer'
import graphService from 'lib/graph/GraphService'
import { OnenoteSection } from '@microsoft/microsoft-graph-types'

interface SectionsInfo {
  currentSectionId: string | undefined
  sections: OnenoteSection[]
}

type SectionsState = {
  isLoading: boolean
  error: string | null
} & SectionsInfo

const initialState: SectionsState = {
  isLoading: false,
  error: null,
  currentSectionId: undefined,
  sections: []
}

const startLoading = (state: SectionsState) => {
  state.isLoading = true
}

const loadingFailed = (state: SectionsState, action: PayloadAction<string>) => {
  state.isLoading = false
  state.error = action.payload
  state.currentSectionId = undefined
  state.sections = []
}

export const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    startGetSections: startLoading,
    failureGetSections: loadingFailed,
    setCurrentSectionId: (state, action: PayloadAction<string | undefined>) => {
      state.currentSectionId = action.payload
    },
    setSectionsList: (state, action: PayloadAction<OnenoteSection[]>) => {
      state.sections = action.payload
    },
    setNewSection: (state, action: PayloadAction<OnenoteSection>) => {
      state.sections.push(action.payload)
    }
  }
})

export const { startGetSections, failureGetSections, setCurrentSectionId, setSectionsList, setNewSection } = sectionsSlice.actions
export default sectionsSlice.reducer

export const selectSections = (state: RootState) => state.sections

export const fetchSectionsData = (lambnoteId: string): AppThunk => async dispatch => {
  try {
    dispatch(startGetSections())
    const sections = await graphService.getSectionsList(lambnoteId)
    console.log('Sections: ')
    console.log(sections)
    dispatch(setSectionsList(sections))
  } catch (e) {
    dispatch(failureGetSections(e.toString()))
  }
}

export const createNewSection = (
  lambnoteId: string,
  sectionName: string
): AppThunk => async (dispatch) => {
  try {
    const section = await graphService.createNewSection(lambnoteId, sectionName)
    console.log(section)
    dispatch(setNewSection(section))
  } catch (e) {
    console.log('Error: Create new section: ' + e)
  }
}
