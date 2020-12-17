import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectNote } from 'features/notes/noteSlice'
import { fetchSectionsData, selectSections } from 'features/sections/sectionsSlice'
import { fetchPagesData } from '../pages/pagesSlice'

export const SectionsList: React.FC = () => {
  const dispatch = useDispatch()
  const { lambnoteId } = useSelector(selectNote)
  const { sections } = useSelector(selectSections)

  useEffect(() => {
    if (lambnoteId) {
      dispatch(fetchSectionsData(lambnoteId))
    }
  }, [lambnoteId])

  const handleSection = (id: string | undefined) => {
    if (id) {
      dispatch(fetchPagesData(id))
    }
  }

  return (
    <div className="section-list">
      <h2>セクション</h2>
      <ul>
        {sections.map(({ id, displayName }) => {
          return (
            <li>
              <a href="#" onClick={() => handleSection(id)}>
                {displayName}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
