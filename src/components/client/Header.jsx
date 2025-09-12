import { Link, useNavigate } from "react-router-dom";
import logoLight from "../../assets/images/logo.png";
import NavLink from "./NavLink";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";
import { useCart } from "../../contexts/CartContext.jsx";
import { getCart } from "../../api/user.js";
import { getUserRole, isAuthenticated } from "../../api/auth.js";

export default function Header() {
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const token = Cookies.get("accessToken");

  const [roles, setRoles] = useState([]);
  const authed = isAuthenticated();
  const [mobileOpen, setMobileOpen] = useState(false);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const r = getUserRole();
    const list = Array.isArray(r) ? r : r ? [r] : [];
    setRoles(list);
  }, [token]);

  useEffect(() => {
    if (!token) {
      setCart(null);
      setLoading(false);
      setError(null);
      return;
    }
    async function fetchTotalCart() {
      try {
        setLoading(true);
        const data = await getCart();
        setCart(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetchTotalCart();
  }, [token, setCart]);

  const hasRole = (role) => roles.includes(role);

  const goAccount = () => { closeMobile(); navigate("/information"); };
  const goVet = () => { closeMobile(); navigate("/vet"); };
  const goShelter = () => { closeMobile(); navigate("/shelter"); };
  const goAdmin = () => { closeMobile(); navigate("/admin"); };
  const handleLoginClick = () => { closeMobile(); navigate("/login"); };
  const handleGoToCart = () => { closeMobile(); navigate("/cart"); };

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const itemCount = cart?.items ? cart.items.length : 0;

  return (
    <header className="header-area">
      <div className="container">
        <div className="row align-items-center justify-content-between position-relative">

          {/* Logo */}
          <div className="col-auto">
            <div className="header-logo">
              <Link to="/" onClick={closeMobile}>
                <img className="logo-main" src={logoLight} width="153" height="30" alt="Logo" />
              </Link>
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="col-auto d-lg-none ms-auto">
            <button
              className="btn p-2"
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
              onClick={openMobile}
              style={{ lineHeight: 1 }}
            >
              <i className="fa fa-bars" />
            </button>
          </div>

          {/* Desktop nav */}
          <div className="col d-none d-lg-block">
            <div className="d-flex align-items-center">
              <ul
                className="main-nav d-flex align-items-center justify-content-evenly flex-grow-1 mb-0"
                style={{ listStyle: 'none', paddingLeft: 0 }}
              >
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/adoption">Adoption</Link></li>


                {!authed ? (
                  <li><Link to="/login" onClick={handleLoginClick}>Login</Link></li>
                ) : (
                  <>
                    <li><Link to="/information" onClick={goAccount}>My Account</Link></li>
                    {hasRole("ROLE_VET") && <li><Link to="/vet" onClick={goVet}>Vet Portal</Link></li>}
                    {hasRole("ROLE_SHELTER") && <li><Link to="/shelter" onClick={goShelter}>Shelter</Link></li>}
                    {hasRole("ROLE_ADMIN") && <li><Link to="/admin" onClick={goAdmin}>Admin</Link></li>}
                  </>
                )}
              </ul>

              <form className="header-search-box d-none d-md-block me-2" onSubmit={(e) => e.preventDefault()}>
                <input className="form-control" type="text" id="search" placeholder="Search" />
                <button type="submit" className="btn-src" aria-label="Search">
                  <i className="fa fa-search"></i>
                </button>
              </form>

              <Link
                to="/cart"
                onClick={handleGoToCart}
                className="d-inline-flex align-items-center ms-1"
                title="Cart"
                style={{ lineHeight: 1 }}
              >
                <span className="position-relative d-inline-block" style={{ width: 24, height: 24 }}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 21 21"
                    fill="currentColor"
                    aria-hidden="true"
                    style={{ position: 'absolute', left: 2, top: 2 }}
                  >
                    <path d="M6 17a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm10 0a3 3 0 1 0 .001 6A3 3 0 0 0 16 17zM2 1H0v2h2l3.6 7.59-1.35 2.45A2 2 0 0 0 6.42 15H18v-2H6.42l1.1-2h7.03a2 2 0 0 0 1.79-1.11L20.16 4 18.42 3 15.55 9H7.53L5.16 4 2 1z" />
                  </svg>
                  <span
                    className="badge rounded-pill bg-danger"
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      fontSize: 10,
                      minWidth: 16,
                      height: 16,
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1
                    }}
                  >
                    {itemCount ?? 0}
                  </span>
                </span>
              </Link>
            </div>
          </div>

          <div className="col-auto d-lg-none" />
        </div>
      </div>

      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="d-lg-none"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 2000 }}
        />
      )}

      <aside
        id="mobile-drawer"
        className="d-lg-none"
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: 280,
          background: "#fff",
          zIndex: 2001,
          boxShadow: "0 0 30px rgba(0,0,0,0.25)",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 220ms ease-in-out",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottom: "1px solid #eee" }}>
          <h5 style={{ margin: 0 }}>Menu</h5>
          <button className="btn-close" aria-label="Close" onClick={closeMobile} />
        </div>

        <div style={{ padding: "12px 16px 0" }}>
          <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
            <input className="form-control" type="text" placeholder="Search" style={{ height: 36, fontSize: 14 }} />
            <button className="btn" type="submit" style={{ background: "#ff4d4f", color: "#fff", height: 36, padding: "0 12px" }}>
              <i className="fa fa-search" />
            </button>
          </form>
        </div>

        <div style={{ padding: 16, paddingTop: 8, overflowY: "auto" }}>
          <ul className="list-unstyled d-grid gap-3" style={{ marginBottom: 16 }}>
            <li><Link to="/" onClick={closeMobile}>Home</Link></li>
            <li><Link to="/shop" onClick={closeMobile}>Shop</Link></li>
            <li><NavLink to="/adoption" onClick={closeMobile}>Adoption</NavLink></li>

            {!authed ? (
              <li><Link to="/login" onClick={handleLoginClick}>Login</Link></li>
            ) : (
              <>
                <li><Link to="/information" onClick={goAccount}>My Account</Link></li>
                {hasRole("ROLE_VET") && <li><Link to="/vet" onClick={goVet}>Vet Portal</Link></li>}
                {hasRole("ROLE_SHELTER") && <li><Link to="/shelter" onClick={goShelter}>Shelter</Link></li>}
                {hasRole("ROLE_ADMIN") && <li><Link to="/admin" onClick={goAdmin}>Admin</Link></li>}
              </>
            )}
            <li>
              <Link
                to="/cart"
                onClick={handleGoToCart}
                className="d-inline-flex align-items-center"
                title="Cart"
              >
                <span className="position-relative d-inline-block" style={{ width: 24, height: 24 }}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 21 21"
                    fill="currentColor"
                    aria-hidden="true"
                    style={{ position: 'absolute', left: 2, top: 2 }}
                  >
                    <path d="M6 17a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm10 0a3 3 0 1 0 .001 6A3 3 0 0 0 16 17zM2 1H0v2h2l3.6 7.59-1.35 2.45A2 2 0 0 0 6.42 15H18v-2H6.42l1.1-2h7.03a2 2 0 0 0 1.79-1.11L20.16 4 18.42 3 15.55 9H7.53L5.16 4 2 1z" />
                  </svg>
                  <span
                    className="badge rounded-pill bg-danger"
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      fontSize: 10,
                      minWidth: 16,
                      height: 16,
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1
                    }}
                  >
                    {itemCount ?? 0}
                  </span>
                </span>
                <span style={{ marginLeft: 8 }}>Cart</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </header>
  );
}
