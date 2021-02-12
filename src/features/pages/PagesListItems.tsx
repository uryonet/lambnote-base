import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectPages } from './pagesSlice'
import { fetchPageData, selectPage } from './pageSlice'

export const PagesListItem: React.FC = () => {
  const dispatch = useDispatch()
  const { pages } = useSelector(selectPages)
  const { currentPageId } = useSelector(selectPage)

  const handlePage = (id: string | undefined) => {
    if (id) {
      dispatch(fetchPageData(id))
    }
  }

  return (
    <ul className="list-items">
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
