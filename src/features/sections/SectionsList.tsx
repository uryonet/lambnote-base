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

import { Button, FormControl, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'

export const SectionsList: React.FC = () => {
  const dispatch = useDispatch()
  const { lambnoteId } = useSelector(selectNote)
  const { currentSectionId, sections } = useSelector(selectSections)
  const [sectionName, setSectionName] = useState('')
  const [isShowForm, setIsShowForm] = useState(false)

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
    setIsShowForm(!isShowForm)
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

  const showForm = () => {
    setIsShowForm(!isShowForm)
  }

  return (
    <div className="sections-list">
      <h5 className="sidebar-nav-title">
        セクション
        <a className="action-link" onClick={showForm}>
          <FontAwesomeIcon icon={faPlus} />
        </a>
      </h5>
      <div className={isShowForm ? '' : 'd-none'}>
        <InputGroup className="create-form" size="sm">
          <FormControl value={sectionName} onChange={onChangeNewSection} />
          <InputGroup.Append>
            <Button onClick={handleCreateSection}>作成</Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
      <ul>
        {sections.map(({ id, displayName }) => {
          return (
            <li key={id} className={id === currentSectionId ? 'selected' : ''}>
              <a href="#" onClick={() => handleSection(id, displayName)}>
                {displayName}
              </a>
              {/*<Button*/}
              {/*  variant="warning"*/}
              {/*  size="sm"*/}
              {/*  className="listBtn"*/}
              {/*  onClick={() => handleChangeSectionName(id, sectionName)}*/}
              {/*>*/}
              {/*  r*/}
              {/*</Button>*/}
              {/*<Button variant="danger" size="sm" className="listBtn" onClick={() => handleDelSection(id)}>*/}
              {/*  x*/}
              {/*</Button>*/}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
