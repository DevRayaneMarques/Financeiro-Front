import React, { useState, useEffect } from 'react';
import { transactionsCollection } from '../../firebase/collections';
import { adicionarTransacao } from '../../firebase/transacoes';
import { format } from 'date-fns';
import Chart from '../Chart/Chart'; 

function AddTransactionForm({ transactionFormLimit }) {
  const [entrada, setEntrada] = useState(0);
  const [saida, setSaida] = useState(0);
  const [descricao, setDescricao] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [exibirResultado, setExibirResultado] = useState(false);
  const [saldo, setSaldo] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [receitas, setReceitas] = useState(0);
  const [transactionValue, setTransactionValue] = useState('');


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const snapshot = await transactionsCollection.get();
        const transactionData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTransactions(transactionData);
      } catch (error) {
        console.error('Erro ao recuperar transações:', error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const calcularSaldo = () => {
      let totalDespesas = 0;
      let totalReceitas = 0;

      transactions.forEach(transaction => {
        if (transaction.entrada) {
          totalReceitas += transaction.entrada;
        }
        if (transaction.saida) {
          totalDespesas += transaction.saida;
        }
      });

      setReceitas(totalReceitas);
      setDespesas(totalDespesas);
      setSaldo(totalReceitas - totalDespesas);
    };

    calcularSaldo();
  }, [transactions]);

  const formatarData = data => {
    return format(data, 'dd/MM/yyyy');
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const userId = 'coloque-o-id-do-usuario-aqui';

    const transaction = {
      entrada,
      saida,
      descricao,
      date: new Date(),
      userId,
    };

    try {
      await adicionarTransacao(transaction);
      setEntrada(0);
      setSaida(0);
      setDescricao('');

      setTransactions(prevTransactions => [
        ...prevTransactions,
        { id: transaction.id, ...transaction }
      ]);

      setExibirResultado(true);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };


   return (
    <div className="container">
      <h2>Painel de Controle</h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              Saldo atual: R${saldo.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              Despesas do mês: R${despesas.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
        Receitas do mês: R${receitas.toFixed(2)}
       </div>
          </div>
        </div>
      </div>
       <h2>Adicionar Transação</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="entrada" className="form-label">
                Limite de Gastos Mensais:
              </label>
              <div className="input-group">
                <span className="input-group-text">R$</span>
                <input
                  type="number"
                  className="form-control"
                  id="entrada"
                  value={transactionFormLimit}
                  onChange={() => {}}
                  required
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="saida" className="form-label">
                Valor de Saída:
              </label>
              <div className="input-group">
                <span className="input-group-text">R$</span>
                <input
                  type="number"
                  className="form-control"
                  id="saida"
                  value={saida}
                  onChange={event => setSaida(Number(event.target.value))}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="descricao" className="form-label">
                Descrição:
              </label>
              <input
                type="text"
                className="form-control"
                id="descricao"
                value={descricao}
                onChange={event => setDescricao(event.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Adicionar
        </button>
      </form>
      <h2>Rastreamento de Despesas e Receitas</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Entrada</th>
            <th>Saída</th>
            <th>Saldo</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.descricao}</td>
              <td>
                {transaction.entrada.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </td>
              <td>
                {transaction.saida.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </td>
              <td>
                {(transaction.entrada - transaction.saida).toLocaleString(
                  'pt-BR',
                  { style: 'currency', currency: 'BRL' }
                )}
              </td>
              <td>{formatarData(transaction.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Chart transactions={transactions} />
    </div>
  );
}

export default AddTransactionForm;