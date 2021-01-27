import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewPage, deletePage } from './pagesSlice'
import { selectPage } from './pageSlice'
import { selectSections } from '../sections/sectionsSlice'

import { PagesListItem } from './PagesListItems'

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'

export const PagesList: React.FC = () => {
  const dispatch = useDispatch()
  const { currentSectionId } = useSelector(selectSections)
  const { currentPageId } = useSelector(selectPage)
  const [pageName, setPageName] = useState('')

  const onChangeNewPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(event.target.value)
  }

  const handleCreatePage = () => {
    dispatch(createNewPage(currentSectionId, pageName))
    setPageName('')
  }

  const handleDelPage = () => {
    const result = window.confirm('ページを削除します')
    if (result && currentPageId) {
      dispatch(deletePage(currentPageId))
    }
  }

  return (
    <div className="pages-list">
      <h3>ページ</h3>
      <PagesListItem />
      <div className="p-field p-inputgroup">
        <InputText value={pageName} onChange={onChangeNewPage} />
        <Button label="作成" onClick={handleCreatePage} />
      </div>
      <div className="p-field">
        <Button className="p-button-danger l-btn-block" label="削除" onClick={handleDelPage} />
      </div>
    </div>
  )
}
