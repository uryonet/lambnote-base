import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewPage, fetchPageData, selectPages, deletePage } from './pagesSlice'
import { selectSections } from '../sections/sectionsSlice'

import { Button, FormControl, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'

export const PagesList: React.FC = () => {
  const dispatch = useDispatch()
  const { currentSectionId } = useSelector(selectSections)
  const { currentPageId, pages } = useSelector(selectPages)
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

  const handlePage = (id: string | undefined) => {
    if (id) {
      dispatch(fetchPageData(id))
    }
  }

  const showForm = () => {
    setIsShowFrom(!isShowForm)
  }

  const handleDelPage = (id: string | undefined) => {
    const result = window.confirm('ページを削除します')
    if (result && id) {
      dispatch(deletePage(id))
    }
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
      <ul>
        {pages.map(({ id, title }) => {
          return (
            <li key={id} className={id === currentSectionId ? 'selected' : ''}>
              <a href="#" onClick={() => handlePage(id)}>
                {title}
              </a>
              {/*<Button variant="danger" size="sm" className="listBtn" onClick={() => handleDelPage(id)}>*/}
              {/*  x*/}
              {/*</Button>*/}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
