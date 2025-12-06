import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
      borderTop: '1px solid rgba(255,255,255,0.2)',
      marginTop: '80px'
    }}>
      {/* Main Footer Content */}
      <div className="container py-5">
        <div className="row g-4">

          {/* Brand Column */}
          <div className="col-12 col-md-6 col-lg-4">
            <Link to="/" className="d-inline-block mb-3">
              <img src="/assets/images/logo.png" alt="Logo" width="140" height="28" />
            </Link>
            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '14px',
              lineHeight: '1.7',
              marginBottom: '20px',
              maxWidth: '320px'
            }}>
              Merier - Nền tảng thương mại điện tử hàng đầu, mang đến trải nghiệm mua sắm tuyệt vời cho khách hàng.
            </p>

            {/* Social Icons */}
            <div className="d-flex gap-2">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#f5576c',
                  border: '1px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#f5576c';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                  e.currentTarget.style.color = '#f5576c';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <i className="fa fa-facebook"></i>
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'white',
                  color: '#457B9D',
                  border: '1px solid #E8ECEF',
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#E63946';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = '#E63946';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#457B9D';
                  e.currentTarget.style.borderColor = '#E8ECEF';
                }}
              >
                <i className="fa fa-linkedin"></i>
              </a>
              <a
                href="https://www.twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'white',
                  color: '#457B9D',
                  border: '1px solid #E8ECEF',
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#E63946';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = '#E63946';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#457B9D';
                  e.currentTarget.style.borderColor = '#E8ECEF';
                }}
              >
                <i className="fa fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* Ecommerce Column */}
          <div className="col-6 col-md-6 col-lg-2">
            <h6 className="fw-semibold mb-3" style={{ color: 'white', fontSize: '15px' }}>
              Ecommerce
            </h6>
            <ul className="list-unstyled">
              {[
                { to: '/shop', label: 'Sản phẩm' },
                { to: '/cart', label: 'Giỏ hàng' },
                { to: '/information/orders', label: 'Đơn hàng' },
                { to: '/information', label: 'Theo dõi' },
                { to: '/shop-wishlist', label: 'Yêu thích' }
              ].map((item, idx) => (
                <li key={idx} className="mb-2">
                  <Link
                    to={item.to}
                    style={{
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-6 col-md-6 col-lg-3">
            <h6 className="fw-semibold mb-3" style={{ color: 'white', fontSize: '15px' }}>
              Hỗ trợ
            </h6>
            <ul className="list-unstyled">
              {[
                { to: '/contact', label: 'Trợ giúp' },
                { to: '/contact', label: 'Chat trực tuyến' },
                { to: '/shop', label: 'Chi tiết sản phẩm' },
                { to: '/information', label: 'Theo dõi đơn hàng' }
              ].map((item, idx) => (
                <li key={idx} className="mb-2">
                  <Link
                    to={item.to}
                    style={{
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Column */}
          <div className="col-6 col-md-6 col-lg-3">
            <h6 className="fw-semibold mb-3" style={{ color: 'white', fontSize: '15px' }}>
              Danh mục
            </h6>
            <ul className="list-unstyled">
              {[
                { to: '/shop?category=men', label: 'Nam' },
                { to: '/shop?category=women', label: 'Nữ' },
                { to: '/shop?category=kid', label: 'Trẻ em' },
                { to: '/shop?category=jackets', label: 'Áo khoác' },
                { to: '/shop', label: 'Khác' }
              ].map((item, idx) => (
                <li key={idx} className="mb-2">
                  <Link
                    to={item.to}
                    style={{
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={{
        background: 'white',
        borderTop: '1px solid #E8ECEF',
        padding: '20px 0'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0" style={{ color: '#457B9D', fontSize: '14px' }}>
                © {year} Merier. Made with <i className="fa fa-heart" style={{ color: '#E63946' }}></i> by{' '}
                <a
                  href="https://themeforest.net/user/codecarnival/portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#E63946',
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  Codecarnival
                </a>
              </p>
            </div>
            <div className="col-12 col-md-6 text-center text-md-end">
              <Link to="/shop">
                <img
                  src="/assets/images/shop/payment.png"
                  alt="Payment Methods"
                  style={{ maxHeight: '30px', opacity: 0.8 }}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
