import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewPage, fetchPageData, selectPages } from './pagesSlice'
import { selectSections } from '../sections/sectionsSlice'

export const PagesList: React.FC = () => {
  const dispatch = useDispatch()
  const { currentSectionId } = useSelector(selectSections)
  const { pages } = useSelector(selectPages)
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

  return (
    <div className="pages-list">
      <h2>ページ</h2>
      <div className="create-page">
        <input value={pageName} onChange={onChangeNewPage} />
        <button onClick={handleCreatePage}>ページ作成</button>
      </div>
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
