import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import './Lembrete.css';
import axios from 'axios';

const Lembrete = () => {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Chamar o backend para enviar o email
    axios.post('/api/lembrete', {
      description,
      value,
      dueDate,
      email
    });
    
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <Container fluid className="p-0">
      <Row className="m-0 align-items-center">
        <Col md={6} className="p-5">
          <h1 className="display-4 mb-4">Lembrete de Contas</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formDescription">
              <Form.Label>Descrição</Form.Label>
              <Form.Control type="text" placeholder="Digite a descrição do pagamento" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formValue">
              <Form.Label>Valor</Form.Label>
              <Form.Control type="number" placeholder="Digite o valor do pagamento" value={value} onChange={(e) => setValue(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formDueDate">
              <Form.Label>Data de Vencimento</Form.Label>
              <Form.Control type="date" placeholder="Digite a data de vencimento do pagamento" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <hr></hr>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Digite o email da pessoa que está próxima do pagamento" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <br></br>
            <Button variant="primary" type="submit">
              Enviar
            </Button>
          </Form>
        </Col>
        <Col md={6} className="p-0">
          <img src="https://th.bing.com/th/id/OIP.zPnpFQKT7JRTWN18oCv6SgHaE7?pid=ImgDet&rs=1/500x500" alt="Conta" className="img-fluid" />
        </Col>
      </Row>
      {success && (
        <Alert variant="success" className="p-3 mt-3">
          Email enviado com sucesso!
        </Alert>
      )}
    </Container>
  );
};

export default Lembrete;