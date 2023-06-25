import {
  Button,
  Card,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import googleIcon from "../../assets/icons/google-white.svg";
import { InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import {
  loginEmailSenha,
  loginGoogle,
  } from "../../firebase/auth";
import { useNavigate, Route } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import "./Login.css";
import backgroundImage from "../../assets/images/Login.jpeg";

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const styles = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100vw",
  };

  const navigate = useNavigate();
  const [mostrarSenhaV, SetMostrarSenha] = useState(false);

  function onSubmit(data) {
    const { email, senha } = data;
    loginEmailSenha(email, senha)
      .then((user) => {
        toast.success(`Bem-vindo(a) ${user.email}`, {
          position: "bottom-right",
          duration: 2500,
        });
        navigate("/");
      })
      .catch((erro) => {
        toast.error(`Um erro aconteceu. Código: ${erro.code}`, {
          position: "bottom-right",
          duration: 2500,
        });
      });
  }
  function onLoginGoogle() {
    // then = quando der certo o processo
    loginGoogle()
      .then((user) => {
        toast.success(`Bem-vindo(a) ${user.email}`, {
          position: "bottom-right",
          duration: 2500,
        });
        navigate("/");
      })
      .catch((erro) => {
        // tratamento de erro
        toast.error(`Um erro aconteceu. Código: ${erro.code}`, {
          position: "bottom-right",
          duration: 2500,
        });
      });
  }

  const usuarioLogado = useContext(AuthContext);

  const mostrarSenha = () => {
    SetMostrarSenha(!mostrarSenhaV);
  };

  // Se tiver dados no objeto, está logado
  if (usuarioLogado !== null) {
    navigate("/");
  }
  return (
    <>
            <div className="align-self-center">
              <Card className="text-center p-4">
              <Card.Title id="Text" className="text-center"></Card.Title>
              <h4>Faça parte da nossa plataforma</h4>
              <p className="text-muted">
                Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
              </p>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group
                  className="organizer"
                  type="password"
                  placeholder="Senha"
                >
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    className={errors.email && "is-invalid"}
                    placeholder="Seu email"
                    {...register("email", {
                      required: "O email é obrigatório",
                    })}
                  />
                  <Form.Text className="invalid-feedback">
                    {errors.email?.message}
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Senha</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={mostrarSenhaV ? "text" : "password"}
                      className={errors.senha && "is-invalid"}
                      placeholder="Sua senha"
                      {...register("senha", {
                        required: "A senha é obrigatória",
                      })}
                      autoComplete="off"
                    />
                    <InputGroup.Text>
                      <a
                        className="mostrarSenha mt-3 mx-1"
                        onClick={mostrarSenha}
                      >
                        <i
                          className={`bi bi-eye${
                            mostrarSenhaV ? "-slash" : ""
                          }`}
                        ></i>
                      </a>
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Text className="invalid-feedback">
                    {errors.senha?.message}
                  </Form.Text>
                </Form.Group>
                <p className="text-muted">
          <Link to="/esqueci-minha-senha">Esqueci minha Senha</Link>
        </p>
                <Card className="button-login">
                  <Button type="submit" variant="success">
                    Login
                  </Button>
                  <hr />

                  <Button
                    className="mb-3 ms-2 btnLogin"
                    variant="danger"
                    onClick={onLoginGoogle}
                  >
                    <img src={googleIcon} width="30" alt="Google icon" /> Entrar
                    com o Google
                  </Button>

                </Card>
              </Form>
            </Card></div>
         
          <Toaster />

    </>
  );
}
