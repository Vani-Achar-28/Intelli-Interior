import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isHome = location.pathname === "/";

  const scrollTo = (id) => {
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo-text">
          <span className="logo-leaf">🌿</span> INTELLI-INTERIOR
        </Link>
      </div>

      <ul className="navbar-links">
        {!token && (
          <>
            <li><button className="nav-scroll-btn" onClick={() => scrollTo("home")}>Home</button></li>
            <li><button className="nav-scroll-btn" onClick={() => scrollTo("approach")}>Approach</button></li>
            <li><button className="nav-scroll-btn" onClick={() => scrollTo("shop")}>Shop</button></li>
            <li><button className="nav-scroll-btn" onClick={() => scrollTo("about")}>About</button></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register" className="btn-register">Register</Link></li>
          </>
        )}

        {token && role === "user" && (
          <li><Link to="/user/dashboard">Dashboard</Link></li>
        )}

        {token && role === "admin" && (
          <li><Link to="/admin/dashboard">Admin Panel</Link></li>
        )}

        {token && (
          <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;