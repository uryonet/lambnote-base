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
import { faFolder } from '@fortawesome/free-solid-svg-icons/faFolder'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV'

export const SectionsList: React.FC = () => {
  const dispatch = useDispatch()
  const { lambnoteId } = useSelector(selectNote)
  const { currentSectionId, currentSectionName, sections } = useSelector(selectSections)
  const [newSectionName, setNewSectionName] = useState('')
  const [renewSectionName, setRenewSectionName] = useState('')

  useEffect(() => {
    if (lambnoteId) {
      dispatch(fetchSectionsData(lambnoteId))
    }
  }, [lambnoteId])

  useEffect(() => {
    setRenewSectionName(currentSectionName ?? '')
  }, [currentSectionName])

  const onChangeNewSection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSectionName(event.target.value)
  }

  const onChangeRenewSection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRenewSectionName(event.target.value)
  }

  const handleCreateSection = () => {
    dispatch(createNewSection(lambnoteId, newSectionName))
    setNewSectionName('')
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
      <h5 className="sidebar-nav-title">セクション</h5>
      <ul>
        {sections.map(({ id, displayName }) => {
          return (
            <li key={id} className={id === currentSectionId ? 'selected' : ''}>
              <a href="#" onClick={() => handleSection(id, displayName)}>
                <FontAwesomeIcon icon={faFolder} />
                {displayName}
                <FontAwesomeIcon
                  className={'list-menu ' + id === currentSectionId ? '' : 'd-none'}
                  icon={faEllipsisV}
                />
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
      <div className="create-form">
        <InputGroup className="create-form-item" size="sm">
          <FormControl value={newSectionName} onChange={onChangeNewSection} />
          <InputGroup.Append>
            <Button onClick={handleCreateSection}>作成</Button>
          </InputGroup.Append>
        </InputGroup>
        <InputGroup className="create-form-item" size="sm">
          <FormControl value={renewSectionName} onChange={onChangeRenewSection} />
          <InputGroup.Append>
            <Button onClick={() => handleChangeSectionName(currentSectionId, renewSectionName)}>変更</Button>
          </InputGroup.Append>
        </InputGroup>
        <Button
          className="create-form-item"
          variant="danger"
          size="sm"
          block
          onClick={() => handleDelSection(currentSectionId)}
        >
          削除
        </Button>
      </div>
    </div>
  )
}
