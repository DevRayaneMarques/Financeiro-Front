import { useState, useEffect, useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../../assets/images/logo-cadastro.jpg";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";
import { semFotoPerfil } from "../../firebase/auth"; 

export default function NavBar() {
  const navigate = useNavigate();
  const usuarioLogado = useContext(AuthContext);
  const [fotoPerfil, setFotoPerfil] = useState(semFotoPerfil);
  const LOCAL_STORAGE_KEY = "myApp";
 const semUsuario = "Usuário anônimo"
  const [usuario, setUsuario] = useState(semUsuario);  
  const [showDropdown, setShowDropdown] = useState(false);
  const primeiroNome = usuario.split(' ')[0];


useEffect(() => {
    // Se o usuário estiver logado, usa a foto de perfil dele
    if (usuarioLogado !== null && usuarioLogado.photoURL !== null) {
      setFotoPerfil(usuarioLogado.photoURL);
      setUsuario(usuarioLogado.displayName)
      if (usuarioLogado.displayName !== null) {
        setUsuario(usuarioLogado.displayName)
      } else {
        setUsuario(semUsuario)
      }
    }
    if (usuarioLogado !== null && usuarioLogado.photoURL === null) {
      setFotoPerfil(semFotoPerfil);
      setUsuario(usuarioLogado.displayName)
      if (usuarioLogado.displayName !== null) {
        setUsuario(usuarioLogado.displayName)
      } else {
        setUsuario(semUsuario)
      };
    }
    // Se o usuário não estiver logado, usa o avatar padrão
    else {
      setFotoPerfil(semFotoPerfil);
      
    }
  }, [usuarioLogado]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  
  });
  
  useEffect(() => {
    const data = {usuario };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [usuario]);
  

  function onLogout() {
    logout().then(() => {
      navigate("/login");
    });
  }

  
  

  //   if (temaEscuro === true) {
  //     setTemaEscuro(false);
  //   }
  // }

  function toggleDropdown() {
    setShowDropdown((prevShowDropdown)=>!prevShowDropdown);
  }

return (
<Navbar collapseOnSelect expand="lg">
    <Container>
    <Navbar.Brand as={NavLink} to="/" className={'text-white'}>
      <img src={logo} height="30" 
      className="d-inline-block align-top" alt="React Bootstrap logo" 
      />
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="me-auto">
      
        
      </Nav>
        <div className='welcome-container ms-auto'>
        <i className={"bi bi-chat-left-heart-fill text-white"}></i>
        <h6 className={'text-white'}>
        Olá, {primeiroNome}!</h6>
        </div>
        <Nav>
            <NavDropdown
              id="perfil-dropdown"
              title={
                <img
                  src={fotoPerfil}
                  width="32"
                  alt="fotoPerfil"
                  className="rounded-circle"
                  id="fotoPerfil"
                />
              }
              className="ml-auto mt-auto"
              align="end"
              show={showDropdown}
              onToggle={toggleDropdown}
              drop="center" >
              <NavDropdown.Item id="/perfil">
                <img
                  src={fotoPerfil}
                  width="32"
                  alt="fotoPerfil"
                  className="rounded-circle me-2"
                  id="fotoPerfil"
                />
                <h6>{usuario}</h6>
              </NavDropdown.Item>
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
