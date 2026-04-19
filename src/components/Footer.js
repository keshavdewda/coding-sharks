import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from "../Images/logo.png";
import address from "../Images/address_icon.png";
import email from "../Images/email.png";
import phone from "../Images/phone.png";

const Footer = () => {
  return (
    <footer className="footer-container">
      <Container>
        <Row className="footer-content">
          <Col lg={4} md={6} className="footer-brand mb-4 mb-md-0">
            <div className="brand-wrapper">
              <img
                width="180px"
                src={logo}
                alt="Coding Sharks Logo"
                className="footer-logo"
              />
              <p className="company-name">
                Build real coding skills with project-first learning, guided practice, and job-ready outcomes.
              </p>
              <div className="social-links" aria-label="Social links">
                <a
                  href="https://www.linkedin.com/company/codingsharks/"
                  className="social-link social-link--linkedin"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.96 1.96 0 0 0 3.25 5c0 1.1.89 2 2 2s2-.9 2-2a1.96 1.96 0 0 0-2-2Zm15.5 9.86c0-2.93-1.56-4.49-3.65-4.49-1.68 0-2.44.94-2.86 1.6V8.5h-3.37V20h3.37v-5.7c0-1.5.29-2.96 2.11-2.96 1.8 0 1.83 1.7 1.83 3.06V20H22v-7.14h-1.25Z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/917747004451?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20the%20courses%20at%20Coding%20Sharks."
                  className="social-link social-link--whatsapp"
                  aria-label="WhatsApp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.03 2C6.49 2 2 6.48 2 12c0 1.95.56 3.85 1.62 5.48L2 22l4.68-1.56A10 10 0 0 0 12.03 22C17.56 22 22 17.52 22 12S17.56 2 12.03 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-2.77.93.9-2.7-.2-.31A8.18 8.18 0 1 1 12.03 20.2Zm4.5-6.15c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.57.13-.17.25-.65.8-.8.96-.14.17-.28.19-.53.07-.25-.12-1.06-.39-2.02-1.25a7.5 7.5 0 0 1-1.4-1.73c-.15-.25-.02-.38.1-.5.11-.1.25-.28.37-.42.12-.14.16-.24.24-.4.08-.17.04-.3-.02-.42-.06-.12-.57-1.36-.78-1.86-.2-.48-.4-.41-.57-.41h-.48c-.17 0-.45.06-.69.32-.24.25-.9.88-.9 2.14 0 1.25.92 2.47 1.05 2.64.12.17 1.8 2.74 4.35 3.84.61.26 1.1.42 1.47.54.62.2 1.18.17 1.63.1.5-.07 1.47-.6 1.68-1.17.21-.57.21-1.07.15-1.17-.06-.1-.22-.16-.47-.28Z" />
                  </svg>
                </a>
              </div>
            </div>
          </Col>

          <Col lg={4} md={6} className="footer-contact mb-4 mb-md-0">
            <h5 className="footer-section-title">Contact Us</h5>
            <ul className="contact-list">
              <li className="contact-item">
                <img width="16" src={address} alt="Address" className="contact-icon" />
                <span>Veda Business Park, 301, Bhawarkua Main Rd, Bhavarkuan Square, Bhanwar Kuwa, Indore, Madhya Pradesh 452001</span>
              </li>
              <li className="contact-item">
                <img width="16" src={email} alt="Email" className="contact-icon" />
                <span>Email: support@gmail.com</span>
              </li>
              <li className="contact-item">
                <img width="16" src={phone} alt="Phone" className="contact-icon" />
                <span>Phone: +91 7747004451</span>
              </li>
            </ul>
          </Col>

          <Col lg={4} md={12} className="footer-links mt-4 mt-lg-0">
            <h5 className="footer-section-title">Quick Links</h5>
            <ul className="links-list">
              <li><Link to="/">Fundamental</Link></li>
              <li><Link to="/jscompiler">JS Compiler</Link></li>
              <li><Link to="/topic/introduction-to-js-programming">Learning Hub</Link></li>
              <li><Link to="/Ai">AI Mentor</Link></li>
            </ul>
          </Col>
        </Row>

        <Row>
          <Col className="footer-bottom">
            <div className="footer-cta">
              Ready to level up your JavaScript skills? Start practicing with Coding Sharks today.
            </div>
            <div className="copyright-text">
              (c) {new Date().getFullYear()} Coding Sharks Training Institute | Turning Ideas into Code
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

