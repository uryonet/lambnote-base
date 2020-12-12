import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSectionsData, selectSections } from 'features/sections/sectionsSlice'
import { selectNote } from 'features/notes/noteSlice'

import { Nav, INavLinkGroup, INavLink } from '@fluentui/react'
import { sidebarStyles } from '../../components/sidebar/SidebarStyle'

export const SectionsList: React.FC = () => {
  const dispatch = useDispatch()
  const { lambnoteId } = useSelector(selectNote)
  const { sections } = useSelector(selectSections)

  useEffect(() => {
    if (lambnoteId) {
      dispatch(fetchSectionsData(lambnoteId))
    }
  }, [lambnoteId])

  const navLinkGroups = (): INavLinkGroup[] => {
    const navList: INavLink[] = []
    sections.forEach(section => {
      navList.push({
        name: section.displayName ?? '',
        url: ''
        // onClick: () => dispatch(fetchPageData(section.id ?? ''))
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
