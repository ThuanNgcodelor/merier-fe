import { Link, useNavigate } from "react-router-dom";
import logoLight from "../../assets/images/logo.png";
import NavLink from "./NavLink";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback, useRef } from "react";
import { useCart } from "../../contexts/CartContext.jsx";
import { getCart, getUser } from "../../api/user.js";
import { getUserRole, isAuthenticated } from "../../api/auth.js";
import { getNotificationsByUserId, markNotificationAsRead } from "../../api/notification.js";

export default function Header() {
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const token = Cookies.get("accessToken");

  const [roles, setRoles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const [searchQuery, setSearchQuery] = useState("");

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
  const handleGoToCart = () => { closeMobile(); navigate("/cart"); };

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Không xác định';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return 'Không xác định';
    }
  };

  const formatNotification = (notification) => {
    let title = 'Thông báo đơn hàng';
    if (notification.orderId) {
      title = `Đơn hàng #${notification.orderId.substring(0, 8)}`;
    }
    return {
      id: notification.id,
      title,
      message: notification.message || 'Có cập nhật về đơn hàng của bạn',
      time: formatTimeAgo(notification.creationTimestamp),
      isRead: notification.isRead || false,
      orderId: notification.orderId
    };
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const user = await getUser();
        if (!user || !user.id) return;

        const data = await getNotificationsByUserId(user.id);
        const orderNotifications = Array.isArray(data)
          ? data.filter(n => n.orderId).slice(0, 3).map(formatNotification)
          : [];
        setNotifications(orderNotifications);
      } catch (err) {
        console.error('Error fetching notifications in header:', err);
        setNotifications([]);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    const handleNotificationsUpdated = () => { fetchNotifications(); };
    window.addEventListener('notificationsUpdated', handleNotificationsUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdated);
    };
  }, [token]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const itemCount = cart?.items ? cart.items.length : 0;

  return (
    <header style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' }}>
      {/* Top Bar */}
      <div style={{ background: 'rgba(0,0,0,0.1)', padding: '6px 0', fontSize: '13px' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div className="d-flex justify-content-between align-items-center">
            {/* Left links */}
            <div className="d-none d-md-flex gap-3">
              {hasRole("ROLE_SHOP_OWNER") && (
                <Link to="/shop-owner" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>
                  Sales channel
                </Link>
              )}
              <div className="d-flex gap-2 align-items-center">
                <span style={{ color: 'white', opacity: 0.9 }}>Connect</span>
                <a href="#" style={{ color: 'white', opacity: 0.9 }}><i className="fa fa-facebook"></i></a>
                <a href="#" style={{ color: 'white', opacity: 0.9 }}><i className="fa fa-instagram"></i></a>
              </div>
            </div>

            {/* Right links */}
            <div className="d-flex gap-3 align-items-center">
              <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.9, fontSize: '13px' }}>
                <i className="fa fa-question-circle me-1"></i> Support
              </a>
              {isAuthenticated() ? (
                <Link to="/information" style={{ color: 'white', textDecoration: 'none', opacity: 0.9, fontSize: '13px' }}>
                  <i className="fa fa-user-circle me-1"></i> Account
                </Link>
              ) : (
                <>
                  <Link to="/register" style={{ color: 'white', textDecoration: 'none', opacity: 0.9, fontSize: '13px' }}>
                    Register
                  </Link>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>|</div>
                  <Link to="/login" style={{ color: 'white', textDecoration: 'none', opacity: 0.9, fontSize: '13px' }}>
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-3" style={{ maxWidth: '1200px' }}>
        <div className="row align-items-center g-3">
          {/* Logo */}
          <div className="col-auto">
            <Link to="/" onClick={closeMobile}>
              <img
                src={logoLight}
                width="160"
                height="40"
                alt="Logo"
                style={{
                  filter: 'brightness(0) invert(1)',
                  display: 'block'
                }}
              />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="col-auto d-lg-none ms-auto">
            <button className="btn p-0" onClick={openMobile} style={{ color: 'white', border: 'none' }}>
              <i className="fa fa-bars fs-5" />
            </button>
          </div>

          {/* Desktop: Search */}
          <div className="col d-none d-lg-block">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchQuery("");
                }
              }}
              className="d-flex"
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  height: '40px',
                  border: 'none',
                  borderRadius: '2px',
                  paddingLeft: '16px',
                  paddingRight: '55px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white'
                }}
              />
            </form>
          </div>

          {/* Desktop: Icons */}
          <div className="col-auto d-none d-lg-flex align-items-center" style={{ gap: '24px' }}>
            {/* Notification */}
            {isAuthenticated() && (
              <div ref={notificationRef} className="position-relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="btn p-0 position-relative border-0"
                  style={{ background: 'transparent', color: 'white' }}
                >
                  <i className="fa fa-bell" style={{ fontSize: '24px' }}></i>
                  {unreadCount > 0 && (
                    <span
                      className="position-absolute badge rounded-pill"
                      style={{
                        top: '-5px',
                        right: '-8px',
                        background: 'white',
                        color: '#ee5a6f',
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '3px 6px'
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div
                    className="position-absolute bg-white"
                    style={{
                      top: 'calc(100% + 12px)',
                      right: '-50px',
                      width: '400px',
                      zIndex: 1000,
                      maxHeight: '500px',
                      overflowY: 'auto',
                      borderRadius: '4px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                      <h6 className="mb-0">Thông báo</h6>
                      <button className="btn-close" onClick={() => setShowNotifications(false)}></button>
                    </div>

                    {notifications.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="fa fa-bell-slash mb-3" style={{ fontSize: '48px', color: '#ddd' }}></i>
                        <p className="mb-0" style={{ color: '#999' }}>Không có thông báo</p>
                      </div>
                    ) : (
                      <div>
                        {notifications.map(notification => (
                          <div
                            key={notification.id}
                            onClick={async () => {
                              try {
                                await markNotificationAsRead(notification.id);
                                const user = await getUser();
                                if (user && user.id) {
                                  const data = await getNotificationsByUserId(user.id);
                                  const updatedNotifications = Array.isArray(data)
                                    ? data.filter(n => n.orderId).slice(0, 3).map(formatNotification)
                                    : [];
                                  setNotifications(updatedNotifications);
                                }
                                if (notification.orderId) {
                                  navigate(`/information/orders?orderId=${notification.orderId}`);
                                  setShowNotifications(false);
                                }
                              } catch (error) {
                                console.error('Error marking notification as read:', error);
                              }
                            }}
                            className="p-3"
                            style={{
                              borderBottom: '1px solid #f0f0f0',
                              cursor: 'pointer',
                              background: notification.isRead ? 'white' : '#f9fafb'
                            }}
                          >
                            <div className="d-flex gap-2">
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: notification.isRead ? 'transparent' : '#ee5a6f',
                                marginTop: '6px'
                              }} />
                              <div style={{ flex: 1 }}>
                                <div className="fw-semibold mb-1" style={{ fontSize: '13px' }}>
                                  {notification.title}
                                </div>
                                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                                  {notification.message}
                                </div>
                                <div style={{ fontSize: '11px', color: '#999' }}>
                                  {notification.time}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            <button
              onClick={handleGoToCart}
              className="btn p-0 position-relative border-0"
              style={{ background: 'transparent', color: 'white' }}
            >
              <i className="fa fa-shopping-cart" style={{ fontSize: '24px' }}></i>
              {itemCount > 0 && (
                <span
                  className="position-absolute badge rounded-pill"
                  style={{
                    top: '-5px',
                    right: '-8px',
                    background: 'white',
                    color: '#ee5a6f',
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '3px 6px'
                  }}
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
            style={{ opacity: 0.5, zIndex: 1040 }}
            onClick={closeMobile}
          />
          <div
            className="offcanvas offcanvas-start show"
            style={{ zIndex: 1050, visibility: 'visible' }}
          >
            <div className="offcanvas-header border-bottom">
              <img src={logoLight} width="120" alt="Logo" />
              <button
                type="button"
                className="btn-close"
                onClick={closeMobile}
              />
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav">
                <NavLink to="/" close={closeMobile}>Home</NavLink>
                <NavLink to="/shop" close={closeMobile}>Shop</NavLink>
                <NavLink to="/about" close={closeMobile}>About</NavLink>
                <NavLink to="/blog" close={closeMobile}>Blog</NavLink>
                <NavLink to="/contact" close={closeMobile}>Contact</NavLink>
                {hasRole("ROLE_SHOP_OWNER") && (
                  <li className="nav-item mt-2">
                    <Link
                      to="/shop-owner"
                      className="nav-link fw-bold text-primary"
                      onClick={closeMobile}
                    >
                      <i className="fa fa-store me-2"></i>My Shop
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
