import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Intelli-Interior</p>
      <p>Designed & Developed as MCA Final Year Project</p>
    </footer>
  );
};

export default Footer;
