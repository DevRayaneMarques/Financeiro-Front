import React, { useEffect, useState } from 'react'; 
import { Bar } from 'react-chartjs-2';

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Acompamhamento Controle Financeiro',
    },
  },
};

export function Grafico({ orcamentoData }) {
  const [labels, setLabels] = useState([]);
  const [entrada, setEntrada] = useState([]);
  const [saida, setSaida] = useState([]);

  useEffect(() => {
    if (orcamentoData && orcamentoData.length > 0) {
      setLabels(orcamentoData.map((item) => item.date));
      setEntrada(orcamentoData.map((item) => (item.type === 'Entrada' ? item.amount : 0)));
      setSaida(orcamentoData.map((item) => (item.type === 'Saída' ? item.amount : 0)));
    }
  }, [orcamentoData]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Entrada',
        data: entrada,
        backgroundColor: 'rgba(8, 119, 8, 0.5)',
      },
      {
        label: 'Saída',
        data: saida,
        backgroundColor: 'rgba(226, 4, 4, 0.5)',
      },
    ],
  };

  return <Bar options={options} data={data} />;
}