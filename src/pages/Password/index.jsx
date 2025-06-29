import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import logo from "../../../public/images/logo_pptm.png";
import MessageAlert from "../../components/MessageAlert";
import "./password.css";

function Password() {
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [novaSenha2, setNovaSenha2] = useState("");
  const [typeMessage, setTypeMessage] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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

  const handleNewPassword = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !novaSenha || !novaSenha2) {
      fildAlert({ type: "info", message: "Preencha todos os campos" });
      return;
    }

    if (!emailRegex.test(email)) {
      fildAlert({ type: "info", message: "e-mail inválido" });
      return;
    }

    if (novaSenha.length < 6) {
      fildAlert({ type: "info", message: "Senha menor que 6 dígitos" });
      return;
    }

    if (novaSenha !== novaSenha2) {
      fildAlert({ type: "info", message: "As senhas não coincidem" });
      return;
    }

    fetch("http://172.20.229.55:3000/usuario", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, senha: novaSenha }),
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
      <img src={logo} alt="Logo PPTM" />
      <h4>Redefinir senha</h4>
      <form onSubmit={handleNewPassword}>
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
