import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import axios from "axios";
import "../styles/login.css";
import logo from "../assets/images/logo_pptm.png";
import Alert from "@mui/material/Alert";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usuario || !senha) {
      fildAlert({ type: "warning", message: "Preencha todos os campos" });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        {
          usuario,
          senha,
        },
        {
          withCredentials: true,
        }
      );

      fildAlert(response.data);

      if (response.data.type === "success") {
        navigate("/pptm");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      fildAlert(error.response?.data);
    }
  };

  return (
    <Paper className="container-login" elevation={3}>
      <img src={logo} alt="Logo PPTM" />
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuário"
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
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <div className="signup">
          <Link to="/signup">Cadastrar usuário</Link>
        </div>
        <button type="submit">Entrar</button>
      </form>
      {message && (
        <div className="alert-login">
          <Alert severity={typeMessage}>{message}</Alert>
        </div>
      )}
    </Paper>
  );
}

export default Login;
