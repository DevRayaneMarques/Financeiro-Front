import React, { useState, useEffect } from 'react';
import './Orcamento.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ExpenseChart from '../Grafico/Grafico'


function Orcamento() {
  const [categories, setCategories] = useState([]);
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [isBudgetGenerated, setIsBudgetGenerated] = useState(false);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [transactionFormLimit, setTransactionFormLimit] = useState('');

  const handleCategoryChange = (event, categoryId) => {
    const { value } = event.target;
    const newExpenses = { ...monthlyExpenses };
    newExpenses[categoryId] = parseInt(value);
    setMonthlyExpenses(newExpenses);
  };

  const handleLimitChange = (event) => {
    const value = event.target.value;
    setMonthlyLimit(parseInt(value));
    setTransactionFormLimit(parseInt(value));
  };

  const handleExpenseChange = (event, categoryId) => {
    const { value } = event.target;
    const newExpenses = { ...monthlyExpenses };
    newExpenses[categoryId] = parseInt(value);

    let totalExpenses = 0;
    for (const value of Object.values(newExpenses)) {
      totalExpenses += value;
    }

    if (totalExpenses > monthlyLimit) {
      alert('O valor total dos gastos excedeu o limite mensal!');
      newExpenses[categoryId] = monthlyLimit - totalExpenses + parseInt(value);
    }

    setMonthlyExpenses(newExpenses);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let totalExpenses = 0;
    for (const value of Object.values(monthlyExpenses)) {
      totalExpenses += value;
    }

    if (totalExpenses > monthlyLimit) {
      alert('O valor total dos gastos excedeu o limite mensal!');
    } else {
      alert('Orçamento gerado com sucesso!');
      setIsBudgetGenerated(true);
    }
  };

  const handleAddCategory = () => {
    setCategories([...categories, '']);
  };

  const handleCategoryNameChange = (event, index) => {
    const { value } = event.target;
    const updatedCategories = [...categories];
    updatedCategories[index] = value;
    setCategories(updatedCategories);
  };

    const handleDeleteCategory = (index) => {
    const updatedCategories = [...categories];
    updatedCategories.splice(index, 1);
    setCategories(updatedCategories);

    const updatedExpenses = { ...monthlyExpenses };
    delete updatedExpenses[index];
    setMonthlyExpenses(updatedExpenses);
  };

  const handleDeleteExpense = (categoryId) => {
    const updatedExpenses = { ...monthlyExpenses };
    delete updatedExpenses[categoryId];
    setMonthlyExpenses(updatedExpenses);
  };

   const calculateRemainingBalance = () => {
    const totalExpenses = Object.values(monthlyExpenses).reduce((acc, curr) => acc + curr, 0);
    return monthlyLimit - totalExpenses;
  };

  useEffect(() => {
    if (isBudgetGenerated) {
      const remainingBalance = calculateRemainingBalance();
      setRemainingBalance(remainingBalance);
    }
  }, [monthlyExpenses, monthlyLimit, isBudgetGenerated]);

  const handleGenerateBudget = () => {
    const totalExpenses = Object.values(monthlyExpenses).reduce((acc, curr) => acc + curr, 0);
    const remainingBalance = calculateRemainingBalance();
    setRemainingBalance(remainingBalance);
    setIsBudgetGenerated(true);
  };

 return (
  <div className="container">
    <h1 className="text-center">Orçamento Mensal</h1>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="limit">Limite de Gastos Mensais:</label>
        <input type="number" id="limit" name="limit" className="form-control form-control-sm w-auto" value={monthlyLimit} onChange={handleLimitChange} />
      </div>

      <div className="d-flex justify-content-start mt-3">
        <h2>Categorias de Gastos:</h2>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Valores</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index}>
              <td className="input-cell category-cell">
                <input
                  type="text"
                  id={`category-${index}`}
                  name={`category-${index}`}
                  className="form-control"
                  value={category}
                  onChange={(event) => handleCategoryNameChange(event, index)}
                />
              </td>
              <td className="input-cell category-cell">
                <input
                  type="number"
                  id={`expense-${index}`}
                  name={`expense-${index}`}
                  className="form-control"
                  value={monthlyExpenses[index] || 0}
                  onChange={(event) => handleExpenseChange(event, index)}
                />
              </td>
              <td>
                  <button type="button" className="btn  btn-sm" onClick={() => handleDeleteCategory(index)}>
                    <i class="bi bi-x"></i>
                  </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-start mt-3">
        <button type="button" className="btn btn-success btn-sm white-bg-btn black-border" onClick={handleAddCategory}>
                        Adicionar Categoria
        </button>
      </div>

      <div className="d-flex justify-content-start mt-3">
        <button type="submit" className="btn btn-success btn-sm white-bg-btn black-border" disabled={isBudgetGenerated}>
                                        Gerar Orçamento
        </button>
      </div>

      <hr />

      
         {isBudgetGenerated && (
          <div className="card">
            <h2>Total de Gastos:</h2>
            <p>{Object.values(monthlyExpenses).reduce((acc, curr) => acc + curr, 0)}</p>
            <h2>Saldo Restante:</h2>
            <p>{remainingBalance}</p>
        </div>
      )}
    </form>
              <ExpenseChart monthlyExpenses={monthlyExpenses} />

  </div>
);
}

export default Orcamento;