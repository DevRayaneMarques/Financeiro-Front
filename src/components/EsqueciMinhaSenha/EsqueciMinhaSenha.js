import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { auth } from "../../firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";


export function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  function onSubmit(data) {
    setLoading(true);

      sendPasswordResetEmail(auth, data.email)
      .then(() => {
        toast.success("E-mail de redefinição de senha enviado!", {
          position: "bottom-right",
          duration: 2500,
        });
      })
      .catch((error) => {
        toast.error(`Erro ao enviar e-mail: ${error.message}`, {
          position: "bottom-right",
          duration: 2500,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Seu email"
          className={errors.email ? "is-invalid" : ""}
          {...register("email", { required: "Email é obrigatório" })}
        />
        <Form.Text className="invalid-feedback">
          {errors.email?.message}
        </Form.Text>
      </Form.Group>
      <Button type="submit" variant="success" disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </Button>
    </Form>
  );
}