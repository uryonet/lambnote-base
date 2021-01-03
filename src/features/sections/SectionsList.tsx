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

export const SectionsList: React.FC = () => {
  const dispatch = useDispatch()
  const { lambnoteId } = useSelector(selectNote)
  const { sections } = useSelector(selectSections)
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
        <button onClick={handleCreateSection}>セクション作成</button>
      </div>
      <ul>
        {sections.map(({ id, displayName }) => {
          return (
            <li>
              <a href="#" onClick={() => handleSection(id, displayName)}>
                {displayName}
              </a>
              <button className="listBtn" onClick={() => handleChangeSectionName(id, sectionName)}>
                r
              </button>
              <button className="listBtn" onClick={() => handleDelSection(id)}>
                x
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
