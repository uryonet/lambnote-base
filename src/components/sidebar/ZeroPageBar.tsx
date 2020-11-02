import React from 'react'
import { Nav, INavLinkGroup, INavLink } from '@fluentui/react'
import { sidebarStyles } from './SidebarStyle'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPageContent, selectPageList } from '../../store/NoteSlice'
import { AppDispatch } from '../../store/store'

export const ZeroPageBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()

  const pageList = useSelector(selectPageList)
  const navLinkGroups = (): INavLinkGroup[] => {
    const navList: INavLink[] = []
    pageList.forEach((page) => {
      navList.push({
        name: page.title ?? '',
        url: '',
        onClick: () => dispatch(fetchPageContent({ pageId: page.id ?? '' }))
      })
    })
    return [{ links: navList }]
  }

  return (
    <div className="zero-pagebar">
      <Nav groups={navLinkGroups()} styles={sidebarStyles} />
    </div>
  )
}
