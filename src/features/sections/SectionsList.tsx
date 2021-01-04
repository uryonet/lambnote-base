import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectNote } from 'features/notes/noteSlice'
import {
  setCurrentSectionInfo,
  selectSections,
  fetchSectionsData,
  createNewSection,
  changeSectionName,
  deleteSection
} from 'features/sections/sectionsSlice'
import { fetchPagesData } from '../pages/pagesSlice'

import { Button } from 'react-bootstrap'

export const SectionsList: React.FC = () => {
  const dispatch = useDispatch()
  const { lambnoteId } = useSelector(selectNote)
  const { isLoading, sections } = useSelector(selectSections)
  const [sectionName, setSectionName] = useState('')

  useEffect(() => {
    if (lambnoteId) {
      dispatch(fetchSectionsData(lambnoteId))
    }
  }, [lambnoteId])

  const onChangeNewSection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSectionName(event.target.value)
  }

  const handleCreateSection = () => {
    dispatch(createNewSection(lambnoteId, sectionName))
    setSectionName('')
  }

  const handleSection = (id: string | undefined, name: string | null | undefined) => {
    if (id && name) {
      dispatch(setCurrentSectionInfo({ currentSectionId: id, currentSectionName: name }))
      dispatch(fetchPagesData(id))
    }
  }

  const handleChangeSectionName = (id: string | undefined, name: string | null | undefined) => {
    if (id && name) {
      dispatch(changeSectionName(id, name))
    }
  }

  const handleDelSection = (id: string | undefined) => {
    const result = window.confirm('セクションを削除します')
    if (result && id) {
      dispatch(deleteSection(id))
    }
  }

  return (
    <div className="sections-list">
      <h2>セクション</h2>
      <div className="create-section">
        <input value={sectionName} onChange={onChangeNewSection} />
        <Button disabled={isLoading} onClick={handleCreateSection}>
          {isLoading ? 'Loading...' : 'セクション作成'}
        </Button>
      </div>
      <ul>
        {sections.map(({ id, displayName }) => {
          return (
            <li>
              <a href="#" onClick={() => handleSection(id, displayName)}>
                {displayName}
              </a>
              <Button
                variant="warning"
                size="sm"
                className="listBtn"
                onClick={() => handleChangeSectionName(id, sectionName)}
              >
                r
              </Button>
              <Button variant="danger" size="sm" className="listBtn" onClick={() => handleDelSection(id)}>
                x
              </Button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
