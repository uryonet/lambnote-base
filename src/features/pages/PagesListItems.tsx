import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPageData, selectPages } from './pagesSlice'

export const PagesListItem: React.FC = () => {
  const dispatch = useDispatch()
  const { pages, currentPageId } = useSelector(selectPages)

  const handlePage = (id: string | undefined) => {
    if (id) {
      dispatch(fetchPageData(id))
    }
  }

  return (
    <ul>
      {pages.map(({ id, title }) => {
        return (
          <li key={id} className={id === currentPageId ? 'selected' : ''}>
            <a href="#" onClick={() => handlePage(id)}>
              {title}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
