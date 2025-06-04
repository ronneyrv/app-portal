import { useEffect, useState } from "react";
import NotifyBar from "../components/NotifyBar";
import "../styles/patioobservacao.css";

export default function PatioObs() {
  const [obs, setObs] = useState([]);

  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchBuscarObs();
  }, []);

  const fetchBuscarObs = () => {
    fetch("http://localhost:3001/observacoes/rot", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          console.error("HTTP status:", res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.type === "success") {
          setObs(data.data[0].observacao);
        } else {
          console.error("Erro ao buscar observações");
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  };

  const fetchAtualizarObs = (text) => {
    fetch("http://localhost:3001/observacoes/rot", {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newObs: text }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("HTTP status:", res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.type === "success") {
          fetchBuscarObs();
        }
      })
      .catch((err) => {
        console.error("Erro na base de dados:", err);
        fetchBuscarObs();
      });
  };

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <div className="obs">
        <h3>Observações:</h3>
        <textarea
          rows={7}
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          onBlur={(e) => fetchAtualizarObs(e.target.value)}
        />
      </div>
    </div>
  );
}
