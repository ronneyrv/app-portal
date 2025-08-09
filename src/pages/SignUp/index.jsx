import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import MessageAlert from "../../components/MessageAlert";
import "./signup.css";

function Signup() {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [typeMessage, setTypeMessage] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

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

  function primeiraMaiuscula(str) {
    return str.replace(
      /\b(\p{L})(\p{L}*)/gu,
      (match, firstLetter, rest) => firstLetter.toLocaleUpperCase() + rest
    );
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

    fetch(`${API_URL}/usuarios`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario: usuario, email: email, senha: senha }),
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
      <img src="/images/logo_pptm.png" alt="Logo PPTM" />
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Nome social"
          value={usuario}
          onChange={(e) => {
            const valorSemEspaco = e.target.value.replace(/\s+/g, "");
            setUsuario(valorSemEspaco);
          }}
          onBlur={() => setUsuario(primeiraMaiuscula(usuario))}
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
