import React from "react";
import { Link, useLocation } from "react-router-dom";
import logoLight from '../../../assets/images/logo.png';


const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isCollapseActive = (paths) => {
    return paths.some((path) => location.pathname.startsWith(path));
  };

  return (
    <ul
      className="navbar-nav sidebar accordion"
      id="accordionSidebar"
    >
      <Link
        className="sidebar-brand d-flex align-items-center justify-content-center"
        to="/admin"
      >

        <img className="logo-main" src={logoLight} width="153" height="30" alt="Logo" />
      </Link>

      <hr className="sidebar-divider my-0" />

      <li className="nav-item">
        <Link
          className={`nav-link ${isActive("/admin") ? "active" : ""}`}
          to="/admin"
          style={{ color: '#1D3557' }}
        >
          <i className="fas fa-fw fa-tachometer-alt" style={{ color: '#1D3557' }}></i>
          <span>Dashboard</span>
        </Link>
      </li>

      <hr className="sidebar-divider" />

      <div className="sidebar-heading" style={{ color: '#1D3557' }}>Features</div>



      <li
        className={`nav-item ${isCollapseActive(["/admin/tables"]) ? "active" : ""
          }`}
      >
        <a
          className="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#collapseTable"
          aria-expanded="true"
          aria-controls="collapseTable"
          style={{ color: '#1D3557' }}
        >
          <i className="fas fa-fw fa-table" style={{ color: '#1D3557' }}></i>
          <span>Manage</span>
        </a>
        <div
          id="collapseTable"
          className={`collapse ${isCollapseActive(["/admin/tables"]) ? "show" : ""
            }`}
          aria-labelledby="headingTable"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <h6 className="collapse-header" style={{ color: '#1D3557' }}>Tables</h6>
            <Link
              className={`collapse-item ${isActive("/admin/tables/simple") ? "active" : ""
                }`}
              to="/admin/orders"
              style={{ color: '#1D3557' }}
            >
              Order
            </Link>
            <Link
              className={`collapse-item ${isActive("/admin/tables/datatables") ? "active" : ""
                }`}
              to="/admin/tables/datatables"
              style={{ color: '#1D3557' }}
            >
              User
            </Link>
            <Link
              className={`collapse-item ${isActive("/admin/tables/categories") ? "active" : ""
                }`}
              to="/admin/categories"
              style={{ color: '#1D3557' }}
            >
              Categories
            </Link>
            <Link
              className={`collapse-item ${isActive("/admin/tables/role-request") ? "active" : ""
                }`}
              to="/admin/role-request"
              style={{ color: '#1D3557' }}
            >
              Role requests
            </Link>
            <Link
              className={`collapse-item ${isActive("/admin/products") ? "active" : ""
                }`}
              to="/admin/products"
              style={{ color: '#1D3557' }}
            >
              Products
            </Link>
          </div>
        </div>
      </li>

     

      <hr className="sidebar-divider" />

      <div className="sidebar-heading" style={{ color: '#1D3557' }}>Examples</div>

      <li className="nav-item">
        <a
          className="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#collapsePage"
          aria-expanded="true"
          aria-controls="collapsePage"
          style={{ color: '#1D3557' }}
        >
          <i className="fas fa-fw fa-columns" style={{ color: '#1D3557' }}></i>
          <span>Pages</span>
        </a>
        <div
          id="collapsePage"
          className="collapse"
          aria-labelledby="headingPage"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <h6 className="collapse-header" style={{ color: '#1D3557' }}>Example Pages</h6>
            <a className="collapse-item" href="login.html" style={{ color: '#1D3557' }}>
              Login
            </a>
            <a className="collapse-item" href="register.html" style={{ color: '#1D3557' }}>
              Register
            </a>
            <a className="collapse-item" href="404.html" style={{ color: '#1D3557' }}>
              404 Page
            </a>
            <a className="collapse-item" href="blank.html" style={{ color: '#1D3557' }}>
              Blank Page
            </a>
          </div>
        </div>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/admin/charts" style={{ color: '#1D3557' }}>
          <i className="fas fa-fw fa-chart-area" style={{ color: '#1D3557' }}></i>
          <span>Charts</span>
        </Link>
      </li>

      <hr className="sidebar-divider" />
    </ul>
  );
};

export default Sidebar;
