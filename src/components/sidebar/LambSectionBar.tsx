import React from 'react'
import { Nav, INavLinkGroup, INavLink } from '@fluentui/react'
import { sidebarStyles } from './SidebarStyle'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPageData, selectSectionList } from '../../features/notes/noteSlice'

export const LambSectionBar: React.FC = () => {
  const dispatch = useDispatch()

  const sectionList = useSelector(selectSectionList)
  const navLinkGroups = (): INavLinkGroup[] => {
    const navList: INavLink[] = []
    sectionList.forEach((section) => {
      navList.push({
        name: section.displayName ?? '',
        url: '',
        onClick: () => dispatch(fetchPageData(section.id ?? ''))
      })
    })
    return [{ links: navList }]
  }

  return (
    <div className="lamb-sectionbar">
      <Nav groups={navLinkGroups()} styles={sidebarStyles} />
    </div>
  )
}
