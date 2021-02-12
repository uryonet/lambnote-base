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

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog'

export const SectionsList: React.FC = () => {
  const dispatch = useDispatch()
  const { lambnoteId } = useSelector(selectNote)
  const { currentSectionId, currentSectionName, sections } = useSelector(selectSections)
  const [newSectionName, setNewSectionName] = useState('')
  const [renewSectionName, setRenewSectionName] = useState('')
  const [newSectionDialog, setNewSectionDialog] = useState(false)

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
    setNewSectionDialog(false)
  }

  const handleSection = (id: string | undefined, name: string | null | undefined) => {
    if (id && name) {
      dispatch(setCurrentSectionInfo({ currentSectionId: id, currentSectionName: name }))
      dispatch(fetchPagesData(id))
    }
  }

  const handleChangeSectionName = () => {
    if (currentSectionId && renewSectionName) {
      dispatch(changeSectionName(currentSectionId, renewSectionName))
    }
  }

  const handleDelSection = () => {
    const result = window.confirm('セクションを削除します')
    if (result && currentSectionId) {
      dispatch(deleteSection(currentSectionId))
    }
  }

  return (
    <div className="sections-list">
      <div className="section-hedaer">
        <span>セクション</span>
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-button-text"
          onClick={() => setNewSectionDialog(true)}
        />
      </div>
      <ul>
        {sections.map(({ id, displayName }) => {
          return (
            <li key={id} className={id === currentSectionId ? 'selected' : ''}>
              <a href="#" onClick={() => handleSection(id, displayName)}>
                {displayName}
              </a>
            </li>
          )
        })}
      </ul>
      <div className="p-field p-inputgroup">
        <InputText value={renewSectionName} onChange={onChangeRenewSection} />
        <Button className="p-button-warning" label="変更" onClick={handleChangeSectionName} />
      </div>
      <div className="p-field">
        <Button className="p-button-danger l-btn-block" label="削除" onClick={handleDelSection} />
      </div>

      <Dialog header="新規セクション作成" visible={newSectionDialog} onHide={() => setNewSectionDialog(false)}>
        <div className="p-formgroup-inline">
          <div className="p-field">
            <InputText value={newSectionName} onChange={onChangeNewSection} />
          </div>
          <Button label="作成" onClick={handleCreateSection} />
        </div>
      </Dialog>
    </div>
  )
}
