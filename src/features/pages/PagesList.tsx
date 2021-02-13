import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewPage, deletePage } from './pagesSlice'
import { selectPage } from './pageSlice'
import { selectSections } from '../sections/sectionsSlice'

import { PagesListItem } from './PagesListItems'

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog'
import { Menu } from 'primereact/menu'

export const PagesList: React.FC = () => {
  const dispatch = useDispatch()
  const { currentSectionId } = useSelector(selectSections)
  const { currentPageId } = useSelector(selectPage)
  const [pageName, setPageName] = useState('')
  const [newPageDialog, setNewPageDialog] = useState(false)
  const cm = useRef(null)
  const pageMenuItems = [
    {
      label: '新規作成',
      command: () => {
        setNewPageDialog(true)
      }
    },
    {
      label: '削除',
      command: () => {
        handleDelPage()
      }
    }
  ]

  const onChangeNewPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(event.target.value)
  }

  const handleCreatePage = () => {
    setNewPageDialog(false)
    dispatch(createNewPage(currentSectionId, pageName))
    setPageName('')
  }

  const handleDelPage = () => {
    const result = window.confirm('ページを削除します')
    if (result && currentPageId) {
      dispatch(deletePage(currentPageId))
    }
  }

  return (
    <div className="pages-list">
      <div className="page-header">
        <span>ページ</span>
        <Button
          icon="pi pi-ellipsis-h"
          className="p-button-rounded p-button-text"
          // @ts-ignore
          onClick={(event) => cm.current.toggle(event)}
        />
      </div>
      <PagesListItem />

      <Dialog header="新規ページ作成" visible={newPageDialog} onHide={() => setNewPageDialog(false)}>
        <div className="p-formgroup-inline p-mt-3">
          <div className="p-field">
            <InputText value={pageName} onChange={onChangeNewPage} />
          </div>
          <Button label="作成" onClick={handleCreatePage} />
        </div>
      </Dialog>

      <Menu model={pageMenuItems} popup ref={cm} />
    </div>
  )
}
