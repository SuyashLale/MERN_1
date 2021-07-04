import React from "react";
import { Link } from "react-router-dom";

const AdminNav = () => (
  <nav>
    <ul className="nav flex-column">
      <li className="nav-item">
        <Link to="/admin/dashboard" className="nav-link">
          Dashboard
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/admin/product" className="nav-link">
          New Product
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/admin/products" className="nav-link">
          All Products
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/admin/category" className="nav-link">
          Categories
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/admin/sub-category" className="nav-link">
          Sub Categories
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/admin/coupon" className="nav-link">
          Coupons
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/user/update-password" className="nav-link">
          Update Password
        </Link>
      </li>
    </ul>
  </nav>
);

export default AdminNav;
