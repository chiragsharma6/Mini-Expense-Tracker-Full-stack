import { useState } from "react";

function Footer() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      setStatus("Please agree to the Terms & Conditions.");
      return;
    }
    if (!email) {
      setStatus("Please enter a valid email address.");
      return;
    }
    setStatus("Thank you for subscribing!");
    setEmail("");
    setAgreed(false);
    window.setTimeout(() => setStatus(""), 3000);
  };

  return (
    <footer className="app-footer">
      <div className="newsletter-section">
        <h2 className="newsletter-heading">
          Get monthly money tips and
          <strong>stay on top of your finance</strong>
        </h2>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <div className="newsletter-input-group">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-email-input"
              required
            />
            <button type="submit" className="newsletter-submit-btn">
              Subscribe
            </button>
          </div>

          <label className="newsletter-terms">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="newsletter-checkbox"
            />
            <span className="newsletter-checkbox-custom" />
            <span className="newsletter-terms-text">
              I have read and agree with the{" "}
              <a href="#terms" className="newsletter-terms-link">
                Terms & Conditions
              </a>
            </span>
          </label>
        </form>

        {status && (
          <p
            className={`newsletter-status ${
              status.includes("Thank") ? "success" : "error"
            }`}
          >
            {status}
          </p>
        )}
      </div>

      <div className="footer-bottom">
        <hr className="footer-divider" />
        <p className="footer-copyright">
          Copyright 2026 EXPENDEE a.s. | All Rights Reserved | EXPENDEE is made
          with <span className="heart-icon">❤</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
