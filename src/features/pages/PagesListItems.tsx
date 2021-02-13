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

  const handleContextMenu = (event: React.MouseEvent<HTMLAnchorElement>, id: string | undefined, name: string | null | undefined) => {
    
  }


  return (
    <ul className="list-items">
      {pages.map(({ id, title }) => {
        return (
          <li key={id} className={id === currentPageId ? 'selected' : ''}>
            <a href="#" onClick={() => handlePage(id)} onContextMenu={(event) => handleContextMenu}>
              {title}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
