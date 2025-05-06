import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import logo from "../assets/images/logo_pptm.png";
import MessageAlert from "../components/MessageAlert";
import "../styles/password.css";

function Password() {
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [novaSenha2, setNovaSenha2] = useState("");
  const [typeMessage, setTypeMessage] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function fildAlert(data) {
    switch (data.type) {
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
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !novaSenha || !novaSenha2) {
      fildAlert({ type: "warning", message: "Preencha todos os campos" });
      return;
    }

    if (!emailRegex.test(email)) {
      fildAlert({ type: "warning", message: "e-mail inválido" });
      return;
    }

    if (novaSenha.length < 6) {
      fildAlert({ type: "warning", message: "Senha menor que 6 dígitos" });
      return;
    }

    if (novaSenha !== novaSenha2) {
      fildAlert({ type: "warning", message: "As senhas não coincidem" });
      return;
    }

    fetch("http://localhost:3001/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, novaSenha }),
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
          }, 2000);
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
      <img src={logo} alt="Logo PPTM" />
      <h4>Redefinir senha</h4>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="E-mail cadastrado"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirme a nova senha"
          value={novaSenha2}
          onChange={(e) => setNovaSenha2(e.target.value)}
        />
        <button type="submit">Salvar senha</button>
      </form>
      <MessageAlert type={typeMessage} message={message} />
    </Paper>
  );
}

export default Password;
