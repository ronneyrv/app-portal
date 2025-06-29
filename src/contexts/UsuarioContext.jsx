import { createContext, useEffect, useState } from "react";

const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState({ nome: "", nivel: "" });

  const verificarLogin = () => {
    fetch("http://172.20.229.55:3000/verificaLogin", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.error("HTTP status:", res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.loggedIn) {
          setUsuario({
            nome: data.usuario.usuario,
            nivel: data.usuario.nivel,
          });
        } else {
          setUsuario({ nome: "", nivel: "" });
        }
      })
      .catch((err) => {
        console.error("Erro ao verificar login:", err);
        setUsuario({ nome: "", nivel: "" });
      });
  };

  useEffect(() => {
    verificarLogin();
  }, []);

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export default UsuarioContext;
