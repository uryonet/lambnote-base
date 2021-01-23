import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPageData, selectPages, deletePage } from './pagesSlice'
import { selectSections } from '../sections/sectionsSlice'

import Spinner from 'react-bootstrap/Spinner'

export const PagesListItem: React.FC = () => {
  const dispatch = useDispatch()
  const { currentSectionId } = useSelector(selectSections)
  const { isLoading, pages } = useSelector(selectPages)

  const handlePage = (id: string | undefined) => {
    if (id) {
      dispatch(fetchPageData(id))
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
                {title}
              </a>
            </li>
          )
        })}
      </ul>
    )
  }
}
