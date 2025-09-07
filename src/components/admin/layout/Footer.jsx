import React from 'react';

const Footer = () => {
  return (
    <footer className="sticky-footer bg-white">
      <div className="container my-auto">
        <div className="copyright text-center my-auto">
          <span>copyright &copy; <script> document.write(new Date().getFullYear()); </script> - developed by
            <b><a href="https://indrijunanda.gitlab.io/" target="_blank" rel="noopener noreferrer">indrijunanda</a></b>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


