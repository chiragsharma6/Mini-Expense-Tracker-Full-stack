import { useEffect, useState } from "react";

function Navbar({ theme, toggleTheme }) {
  const [isSticky, setIsSticky] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLinkClick = (e) => {
    e.preventDefault();
    setShowToast(true);
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
      <nav className={`navbar-sticky ${isSticky ? "navbar-visible" : ""}`}>
        <div className="navbar-content">
          <div className="navbar-left">
            <div className="navbar-logo" aria-label="EXPENDEE Logo">
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
            </div>
          </div>

          <div className="navbar-right">
            <ul className="navbar-links">
              <li><a href="#pricing" onClick={handleLinkClick}>Pricing</a></li>
              <li className="nav-link-optional">
                <a href="#bank-connect" onClick={handleLinkClick}>Bank Connect</a>
              </li>
              <li><a href="#help" onClick={handleLinkClick}>Help</a></li>
              <li className="nav-link-optional">
                <a href="#about-us" onClick={handleLinkClick}>About us</a>
              </li>
              <li><a href="#blog" onClick={handleLinkClick}>Blog</a></li>
              <li>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="theme-toggle-btn"
                  aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                  title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
                >
                  {theme === "light" ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  )}
                </button>
              </li>
              <li className="nav-divider" aria-hidden="true">|</li>
              <li><a href="#login" className="nav-login-btn" onClick={handleLinkClick}>Login</a></li>
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
