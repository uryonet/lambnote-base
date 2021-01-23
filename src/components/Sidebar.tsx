import React from 'react'
import { SectionsList } from '../features/sections/SectionsList'
import { PagesList } from '../features/pages/PagesList'
import { UserInfo } from './UserInfo'

export const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <UserInfo />
      <div className="content-list">
        <SectionsList />
        <PagesList />
      </div>
    </div>
  )
}
