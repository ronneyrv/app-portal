import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import MessageAlert from "../../components/MessageAlert";
import "./login.css";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usuario || !senha) {
      fildAlert({ type: "warning", message: "Preencha todos os campos" });
      return;
    }

    fetch(`${API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario: usuario, senha: senha }),
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
          navigate("/pptm");
        } else {
          fildAlert(data);
          return;
        }
      })
      .catch((err) => {
        console.error("Erro ao fazer login:", err);
        fildAlert(err.res?.data);
      });
  };

  return (
    <Paper className="container-login" elevation={3}>
      <img src="/images/logo_pptm.png" alt="Logo PPTM" />
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          autocomplete="username"
          onChange={(e) => {
            const valorSemEspaco = e.target.value.replace(/\s+/g, "");
            setUsuario(valorSemEspaco);
          }}
          onBlur={() => setUsuario(primeiraMaiuscula(usuario))}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autocomplete="current-password"
        />
        <div className="password">
          <Link to="/password">Recuperar senha</Link>
        </div>
        <button type="submit">Entrar</button>
        <div className="signup">
          <Link to="/signup">Cadastrar</Link>
        </div>
      </form>
      <MessageAlert type={typeMessage} message={message} />
    </Paper>
  );
}

export default Login;
