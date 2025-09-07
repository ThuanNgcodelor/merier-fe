import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isCollapseActive = (paths) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  return (
    <ul className="navbar-nav sidebar sidebar-light accordion" id="accordionSidebar">
      <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/admin">
        <div className="sidebar-brand-icon">
          <img src="/src/assets/admin/img/logo/logo2.png" alt="Logo" />
        </div>
        <div className="sidebar-brand-text mx-3">RuangAdmin</div>
      </Link>
      
      <hr className="sidebar-divider my-0" />
      
      <li className="nav-item">
        <Link 
          className={`nav-link ${isActive('/admin') ? 'active' : ''}`} 
          to="/admin"
        >
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>
      </li>
      
      <hr className="sidebar-divider" />
      
      <div className="sidebar-heading">Features</div>
      
      <li className="nav-item">
        <a 
          className="nav-link collapsed" 
          href="#" 
          data-toggle="collapse" 
          data-target="#collapseBootstrap"
          aria-expanded="true" 
          aria-controls="collapseBootstrap"
        >
          <i className="far fa-fw fa-window-maximize"></i>
          <span>Bootstrap UI</span>
        </a>
        <div id="collapseBootstrap" className="collapse" aria-labelledby="headingBootstrap" data-parent="#accordionSidebar">
          <div className="bg-white py-2 collapse-inner rounded">
            <h6 className="collapse-header">Bootstrap UI</h6>
            <a className="collapse-item" href="alerts.html">Alerts</a>
            <a className="collapse-item" href="buttons.html">Buttons</a>
            <a className="collapse-item" href="dropdowns.html">Dropdowns</a>
            <a className="collapse-item" href="modals.html">Modals</a>
            <a className="collapse-item" href="popovers.html">Popovers</a>
            <a className="collapse-item" href="progress-bar.html">Progress Bars</a>
          </div>
        </div>
      </li>
      
      <li className="nav-item">
        <a 
          className="nav-link collapsed" 
          href="#" 
          data-toggle="collapse" 
          data-target="#collapseForm" 
          aria-expanded="true"
          aria-controls="collapseForm"
        >
          <i className="fab fa-fw fa-wpforms"></i>
          <span>Forms</span>
        </a>
        <div id="collapseForm" className="collapse" aria-labelledby="headingForm" data-parent="#accordionSidebar">
          <div className="bg-white py-2 collapse-inner rounded">
            <h6 className="collapse-header">Forms</h6>
            <a className="collapse-item" href="form_basics.html">Form Basics</a>
            <a className="collapse-item" href="form_advanceds.html">Form Advanceds</a>
          </div>
        </div>
      </li>
      
      <li className={`nav-item ${isCollapseActive(['/admin/tables']) ? 'active' : ''}`}>
        <a 
          className="nav-link collapsed" 
          href="#" 
          data-toggle="collapse" 
          data-target="#collapseTable" 
          aria-expanded="true"
          aria-controls="collapseTable"
        >
          <i className="fas fa-fw fa-table"></i>
          <span>Tables</span>
        </a>
        <div 
          id="collapseTable" 
          className={`collapse ${isCollapseActive(['/admin/tables']) ? 'show' : ''}`} 
          aria-labelledby="headingTable" 
          data-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <h6 className="collapse-header">Tables</h6>
            <Link 
              className={`collapse-item ${isActive('/admin/tables/simple') ? 'active' : ''}`} 
              to="/admin/tables/simple"
            >
              Simple Tables
            </Link>
            <Link 
              className={`collapse-item ${isActive('/admin/tables/datatables') ? 'active' : ''}`} 
              to="/admin/tables/datatables"
            >
              DataTables
            </Link>
          </div>
        </div>
      </li>
      
      <li className="nav-item">
        <Link className="nav-link" to="/admin/ui-colors">
          <i className="fas fa-fw fa-palette"></i>
          <span>UI Colors</span>
        </Link>
      </li>
      
      <hr className="sidebar-divider" />
      
      <div className="sidebar-heading">Examples</div>
      
      <li className="nav-item">
        <a 
          className="nav-link collapsed" 
          href="#" 
          data-toggle="collapse" 
          data-target="#collapsePage" 
          aria-expanded="true"
          aria-controls="collapsePage"
        >
          <i className="fas fa-fw fa-columns"></i>
          <span>Pages</span>
        </a>
        <div id="collapsePage" className="collapse" aria-labelledby="headingPage" data-parent="#accordionSidebar">
          <div className="bg-white py-2 collapse-inner rounded">
            <h6 className="collapse-header">Example Pages</h6>
            <a className="collapse-item" href="login.html">Login</a>
            <a className="collapse-item" href="register.html">Register</a>
            <a className="collapse-item" href="404.html">404 Page</a>
            <a className="collapse-item" href="blank.html">Blank Page</a>
          </div>
        </div>
      </li>
      
      <li className="nav-item">
        <Link className="nav-link" to="/admin/charts">
          <i className="fas fa-fw fa-chart-area"></i>
          <span>Charts</span>
        </Link>
      </li>
      
      <hr className="sidebar-divider" />
      <div className="version" id="version-ruangadmin"></div>
    </ul>
  );
};

export default Sidebar;


