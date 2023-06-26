import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import Alert from './Alert';
import "./Orcamento.css";
import { Grafico } from './CustomChart';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';

Chart.register(CategoryScale);

const Orcamento = () => {
  const [items, setItems] = useState([]);
  const [descItem, setDescItem] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState(""); 
  const [editIndex, setEditIndex] = useState(-1);
  const [monthlyLimit, setMonthlyLimit] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [date, setDate] = useState("");
  const [entrada, setEntrada] = useState([]);
  const [saida, setSaida] = useState([]);
  const [chartData, setChartData] = useState([]);
  
  const [editedDesc, setEditedDesc] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [editedType, setEditedType] = useState("");
  const [editedCategory, setEditedCategory] = useState(""); 
  const [showError, setShowError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);

  useEffect(() => {
    loadItems();
    loadMonthlyLimit();
  }, []);

  const loadItems = () => {
    const storedItems = getItemsFromLocalStorage();
    setItems(storedItems);
  };

  const saveItemsToLocalStorage = (items) => {
    localStorage.setItem("db_items", JSON.stringify(items));
  };

  const getItemsFromLocalStorage = () => {
    const storedItems = localStorage.getItem("db_items");
    return JSON.parse(storedItems) || [];
  };

  const loadMonthlyLimit = () => {
    const storedMonthlyLimit = localStorage.getItem("monthly_limit");
    if (storedMonthlyLimit) {
      setMonthlyLimit(parseFloat(storedMonthlyLimit));
    }
  };

  const saveMonthlyLimitToLocalStorage = (limit) => {
    localStorage.setItem("monthly_limit", limit);
  };

  const deleteItem = (index) => {
    setDeleteIndex(index);
    setShowConfirmationModal(true);
  };

  const confirmDelete = () => {
    const updatedItems = [...items];
    updatedItems.splice(deleteIndex, 1);
    setItems(updatedItems);
    saveItemsToLocalStorage(updatedItems);
    setShowConfirmationModal(false);
    setDeleteIndex(-1);
  };

  

  const insertItem = () => {
  if (descItem === "" || amount === "" || type === "" || category === "" || date === "") {
    setShowError(true);
    return;
  }

  const newItem = {
    desc: descItem,
    amount: Math.abs(parseFloat(amount)).toFixed(2),
    type: type,
    category: category,
     date: date,
  };

  const updatedItems = [...items, newItem];
  setItems(updatedItems);
  saveItemsToLocalStorage(updatedItems);

  setDescItem("");
  setAmount("");

  const totalExpenses = updatedItems.reduce((total, item) => {
    if (item.type === "Saída") {
      return total + parseFloat(item.amount);
    } else {
      return total;
    }
  }, 0);

  const percentage = (totalExpenses / monthlyLimit) * 100;
  if (percentage >= 75 && percentage < 100) {
    setShowWarning(true);
  } else {
    setShowWarning(false);
  }

  if (totalExpenses > monthlyLimit) {
    setShowModal(true);
  }
};

   const getTotals = () => {
    const amountIncomes = items.filter((item) => item.type === "Entrada").map((transaction) => Number(transaction.amount));
    const amountExpenses = items.filter((item) => item.type === "Saída").map((transaction) => Number(transaction.amount));

    const totalIncomes = amountIncomes.reduce((acc, cur) => acc + cur, 0).toFixed(2);
    const totalExpenses = Math.abs(amountExpenses.reduce((acc, cur) => acc + cur, 0)).toFixed(2);
    const totalItems = (totalIncomes - totalExpenses).toFixed(2);

    return { totalIncomes, totalExpenses, totalItems };
  };

  const { totalIncomes, totalExpenses, totalItems } = getTotals();

  const saveItem = (index) => {
  const updatedItems = [...items];
  updatedItems[index] = {
    ...updatedItems[index],
    desc: editedDesc,
    amount: Math.abs(parseFloat(editedAmount)).toFixed(2),
    type: editedType,
    category: editedCategory, 
  };
  setItems(updatedItems);
  saveItemsToLocalStorage(updatedItems);
  setEditIndex(-1);
};

  const handleEditIndex = (index) => {
    setEditedDesc(items[index].desc);
    setEditedAmount(items[index].amount);
    setEditedType(items[index].type);
    setEditIndex(index);
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
    if (editIndex !== -1) {
      setEditedType(selectedType);
    }
    
    setCategory("");
  };

  const handleCategoryChange = (e) => {
const selectedCategory = e.target.value;
setCategory(selectedCategory);
if (editIndex !== -1) {
setEditedCategory(selectedCategory);
}
};

const incomeCategories = [
    { label: "Categoria 1", value: "categoria1" },
    { label: "Categoria 2", value: "categoria2" },
    
  ];

  const expenseCategories = [
    { label: "Categoria 1", value: "categoria1" },
    { label: "Categoria 2", value: "categoria2" },
    
  ];

  const renderCategoryOptions = () => {
    const categories = type === "Entrada" ? incomeCategories : expenseCategories;
    return categories.map((category) => (
      <option key={category.value} value={category.value}>
        {category.label}
      </option>
    ));
  };

  const handleMonthlyLimitChange = (e) => {
    const limit = parseFloat(e.target.value);
    setMonthlyLimit(limit);
    saveMonthlyLimitToLocalStorage(limit);
  };
  
 return (
    <div className="container">
      <div className="resume">
        <div>
          Entradas: R$<span className="incomes black-text">{totalIncomes}</span>
        </div>
        <div>
          Saídas: R$<span className="expenses black-text">{totalExpenses}</span>
        </div>
        <div>
          Total: R$<span className="total black-text">{totalItems}</span>
        </div>
        <div className="form-group">
          Limite Mensal:
          <input
          type="number"
          className="form-control"
          value={monthlyLimit}
          onChange={handleMonthlyLimitChange}
          placeholder="Limite Mensal"
          />
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Limite mensal:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          O limite mensal de gastos foi excedido. Por favor, revise suas despesas.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      <table className="table">
        <thead>
          <tr>
            <th className="center">Descrição</th>
            <th className="center">Valor</th>
            <th className="center">Tipo</th>
            <th className="center">Ação</th>
            <th className="center">Categoria</th>
            <th className="center">Data</th>
          </tr>
        </thead>
        <tbody>
         {items.map((item, index) => (
  <tr key={index}>
    <td className="text-center">
      {editIndex === index ? (
        <input
          type="text"
          value={editedDesc}
          onChange={(e) => setEditedDesc(e.target.value)}
        />
      ) : (
        item.desc
      )}
    </td>
    <td className="text-center text-center">
      {editIndex === index ? (
        <input
          type="text"
          value={editedAmount}
          onChange={(e) => setEditedAmount(e.target.value)}
        />
      ) : (
        `R$ ${item.amount}`
      )}
    </td>
    <td className="text-center columnType">
      {editIndex === index ? (
        <select value={editedType} onChange={(e) => setEditedType(e.target.value)}>
          <option value="">Tipo</option>
          <option value="Entrada">Entrada</option>
          <option value="Saída">Saída</option>
        </select>
      ) : (
        item.type === "Entrada" ? (
          <i className="bi bi-arrow-up-circle text-success"></i>
        ) : (
          <i className="bi bi-arrow-down-circle text-danger"></i>
        )
      )}
    </td>
    <td className="text-center columnAction">
  {editIndex === index ? (
    <div className="actionButtons">
      <button className="btn" onClick={() => saveItem(index)}>
        <i className="bi bi-check icon-small"></i>
      </button>
      <button className="btn" onClick={() => setEditIndex(-1)}>
        <i className="bi bi-x icon-small"></i>
      </button>
    </div>
  ) : (
    <div className="actionButtons">
      <button className="btn" onClick={() => handleEditIndex(index)}>
        <i className="bi bi-pencil icon-small"></i>
      </button>
      <button className="btn" onClick={() => deleteItem(index)}>
        <i className="bi bi-trash3 icon-small"></i>
      </button>
    </div>
  )}
</td>

 <td className="text-center" style={{ color: 'black' }}>
      {editIndex === index ? (
        <input type="text" value={editedCategory} onChange={(e) => setEditedCategory(e.target.value)} />
      ) : (
        <span style={{ color: 'black' }}>{item.category}</span>
      )}
    </td>
    <td className="text-center" style={{ color: 'black' }}>{item.date}</td> 
  </tr>
))}
        </tbody>
      </table>

      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir este item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="newItem">
        <div className="form-group">
      <input
        type="text"
        className="form-control"
        value={descItem}
        onChange={(e) => setDescItem(e.target.value)}
        placeholder="Descrição"
      />
    </div>
    <div className="form-group">
      <input
        type="text"
        className="form-control"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Valor"
      />
    </div>
    <div className="form-group">
      <select className="form-control" value={type} onChange={handleTypeChange}>
        <option value="">Tipo</option>
        <option value="Entrada">Entrada</option>
        <option value="Saída">Saída</option>
      </select>
    </div>

    <div className="form-group">
    <select className="form-control" value={category} onChange={handleCategoryChange}>
    <option value="">Categoria</option>
    {type === "Entrada" && (
          <optgroup label="Entrada">
            <option value="salario">Salário</option>
            <option value="salario 2">Salário 2</option>
            <option value="salarioConjuge">Salário Cônjuge</option> 
            <option value="bonus">Bônus</option>
            <option value="aposentadoria">aposentadoria</option>
            <option value="decimo">Décimo Terceiro</option>
            <option value="ferias">Férias</option>
            <option value="investimentos">Investimentos</option>
             <option value="juros">Juros de Investimentos</option>
            <option value="rendaExtra">Renda Extra</option>
            <option value="Vendas">Vendas</option>
            <option value="temporario">Temporário</option>
            <option value="outros">Outros</option>
            
            
          </optgroup>
        )}
      {type === "Saída" && (
      <optgroup label="Saída">    
      <option value="água">Água</option>
      <option value="luz">Luz</option>
      <option value="gás">Gás</option>
      <option value="aluguel_ou_financiamento">Aluguel ou Financiamento</option>
      <option value="iptu">IPTU</option>
      <option value="internet">Internet</option>
      <option value="condomínio">Condomínio</option>
      <option value="outros_despesas">Outros</option>
    
    
      <option value="compras_do_mês">Compras do mês</option>
      <option value="compras_da_semana">Compras da Semana</option>
      <option value="compras_diarias">Compras diárias</option>
      <option value="delivery">Delivery</option>
      <option value="restaurante">Restaurante</option>
      <option value="outros_alimentação">Outros</option>
    
    
      <option value="ipva">IPVA</option>
      <option value="financiamento">Financiamento (caso tenha)</option>
      <option value="gasolina">Gasolina</option>
      <option value="transporte_público">Transporte Público</option>
      <option value="aplicativos">Aplicativos (Uber, Buser,Taxi...)</option>
      <option value="outros_transporte">Outros</option>
    
      <option value="convênio_médico">Convênio Médico</option>
      <option value="academia">Academia</option>
      <option value="convênio_odontológico">Convênio Odontológico</option>
      <option value="medicamentos">Medicamentos</option>
      <option value="investimentos">Investimentos</option>
      <option value="poupanca">Poupança</option>
      <option value="previdencia">Previdência</option>
      <option value="rendaFixa">Renda Fixa(CDB,CDL...)</option>
      <option value="fundos">Fundos</option>        
    
      <option value="shopping">Shopping</option>
      <option value="cinema">Cinema</option>
      <option value="serviços_de_streaming">Serviços de Streaming (Netflix, Prime, etc)</option>
      <option value="parque">Parque</option>
      <option value="outros_lazer">Outros</option>
    </optgroup>
      )}
  </select>
</div>

<div className="form-group">
  <input
    type="date"
    className="form-control"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    placeholder="Data"
  />
</div>

    <button className="btn btn-primary" onClick={insertItem}>
      Adicionar Item
    </button>

    <Modal show={showError} onHide={() => setShowError(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Seu sistema financeiro:</Modal.Title>
      </Modal.Header>
      <Modal.Body>Preencha todos os campos!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowError(false)}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
 {showWarning && (
        <Alert
          message="Você está se aproximando do limite mensal de gastos!"
          type="warning"
          monthlyLimit={monthlyLimit}
        />
      )}
       <Grafico orcamentoData={items} />
</div>
);
};

export default Orcamento;