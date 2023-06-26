import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Root } from "./pages/Root/Root";
import { AuthContext } from "./contexts/AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { Login } from "./pages/Login/Login";
import { Cadastro } from "./pages/Cadastro/Cadastro";
import { NotFound } from "./pages/NotsFound/NotFound";
import "./global.css";
import { IdContext } from "./contexts/IdContext";
import { getUser } from "./firebase/usuarios";
import { UserEmailContext, UserNameContext } from "./contexts/UserContext";
import { ResetPassword } from './components/EsqueciMinhaSenha/EsqueciMinhaSenha';
import NavBar from "./components/Navbar/Navbar";
import Orcamento from "./components/Orcamento/Orcamento";
import Lembrete from "./pages/Lembrete/Lembrete";

export function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [userId, setUserId] = useState(null);
  const [dataUserName, setDataUserName] = useState(null);
  const [dataUserEmail, setDataUserEmail] = useState(null);
  const [dataUserPhoto, setDataUserPhoto] = useState(null);
  const [loading, setLoading] = useState(null);
  

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUsuarioLogado(user);

      if (user) {
        setUserId(user.uid);
        getUser(user.uid).then((user) => {
          setDataUserName(user.name);
          setDataUserEmail(user.email);
          setDataUserPhoto(user.photoURL);
        });
      }
    });

    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);




  
  return (
    <>
      <UserNameContext.Provider value={dataUserName}>
        <UserEmailContext.Provider value={dataUserEmail}>
          <AuthContext.Provider value={usuarioLogado}>
            <IdContext.Provider value={userId}>
              
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Root />} />
                    <Route index element={<Login />} />
                    <Route path="/lembrete" element={<Lembrete />} />
                    <Route path="navBar" element={<NavBar />} />
                    <Route path="/orcamento" element={<Orcamento/>} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                    <Route path="/esqueci-minha-senha" element={<ResetPassword />} />
                  </Routes>
                </BrowserRouter>
             
            </IdContext.Provider>
          </AuthContext.Provider>
        </UserEmailContext.Provider>
      </UserNameContext.Provider>
    </>
  );
}

export default App;