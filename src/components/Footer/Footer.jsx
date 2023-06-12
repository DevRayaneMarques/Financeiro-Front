import "./Footer.css";

function Footer() {
  return (
    <footer
      id="sticky-footer"
      style={{
        position: 'relative',
        left: 0,
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        backgroundColor: '#343a40',
        color: 'white',
        padding: '1rem',
      }}
    >
      <div className="container text-center">
        <small>&copy; 2021 Finance</small>
      </div>
    </footer>
  );
}
export default Footer;