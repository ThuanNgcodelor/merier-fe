import React from 'react';
import { Link } from 'react-router-dom';

const ShopOwnerHeader = ({ onMenuClick }) => {
  return (
    <header className="shop-owner-header">
      <div className="header-left">
        <button className="header-icon-btn mobile-menu-btn" onClick={onMenuClick} title="Menu">
          <i className="fas fa-bars"></i>
        </button>
        <Link to="/shop-owner" className="logo-section">
          <span className="header-title">Seller Center</span>
        </Link>
      </div>
      <div className="header-right">
        <button className="header-icon-btn" title="Apps">
          <i className="fas fa-th"></i>
        </button>
        <button className="header-icon-btn" title="Bookmarks">
          <i className="far fa-bookmark"></i>
        </button>
        <div className="user-dropdown">
          <button className="header-icon-btn user-btn">
            <img src="/src/assets/admin/img/boy.png" alt="User" className="user-avatar" />
            <span>_i43ysb2mp</span>
            <i className="fas fa-chevron-down"></i>
          </button>
        </div>
        <button className="header-icon-btn" title="Download">
          <i className="fas fa-download"></i>
        </button>
        <button className="header-icon-btn" title="Upload">
          <i className="fas fa-upload"></i>
        </button>
        <button className="header-icon-btn support-btn" title="Support">
          <i className="fas fa-headset"></i>
        </button>
      </div>
    </header>
  );
};

export default ShopOwnerHeader;

