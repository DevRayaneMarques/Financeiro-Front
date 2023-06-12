import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Chart as ChartJS } from 'chart.js';
import { CategoryScale,LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale);
ChartJS.register(LinearScale);
ChartJS.register(PointElement);
ChartJS.register(LineElement);


const CustomChart = ({ transactions }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!Array.isArray(transactions)) {
      return; // Retorna se transactions não for um array válido
    }

    const labels = transactions.map(transaction => transaction.date);
    const entradaData = transactions.map(transaction => transaction.entrada);
    const saidaData = transactions.map(transaction => transaction.saida);

    const data = {
      labels,
      datasets: [
                {
          label: 'Entrada',
          data: entradaData,
          backgroundColor: 'rgba(75, 192, 192, 0.4)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Saída',
          data: saidaData,
          backgroundColor: 'rgba(255, 99, 132, 0.4)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true, // Tornar o gráfico responsivo
      scales: {
        x: {
          display: true, // Exibir o eixo X
          title: {
            display: true,
            text: 'Data', // Título do eixo X
          },
        },
        y: {
          display: true, // Exibir o eixo Y
          title: {
            display: true,
            text: 'Valor', // Título do eixo Y
          },
        },
      },
    };

    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');

    // Verificar e destruir o gráfico existente
    if (canvas.chart) {
      canvas.chart.destroy();
    }

    // Criar um novo gráfico
    canvas.chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });
  }, [transactions]);

  return <canvas ref={chartRef} />;
};

export default CustomChart;