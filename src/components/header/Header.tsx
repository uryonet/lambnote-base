import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from 'features/users/userSlice'
import * as authService from 'lib/graph/AuthService'
import { Button, Navbar, NavbarBrand, Nav, Image } from 'react-bootstrap'
import NavbarCollapse from 'react-bootstrap/NavbarCollapse'

export const Header: React.FC = () => {
  const { displayName, email, avatar } = useSelector(selectUser)

  const handleSignOut = () => {
    authService.signOut()
  }

  return (
    <Navbar bg="primary" variant="dark">
      <NavbarBrand>LambNote</NavbarBrand>
      <NavbarCollapse className="justify-content-end">
        <Nav>
          <Nav.Link>{displayName}</Nav.Link>
          <Nav.Link>{email}</Nav.Link>
          <Nav.Link onClick={handleSignOut}>サインアウト</Nav.Link>
        </Nav>
        <Image className="avatar-icon" src={avatar} roundedCircle />
      </NavbarCollapse>
    </Navbar>
  )
}
