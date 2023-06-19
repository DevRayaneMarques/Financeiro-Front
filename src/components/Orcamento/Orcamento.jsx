import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import "./Orcamento.css"; 
import { Chart } from 'chart.js';


const ItemList = () => {
  const [items, setItems] = useState([]);
  const [descItem, setDescItem] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [monthlyLimit, setMonthlyLimit] = useState(0);

  const [editedDesc, setEditedDesc] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [editedType, setEditedType] = useState("");
  const [showError, setShowError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);

  const ExpenseChart = ({ monthlyExpenses }) => {
    const chartRef = useRef(null);
    const [selectedExpense, setSelectedExpense] = useState(null);

    
  useEffect(() => {
    if (!monthlyExpenses) {
      return;
    }
    const chartCanvas = chartRef.current;
    const ctx = chartCanvas.getContext('2d');

    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    const categories = Object.keys(monthlyExpenses);
    const values = Object.values(monthlyExpenses);

    const newChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [
          {
            label: 'Gastos',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: () => null, // Removendo a exibição dos números na barra horizontal
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                return `R$ ${value.toFixed(2)}`;
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = `R$ ${context.parsed.y.toFixed(2)}`;
                return `${label}: ${value}`;
              },
            },
          },
        },
      },
    });

    chartRef.current.chart = newChart;

    chartCanvas.onclick = (_, activeElements) => {
      if (activeElements && activeElements.length > 0) {
        const selectedIndex = activeElements[0].index;
        const selectedLabel = newChart.data.labels[selectedIndex];
        const selectedValue = newChart.data.datasets[0].data[selectedIndex];
        setSelectedExpense({ label: selectedLabel, value: selectedValue });
      } else {
        setSelectedExpense(null);
      }
    };

    return () => {
      newChart.destroy();
    };
  }, [monthlyExpenses]);

  const selectedExpenseDetails = selectedExpense ? (
    <p>
      Selecionado: {selectedExpense.label} - Valor: R$ {selectedExpense.value.toFixed(2)}
    </p>
  ) : null;

  return (
    <div>
      <canvas ref={chartRef} />
      {selectedExpenseDetails}
    </div>
  );
};
  

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
  if (descItem === "" || amount === "" || type === "") {
    setShowError(true);
    return;
  }

  const newItem = {
    desc: descItem,
    amount: Math.abs(parseFloat(amount)).toFixed(2),
    type: type,
  };

  const updatedItems = [...items, newItem];
  setItems(updatedItems);
  saveItemsToLocalStorage(updatedItems);

  setDescItem("");
  setAmount("");

  const totalItems = updatedItems.reduce((total, item) => {
    if (item.type === "Saída") {
      return total - parseFloat(item.amount);
    } else {
      return total;
    }
  }, 0);

  if (totalItems < -monthlyLimit) {
  // Excede o limite mensal
  setShowModal(true);
}
};
  const getTotals = () => {
    const amountIncomes = items
      .filter((item) => item.type === "Entrada")
      .map((transaction) => Number(transaction.amount));

    const amountExpenses = items
      .filter((item) => item.type === "Saída")
      .map((transaction) => Number(transaction.amount));

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
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
         {items.map((item, index) => (
  <tr key={index}>
    <td>
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
    <td>
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
    <td className="columnType">
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
    <td className="columnAction">
      {editIndex === index ? (
        <>
          <button className="btn" onClick={() => saveItem(index)}>
            <i class="bi bi-check"></i>
          </button>
          <button className="btn" onClick={() => setEditIndex(-1)}>
           <i class="bi bi-x"></i>
          </button>
        </>
      ) : (
        <>
          <button className="btn" onClick={() => handleEditIndex(index)}>
            <i className="bi bi-pencil"></i>
          </button>
          <button className="btn" onClick={() => deleteItem(index)}>
            <i className="bi bi-trash3"></i>
          </button>
        </>
      )}
    </td>
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
</div>
);
};

export default ItemList;
