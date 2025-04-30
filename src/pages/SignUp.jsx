import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import axios from "axios";
import "../styles/signup.css";
import logo from "../assets/images/logo_pptm.png";
import Alert from "@mui/material/Alert";
import MessageAlert from "../components/MessageAlert";

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

    try {
      const response = await axios.post(
        "http://localhost:3001/register",
        {
          usuario,
          email,
          senha,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.type === "success") {
        fildAlert(response.data);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      fildAlert(error.response?.data);
    }
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
          placeholder="Confirmar senha"
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
