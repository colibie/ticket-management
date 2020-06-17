import React, { useState } from "react";
// import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";

import { useAuth } from "../../../../context/auth";

const UserActions = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const { setAuthTokens } = useAuth();

  function logOut() {
    setAuthTokens(null);
  };

  function toggleUserActions() {
    setIsVisible(!isVisible);
  };

   return (
      <NavItem tag={Dropdown} caret toggle={toggleUserActions}>
        <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
          <img
            className="user-avatar rounded-circle mr-2"
            src={require("./../../../../images/content-management/15.jpeg")}
            alt="User Avatar"
          />{" "}
          <span className="d-none d-md-inline-block">Admin</span>
        </DropdownToggle>
        <Collapse tag={DropdownMenu} right small open={isVisible}>
          {/* <DropdownItem tag={Link} to="user-profile">
            <i className="material-icons">&#xE7FD;</i> Profile
          </DropdownItem>
          <DropdownItem tag={Link} to="edit-user-profile">
            <i className="material-icons">&#xE8B8;</i> Edit Profile
          </DropdownItem>
          <DropdownItem tag={Link} to="file-manager-list">
            <i className="material-icons">&#xE2C7;</i> Files
          </DropdownItem>
          <DropdownItem tag={Link} to="transaction-history">
            <i className="material-icons">&#xE896;</i> Transactions
          </DropdownItem>
          <DropdownItem divider /> */}
          <DropdownItem className="text-danger" onClick={logOut}>
            <i className="material-icons text-danger">&#xE879;</i> Logout
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }

  export default UserActions;
