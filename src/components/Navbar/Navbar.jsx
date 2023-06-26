import { useState, useEffect, useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { logout} from "../../firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";
import { UserNameContext } from "../../contexts/UserContext";

export default function NavBar() {
  const navigate = useNavigate();
  const usuarioLogado = useContext(AuthContext);
  const dataUserName = useContext(UserNameContext);
  const semUsuario = "Usuário anônimo";
  const [usuario, setUsuario] = useState(semUsuario);
  const [showDropdown, setShowDropdown] = useState(false);
  const primeiroNome = usuario.split(" ")[0];
  const userPhoto = usuarioLogado ? usuarioLogado.userPhoto : null;

  useEffect(() => {
    if (usuarioLogado !== null) {
      if (userPhoto !== null) {
        setUsuario(dataUserName !== null ? dataUserName : semUsuario);
      } else {
        setUsuario(dataUserName !== null ? dataUserName : semUsuario);
      }
    } else {
      setUsuario(semUsuario);
    }
  }, [usuarioLogado, userPhoto, dataUserName]);

  

  function onLogout() {
    logout().then(() => {
      navigate("/login");
    });
  }

  
  function toggleDropdown() {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  }

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="light"
      variant="light"
      className=""
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/"></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <div className="welcome-container ms-auto">
            <i className="bi bi-chat-left-heart-fill"></i>
            <h6>Olá, {primeiroNome}!</h6>
          </div>
          <Nav>
            <NavDropdown
              id="perfil-dropdown"
              title={
                <img
                  src={userPhoto}
                  width="32"
                  height="32"
                  alt="fotoPerfil"
                  className="rounded-circle fotoPerfil"
                  id="fotoPerfil"
                />
              }
              className="ml-auto mt-auto"
              align="end"
              show={showDropdown}
              onToggle={toggleDropdown}
              drop="center"
            >
              <NavDropdown.Item id="/perfil">
                <img
                  src={userPhoto}
                  width="32"
                  height="32"
                  alt="fotoPerfil"
                  className="rounded-circle fotoPerfil"
                  id="fotoPerfil"
                />
                <h6 className="small-font">{usuario}</h6>
              </NavDropdown.Item>

              {usuarioLogado && (
                <>
                  <NavDropdown.Item as={NavLink} to="/contas">
                    <i className="ml-auto mt-auto bi bi-cash-coin small-font ">                      
                      Contas
                    </i>
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/orcamento">
                    <i className="ml-auto mt-auto bi bi-currency-exchange small-font">
                      Orçamento
                    </i>
                  </NavDropdown.Item>
                </>
              )}
              <NavDropdown.Divider />

              <NavDropdown.Item onClick={onLogout}>
                <i className="bi bi-box-arrow-right"></i>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
