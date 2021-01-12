import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewPage, deletePage, selectPages } from './pagesSlice'
import { selectSections } from '../sections/sectionsSlice'

import { Button, FormControl, InputGroup } from 'react-bootstrap'
import { PagesListItem } from './PagesListItems'

export const PagesList: React.FC = () => {
  const dispatch = useDispatch()
  const { currentSectionId } = useSelector(selectSections)
  const { currentPageId } = useSelector(selectPages)
  const [pageName, setPageName] = useState('')

  const onChangeNewPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(event.target.value)
  }

  const handleCreatePage = () => {
    dispatch(createNewPage(currentSectionId, pageName))
    setPageName('')
  }

  const handleDelPage = (id: string | undefined) => {
    const result = window.confirm('ページを削除します')
    if (result && id) {
      dispatch(deletePage(id))
    }
  }

  return (
    <div className="pages-list">
      <h5 className="sidebar-nav-title">ページ</h5>
      <PagesListItem />
      <div className="create-form">
        <InputGroup className="create-form-item" size="sm">
          <FormControl value={pageName} onChange={onChangeNewPage} />
          <InputGroup.Append>
            <Button onClick={handleCreatePage}>作成</Button>
          </InputGroup.Append>
        </InputGroup>
        <Button
          className="create-form-item"
          variant="danger"
          size="sm"
          block
          onClick={() => handleDelPage(currentPageId)}
        >
          削除
        </Button>
      </div>
    </div>
  )
}
