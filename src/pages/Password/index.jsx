import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import MessageAlert from "../../components/MessageAlert";
import "./password.css";

function Password() {
  const navigate = useNavigate();
  const [typeMessage, setTypeMessage] = useState("");
  const [message, setMessage] = useState("");
  const [formNew, setFormNew] = useState({
    email: "",
    senha: "",
    senha2: "",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  function fildAlert(data) {
    switch (data.type) {
      case "info":
      case "success":
      case "error":
      case "warning":
        setTypeMessage(data.type);
        setMessage(data.message);
        break;
      default:
        setTypeMessage("info");
        setMessage("Algo inesperado ocorreu.");
        break;
    }
    setTimeout(() => {
      setTypeMessage("");
      setMessage("");
    }, 3000);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormNew((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formNew.email || !formNew.senha || !formNew.senha2) {
      fildAlert({ type: "info", message: "Preencha todos os campos" });
      return;
    }

    if (!emailRegex.test(formNew.email)) {
      fildAlert({ type: "info", message: "e-mail inválido" });
      return;
    }

    if (formNew.senha.length < 6) {
      fildAlert({ type: "info", message: "Senha menor que 6 dígitos" });
      return;
    }

    if (formNew.senha !== formNew.senha2) {
      fildAlert({ type: "info", message: "As senhas não coincidem" });
      return;
    }

    fetch(`${API_URL}/usuario`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dados: formNew }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("HTTP status:", res.status);
          fildAlert(res);
        }
        return res.json();
      })
      .then((data) => {
        if (data.type === "success") {
          fildAlert(data);
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          fildAlert(data);
          return;
        }
      })
      .catch((err) => {
        console.error("Erro ao cadastrar:", err);
        fildAlert(err.res?.data);
      });
  };

  return (
    <Paper className="container-reset" elevation={3}>
      <img src="/images/logo_pptm.png" alt="Logo PPTM" />
      <h4>Redefinir senha</h4>
      <form onSubmit={handleNewPassword}>
        <input
          type="email"
          placeholder="E-mail cadastrado"
          name="email"
          value={formNew.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Nova senha"
          name="senha"
          value={formNew.senha}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Confirme a nova senha"
          name="senha2"
          value={formNew.senha2}
          onChange={handleChange}
        />
        <button type="submit">Salvar senha</button>
      </form>
      <MessageAlert type={typeMessage} message={message} />
    </Paper>
  );
}

export default Password;
