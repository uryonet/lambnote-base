import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPageData, selectPages } from './pagesSlice'

export const PagesList: React.FC = () => {
  const dispatch = useDispatch()
  const { pages } = useSelector(selectPages)

  const handlePage = (id: string | undefined) => {
    if (id) {
      dispatch(fetchPageData(id))
    }
  }

  return (
    <div className="pages-list">
      <h2>ページ</h2>
      <ul>
        {pages.map(({ id, title }) => {
          return (
            <li>
              <a href="#" onClick={() => handlePage(id)}>
                {title}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
