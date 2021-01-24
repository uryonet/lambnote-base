import React, { useState } from 'react'
import { UserInfo } from './UserInfo'
import { SectionsList } from '../features/sections/SectionsList'
import { PagesList } from '../features/pages/PagesList'

import { Button } from 'primereact/button'
import { Sidebar } from 'primereact/sidebar'

export const BottomMenu: React.FC = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <div className="bottombar p-d-md-none p-d-flex">
        <Button className="p-button-info" label="Menu" icon="pi pi-bars" onClick={() => setVisible(true)} />
      </div>
      <Sidebar visible={visible} fullScreen onHide={() => setVisible(false)}>
        <div className="sidebar">
          <UserInfo />
          <div className="content-list">
            <SectionsList />
            <PagesList />
          </div>
        </div>
      </Sidebar>
    </>
  )
}
