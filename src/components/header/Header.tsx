import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from 'features/users/userSlice'
import * as authService from 'lib/graph/AuthService'
import { Button, Navbar, NavbarBrand, Nav } from 'react-bootstrap'
import NavbarCollapse from 'react-bootstrap/NavbarCollapse'

export const Header: React.FC = () => {
  const { displayName, email } = useSelector(selectUser)

  const handleSignOut = () => {
    authService.signOut()
  }

  return (
    <Navbar bg="info" variant="dark">
      <NavbarBrand>LambNote</NavbarBrand>
      <NavbarCollapse className="justify-content-end">
        <Nav>
          <Nav.Link>{displayName}</Nav.Link>
          <Nav.Link>{email}</Nav.Link>
        </Nav>
        <Button variant="danger" onClick={handleSignOut}>サインアウト</Button>
      </NavbarCollapse>
    </Navbar>
  )
}
