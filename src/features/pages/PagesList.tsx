import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewPage } from './pagesSlice'
import { selectSections } from '../sections/sectionsSlice'

import { Button, FormControl, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { PagesListItem } from './PagesListItems'

export const PagesList: React.FC = () => {
  const dispatch = useDispatch()
  const { currentSectionId } = useSelector(selectSections)
  const [pageName, setPageName] = useState('')
  const [isShowForm, setIsShowFrom] = useState(false)

  const onChangeNewPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(event.target.value)
  }

  const handleCreatePage = () => {
    dispatch(createNewPage(currentSectionId, pageName))
    setPageName('')
    setIsShowFrom(!isShowForm)
  }

  const showForm = () => {
    setIsShowFrom(!isShowForm)
  }

  return (
    <div className="pages-list">
      <h5 className="sidebar-nav-title">
        ページ
        <a className="action-link" onClick={showForm}>
          <FontAwesomeIcon icon={faPlus} />
        </a>
      </h5>
      <div className={isShowForm ? '' : 'd-none'}>
        <InputGroup className="create-form" size="sm">
          <FormControl value={pageName} onChange={onChangeNewPage} />
          <InputGroup.Append>
            <Button onClick={handleCreatePage}>作成</Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
      <PagesListItem />
    </div>
  )
}
