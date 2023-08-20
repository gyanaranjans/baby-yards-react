import * as Route from '@/constants/routes';
import logo from '@/images/logo-full.png';
import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const { pathname } = useLocation();

  const visibleOnlyPath = [
    Route.HOME,
    Route.SHOP
  ];

  return !visibleOnlyPath.includes(pathname) ? null : (
    <footer className="footer">
      <div className="footer-col-1">
        <strong>
          <span>
            Developed by
            {' '}
            <a href="https://github.com/gyanaranjans">Gyana</a>
          </span><br />
          <a href = '/contact'>Contact Us</a>
        </strong>
      </div>
      <div className="footer-col-2">
        <img alt="Footer logo" className="footer-logo" src={logo} />
        <h5>
          &copy;&nbsp;
          {new Date().getFullYear()}
        </h5>
        <a href="/privacy-policy.html">Privacy Policy</a><br />
        <a href="/refund-policy.html">Refund Policy</a><br/>
        <a href="/terms.html">terms and condition</a>
      </div>
      <div className="footer-col-3">
        <strong>
          <span>
           &copy; Copyright 
          </span>
        </strong>
      </div>
    </footer>
  );
};

export default Footer;
