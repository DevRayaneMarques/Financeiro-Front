// Importando os módulos necessários
import React, { useState } from 'react';
import "./Reminter.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Importando o CSS do Bootstrap

// Componente Reminder
const Reminder = () => {
  // Variáveis de estado para os detalhes do lembrete
  const [paymentDescription, setPaymentDescription] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [emailReminder, setEmailReminder] = useState(false);
  const [emailSent, setEmailSent] = useState(false); // Variável de estado para controlar se o e-mail de lembrete foi enviado

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Lógica para enviar lembrete por e-mail se estiver ativado
    if (emailReminder) {
      try {
        await sendEmailReminder(); // Chama a função sendEmailReminder() com await para aguardar o envio do e-mail
        setEmailSent(true);
      } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
      }
    }
  };

  // Função para enviar lembrete por e-mail
  const sendEmailReminder = async () => {
    const emailData = {
      paymentDescription,
      paymentAmount,
      paymentDate,
    };

    try {
      const response = await fetch('http://localhost:3001/key=API_KEY/AIzaSyBYr7z83uDtM4hpwi9c3t5gqo5NR6Ibu5U', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar o e-mail');
      }
    } catch (error) {
      throw new Error('Erro ao enviar o e-mail');
    }
  };

  return (
    <div className="container">
      <h2>Lembrete de Pagamento</h2>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="paymentDescription">Descrição:</label>
              <input
                type="text"
                id="paymentDescription"
                className="form-control"
                value={paymentDescription}
                onChange={(event) => setPaymentDescription(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="paymentAmount">Valor do Pagamento:</label>
              <input
                type="text"
                id="paymentAmount"
                className="form-control"
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="paymentDate">Data do Pagamento:</label>
              <input
                type="date"
                id="paymentDate"
                className="form-control"
                value={paymentDate}
                onChange={(event) => setPaymentDate(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="emailReminder">Lembrete por E-mail:</label>
              <input
                type="checkbox"
                id="emailReminder"
                className="form-check-input"
                checked={emailReminder}
                onChange={(event) => setEmailReminder(event.target.checked)}
              />
            </div>
            <br></br>
            <button type="submit" className="btn btn-primary">Enviar Lembrete</button>
          </form>
        </div>
        {emailSent && (
          <div className="col-md-6">
            <div className="alert alert-success mt-4">
              <h4 className="alert-heading">Sucesso!</h4>
              <p>Lembrete por e-mail enviado com sucesso!</p>
              <p>Descrição do pagamento: {paymentDescription}</p>
              <p>Valor: R${paymentAmount}</p>
              <p>Data: {paymentDate}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminder;
