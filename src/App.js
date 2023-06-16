import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Root } from "./pages/Root/Root";
import { AuthContext } from "./contexts/AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { Login }  from "./pages/Login/Login";
import { Cadastro } from "./pages/Cadastro/Cadastro";
import { NotFound } from "./pages/NotsFound/NotFound";
import "./global.css";
import { IdContext } from "./contexts/IdContext";
import { getUser } from "./firebase/usuarios";
import { UserEmailContext, UserNameContext } from "./contexts/UserContext";
import { ResetPassword } from './components/EsqueciMinhaSenha/EsqueciMinhaSenha';
import NavBar from "./components/Navbar/Navbar";
import Orcamento from "./components/Orcamento/Orcamento";


export function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [userId, setUserId] = useState(null);
  const [dataUserName, setDataUserName] = useState(null);
  const [dataUserEmail, setDataUserEmail] = useState(null);
  const [dataUserPhoto, setDataUserPhoto] = useState(null);
  const [loading, setLoading] = useState(null);
  const temaEscuro = useState(false);
  const [transactionsList, setTransactionsList] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [total, setTotal] = useState(0);
  const [dados, setDados] = useState([]);

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




  useEffect(() => {
    const amountExpense = transactionsList
      .filter((item) => item.expense)
      .map((transaction) => Number(transaction.amount));

    const amountIncome = transactionsList
      .filter((item) => !item.expense)
      .map((transaction) => Number(transaction.amount));

    const expense = amountExpense.reduce((acc, cur) => acc + cur, 0).toFixed(2);
    const income = amountIncome.reduce((acc, cur) => acc + cur, 0).toFixed(2);

    const total = Math.abs(income - expense).toFixed(2);

    setIncome(`R$ ${income}`);
    setExpense(`R$ ${expense}`);
    setTotal(`${Number(income) < Number(expense) ? "-" : ""}R$ ${total}`);
  }, [transactionsList]);

  const handleAddTransaction = (transaction) => {
    const newArrayTransactions = [...transactionsList, transaction];

    setTransactionsList(newArrayTransactions);

    // Atualiza as transações no localStorage
    localStorage.setItem("transactions", JSON.stringify(newArrayTransactions));
  };
 

  return (
    <>
    <div>
    {dados && dados.map((item) => (
  <p key={item.id}>{item.nome}</p>
))}
   
      <UserNameContext.Provider value={dataUserName}>
        <UserEmailContext.Provider value={dataUserEmail}>
          <AuthContext.Provider value={usuarioLogado}>
            <IdContext.Provider value={userId}>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Root />} />
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
      </div>
    </>
  
    
  );
}

export default App;