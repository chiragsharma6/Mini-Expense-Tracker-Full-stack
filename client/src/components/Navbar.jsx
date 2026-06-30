import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const [showToast, setShowToast] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLinkClick = (e) => {
    e.preventDefault();
    setShowToast(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (showToast) {
      const timer = window.setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => window.clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <>
      <nav className="navbar-sticky navbar-visible">
        <div className="navbar-content">
          <div className="navbar-left">
            <Link to="/" className="navbar-logo" aria-label="EXPENDEE Logo">
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="navbar-logo-svg"
              >
                <path d="M17,1 A16,16 0 0,1 31,10 L24,14 A8,8 0 0,0 17,9 Z" fill="#f59e0b" />
                <path d="M31,10 A16,16 0 0,1 33,23 L25,21 A8,8 0 0,0 24,14 Z" fill="#10b981" />
                <path d="M33,23 A16,16 0 0,1 21,33 L19,25 A8,8 0 0,0 25,21 Z" fill="#0ea5e9" />
                <path d="M21,33 A16,16 0 0,1 7,29 L11,22 A8,8 0 0,0 19,25 Z" fill="#ec4899" />
                <path d="M7,29 A16,16 0 0,1 2,13 L10,15 A8,8 0 0,0 11,22 Z" fill="#ef4444" />
                <path d="M2,13 A16,16 0 0,1 17,1 L17,9 A8,8 0 0,0 10,15 Z" fill="#6366f1" />
                <circle cx="17" cy="17" r="8" fill="#ffffff" />
                <text
                  x="17"
                  y="21"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontWeight="900"
                  fontSize="11"
                  fill="#2c3830"
                  textAnchor="middle"
                >
                  $
                </text>
              </svg>
              <span className="navbar-brand-name">EXPENDEE</span>
            </Link>
          </div>

          <div className="navbar-right">
            <ul className="navbar-links">
              <li className="nav-link-optional">

                <a href="#pricing" onClick={handleLinkClick}>Pricing</a>
              </li>
              <li className="nav-link-optional">
                <a href="#bank-connect" onClick={handleLinkClick}>Bank Connect</a>
              </li>
              <li className="nav-link-optional">
                <a href="#help" onClick={handleLinkClick}>Help</a>
              </li>
              <li className="nav-link-optional">
                <a href="#about-us" onClick={handleLinkClick}>About us</a>
              </li>
              <li className="nav-link-optional">
                <a href="#blog" onClick={handleLinkClick}>Blog</a>
              </li>
              <li className="nav-divider nav-link-optional" aria-hidden="true">|</li>

              {isAuthenticated ? (
                <>
                  <li className="nav-user-greeting">
                    <span>Hi, {user?.name ? user.name.split(" ")[0] : "User"}</span>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="nav-logout-btn">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="nav-login-btn">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="nav-register-btn">
                      Register
                    </Link>
                  </li>
                </>
              )}

            </ul>
          </div>
        </div>
      </nav>

      {showToast && (
        <div className="navbar-toast-container">
          <div className="navbar-toast">
            <span className="toast-text">Oops! This feature will be implemented soon.</span>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;

