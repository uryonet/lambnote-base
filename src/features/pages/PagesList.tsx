import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewPage, fetchPageData, selectPages, deletePage } from './pagesSlice'
import { selectSections } from '../sections/sectionsSlice'

import { Button, Form } from 'react-bootstrap'

export const PagesList: React.FC = () => {
  const dispatch = useDispatch()
  const { currentSectionId } = useSelector(selectSections)
  const { isLoading, pages } = useSelector(selectPages)
  const [pageName, setPageName] = useState('')

  const onChangeNewPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(event.target.value)
  }

  const handleCreatePage = () => {
    dispatch(createNewPage(currentSectionId, pageName))
    setPageName('')
  }

  const handlePage = (id: string | undefined) => {
    if (id) {
      dispatch(fetchPageData(id))
    }
  }

  const handleDelPage = (id: string | undefined) => {
    const result = window.confirm('ページを削除します')
    if (result && id) {
      dispatch(deletePage(id))
    }
  }

  return (
    <div className="pages-list">
      <h2>ページ</h2>
      <div className="create-page">
        <Form>
          <Form.Group controlId="formCreatePage">
            <Form.Control value={pageName} onChange={onChangeNewPage} />
            <Button disabled={isLoading} onClick={handleCreatePage}>
              {isLoading ? 'Loading...' : 'ページ作成'}
            </Button>
          </Form.Group>
        </Form>
      </div>
      <ul>
        {pages.map(({ id, title }) => {
          return (
            <li>
              <a href="#" onClick={() => handlePage(id)}>
                {title}
              </a>
              <Button variant="danger" size="sm" className="listBtn" onClick={() => handleDelPage(id)}>
                x
              </Button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
