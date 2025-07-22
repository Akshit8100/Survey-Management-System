import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";
import Logo from "../../assets/logo.png";
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <Image src={Logo} style={{ height: "40px", width: "40px", marginRight: "10px" }} />
        <h3>SurveySage</h3>
      </div>

      <ul className="footer-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      <div className="footer-right">
        <p>&copy; {new Date().getFullYear()} SurveySage. All rights reserved.</p>
      </div>
    </footer>
  );
}
