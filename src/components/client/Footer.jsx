import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-area">
      {/*== Start Footer Main ==*/}
      <div className="footer-main">
        <div className="container">
          <div className="row mb-n6">
            <div className="col-sm-12 col-md-3 col-lg-3 mb-6">
              <div className="widget-item">
                <div className="widget-about">
                  <Link className="widget-logo" to="/">
                    <img src="/assets/images/logo.png" alt="Logo" width="153" height="30" />
                  </Link>
                  <p className="desc">Merier fashion is simply dummy text of the printing and typesetting industry.</p>
                </div>
                <div className="widget-social">
                  <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook"></i></a>
                  <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"><i className="fa fa-linkedin"></i></a>
                  <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer"><i className="fa fa-twitter"></i></a>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-2 offset-lg-1 mb-6">
              <div className="widget-item">
                <h4 className="widget-title">Ecommerce</h4>
                <h4 className="widget-title widget-collapsed-title collapsed" data-bs-toggle="collapse" data-bs-target="#widgetTitleId-1">Ecommerce</h4>
                <div id="widgetTitleId-1" className="collapse widget-collapse-body">
                  <ul className="widget-nav">
                    <li><Link to="/shop">Products</Link></li>
                    <li><Link to="/shop-cart">Your Cart</Link></li>
                    <li><Link to="/information/orders">Your Order</Link></li>
                    <li><Link to="/information">Tracking</Link></li>
                    <li><Link to="/shop-wishlist">Wishlist</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-2 offset-lg-1 mb-6">
              <div className="widget-item">
                <h4 className="widget-title">Support</h4>
                <h4 className="widget-title widget-collapsed-title collapsed" data-bs-toggle="collapse" data-bs-target="#widgetTitleId-2">Support</h4>
                <div id="widgetTitleId-2" className="collapse widget-collapse-body">
                  <ul className="widget-nav">
                    <li><Link to="/contact">Help</Link></li>
                    <li><Link to="/contact">Live Chat</Link></li>
                    <li><Link to="/shop">Product Detail</Link></li>
                    <li><Link to="/information">Tracking</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-2 offset-lg-1 mb-6">
              <div className="widget-item">
                <h4 className="widget-title">Products</h4>
                <h4 className="widget-title widget-collapsed-title collapsed" data-bs-toggle="collapse" data-bs-target="#widgetTitleId-3">Products</h4>
                <div id="widgetTitleId-3" className="collapse widget-collapse-body">
                  <ul className="widget-nav">
                    <li><Link to="/shop">Man</Link></li>
                    <li><Link to="/shop">Women</Link></li>
                    <li><Link to="/shop">KID</Link></li>
                    <li><Link to="/shop">Jackets</Link></li>
                    <li><Link to="/shop">Others</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*== End Footer Main ==*/}

      {/*== Start Footer Bottom ==*/}
      <div className="footer-bottom">
        <div className="container pt-0 pb-0">
          <div className="footer-bottom-content">
            <Link to="/shop"><img src="/assets/images/shop/payment.png" alt="Image-HasTech" /></Link>
            <p className="copyright">© {year} Merier. Made with <i className="fa fa-heart"></i> by <a target="_blank" href="https://themeforest.net/user/codecarnival/portfolio" rel="noopener noreferrer">Codecarnival.</a></p>
          </div>
        </div>
      </div>
      {/*== End Footer Bottom ==*/}
    </footer>
  );
}
