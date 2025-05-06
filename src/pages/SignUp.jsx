import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import logo from "../assets/images/logo_pptm.png";
import MessageAlert from "../components/MessageAlert";
import "../styles/signup.css";

function Signup() {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
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

    if (!usuario || !email || !senha || !senha2) {
      fildAlert({ type: "warning", message: "Preencha todos os campos" });
      return;
    }

    if (!emailRegex.test(email)) {
      fildAlert({ type: "warning", message: "e-mail inválido" });
      return;
    }

    if (senha.length < 6) {
      fildAlert({ type: "warning", message: "Senha menor que 6 dígitos" });
      return;
    }

    if (senha !== senha2) {
      fildAlert({ type: "warning", message: "As senhas não coincidem" });
      return;
    }

    fetch("http://localhost:3001/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ usuario, email, senha }),
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
    <Paper className="container-signup" elevation={3}>
      <img src={logo} alt="Logo PPTM" />
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Nome social"
          value={usuario}
          onChange={(e) => {
            const valor = e.target.value;
            const formatado = valor
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase());
            setUsuario(formatado);
          }}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirme a senha"
          value={senha2}
          onChange={(e) => setSenha2(e.target.value)}
        />
        <button type="submit">Cadastrar</button>
      </form>
      <MessageAlert type={typeMessage} message={message} />
    </Paper>
  );
}

export default Signup;
