import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js';


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

export default ExpenseChart;  