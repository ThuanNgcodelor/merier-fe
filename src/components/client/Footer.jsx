import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#ff4d4f" }} className="text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <h4 className="fw-bold mb-3">🐾 PetCare Platform</h4>
            <p>
              A complete ecosystem for pet management: shopping, healthcare, vet
              appointments, adoption, and shelter management. Bringing
              convenience and peace of mind for you and your beloved pets.
            </p>
          </div>

          <div className="col-md-2">
            <h5 className="fw-semibold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
              <li><Link to="/shop" className="text-light text-decoration-none">Shop</Link></li>
              <li><Link to="/blog" className="text-light text-decoration-none">Blog</Link></li>
              <li><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>
              <li><Link to="/about-us" className="text-light text-decoration-none">About</Link></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5 className="fw-semibold mb-3">Services</h5>
            <ul className="list-unstyled">
              <li><Link to="/shelter" className="text-light text-decoration-none">Shelter Portal</Link></li>
              <li><Link to="/vet" className="text-light text-decoration-none">Vet Portal</Link></li>
              <li><Link to="/adoption" className="text-light text-decoration-none">Adoptions</Link></li>
              <li><Link to="/orders" className="text-light text-decoration-none">Orders & Checkout</Link></li>
              <li><Link to="/information" className="text-light text-decoration-none">My Account</Link></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5 className="fw-semibold mb-3">Contact Us</h5>
            <p className="mb-1"><i className="fa fa-map-marker-alt me-2"></i>123 Pet Street, Can Tho City, Vietnam</p>
            <p className="mb-1"><i className="fa fa-envelope me-2"></i>support@petcare.com</p>
            <p><i className="fa fa-phone me-2"></i>+84 383312321</p>

            <div className="d-flex gap-3 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-light fs-5"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-light fs-5"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-light fs-5"><i className="fab fa-instagram"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-light fs-5"><i className="fab fa-linkedin-in"></i></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-light fs-5"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>

        <hr className="border-light my-4" />

        <div className="text-center">
          <small>
            © {year} PetCare Platform. All rights reserved. |{" "}
            <Link to="/privacy" className="text-decoration-none text-light">Privacy Policy</Link> |{" "}
            <Link to="/terms" className="text-decoration-none text-light">Terms & Conditions</Link>
          </small>
        </div>
      </div>
    </footer>
  );
}
