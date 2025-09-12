import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function ShelterLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: '/shelter', label: 'Dashboard' },
    { path: '/shelter/pets', label: 'Pets' },
    { path: '/shelter/adoption-requests', label: 'Adoptions' },
    { path: '/shelter/manage', label: 'Manage' },
    { path: '/information', label: 'My Account' }
  ];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="container-fluid p-0">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/shelter" onClick={() => setOpen(false)}>
            🐾 Shelter Management
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="shelterNavbar"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen(!open)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${open ? 'show' : ''}`} id="shelterNavbar">
            <ul className="navbar-nav ms-auto">
              {navItems.map((item) => (
                <li className="nav-item" key={item.path}>
                  <Link
                    className={`nav-link ${
                      location.pathname === item.path ? 'active fw-semibold' : ''
                    }`}
                    to={item.path}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <main className="container mt-4">
        <Outlet />
      </main>
    </div>
  );
}
