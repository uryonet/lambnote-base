import React from 'react'
import { SectionsList } from '../features/sections/SectionsList'
import { PagesList } from '../features/pages/PagesList'

export const Sidebar: React.FC = () => {
  return (
    <nav id="sidebar" className="sidebar">
      <header className="logo d-none d-md-block">LambNote</header>
      <div className="content-list">
        <SectionsList />
        <PagesList />
      </div>
    </nav>
  )
}
