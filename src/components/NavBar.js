import React from "react"
import { Navbar, NavbarBrand } from "reactstrap"

const NavBar = props => {
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand
          className="nav-brand"
          onClick={() => {
            props.setPage(0)
          }}
        >
          Restaurant Name
        </NavbarBrand>
      </Navbar>
    </div>
  )
}

export default NavBar
