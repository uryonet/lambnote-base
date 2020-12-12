import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPageData, selectPages } from './pagesSlice'

import { Nav, INavLinkGroup, INavLink } from '@fluentui/react'
import { sidebarStyles } from 'components/sidebar/SidebarStyle'

export const PagesList: React.FC = () => {
  const dispatch = useDispatch()
  const { pages } = useSelector(selectPages)

  const navLinkGroups = (): INavLinkGroup[] => {
    const navList: INavLink[] = []
    pages.forEach((page) => {
      navList.push({
        name: page.title ?? '',
        url: '',
        onClick: () => dispatch(fetchPageData(page.id ?? ''))
      })
    })
    return [{ links: navList }]
  }

  return (
    <div className="lamb-pagebar">
      <Nav groups={navLinkGroups()} styles={sidebarStyles} />
    </div>
  )
}
