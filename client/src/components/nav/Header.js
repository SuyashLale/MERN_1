import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Menu, Badge } from "antd";
import {
  AppstoreOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import { auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import UserActionTypes from "../../reducers/user/user-action-types";
import SearchBox from "../forms/search-box";

const { SubMenu, Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState("home");

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  let dispatch = useDispatch();
  let history = useHistory();
  let { user, cart } = useSelector((state) => ({ ...state }));

  /*
   * Sign the user out from firebase.
   * Dispatch the LOGOUT action to redux to update the store.
   * Redirect the user to the login page.
   */
  const handleLogout = () => {
    auth.signOut();
    dispatch({
      type: UserActionTypes.LOGOUT,
      payload: null,
    });
    history.push("/login");
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Item key="home" icon={<AppstoreOutlined />}>
        <Link to="/">Home</Link>
      </Item>
      <Item key="shop" icon={<ShoppingOutlined />}>
        <Link to="/shop">Shop</Link>
      </Item>
      <Item key="cart" icon={<ShoppingCartOutlined />}>
        <Link to="/cart">
          <Badge count={cart.length} offset={[10, 0]}>
            Cart
          </Badge>
        </Link>
      </Item>
      {!user && (
        <Item key="register" icon={<UserAddOutlined />} className="float-right">
          <Link to="/register">Register</Link>
        </Item>
      )}
      {!user && (
        <Item key="login" icon={<UserOutlined />} className="float-right">
          <Link to="/login">Login</Link>
        </Item>
      )}
      {user && (
        <SubMenu
          key="SubMenu"
          title={`Hello, ${user.email && user.email.split("@")[0]}`}
          className="float-right"
        >
          {user && user.role === "subscriber" && (
            <Item>
              <Link to="/user/history">Dashboard</Link>
            </Item>
          )}
          {user && user.role === "admin" && (
            <Item>
              <Link to="/admin/dashboard">Dashboard</Link>
            </Item>
          )}
          <Item key="setting:1">Option 1</Item>

          <Item icon={<LogoutOutlined />} onClick={handleLogout}>
            Log out
          </Item>
        </SubMenu>
      )}
      <span className="float-right p-1">
        <SearchBox />
      </span>
    </Menu>
  );
};

export default Header;
