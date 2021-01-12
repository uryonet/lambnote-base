import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPageData, selectPages, deletePage } from './pagesSlice'
import { selectSections } from '../sections/sectionsSlice'

import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile'

export const PagesListItem: React.FC = () => {
  const dispatch = useDispatch()
  const { currentSectionId } = useSelector(selectSections)
  const { isLoading, pages } = useSelector(selectPages)

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

  if (isLoading) {
    return (
      <div className="load-spinner">
        <Spinner animation="border" />
      </div>
    )
  } else {
    return (
      <ul>
        {pages.map(({ id, title }) => {
          return (
            <li key={id} className={id === currentSectionId ? 'selected' : ''}>
              <a href="#" onClick={() => handlePage(id)}>
                <FontAwesomeIcon icon={faFile} />
                {title}
              </a>
              {/*<Button variant="danger" size="sm" className="listBtn" onClick={() => handleDelPage(id)}>*/}
              {/*  x*/}
              {/*</Button>*/}
            </li>
          )
        })}
      </ul>
    )
  }
}
