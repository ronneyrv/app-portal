import { useEffect, useMemo, useState } from "react";
import "./patioobservacao.css";
import NotifyBar from "../NotifyBar";

export default function PatioObs({ setObsJson, rotJSON, deHoje }) {
  const [obs, setObs] = useState([]);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const dados = useMemo(() => {
    if (deHoje) return obs;
    return rotJSON?.patio_obs ?? obs;
  }, [rotJSON, obs, deHoje]);

  useEffect(() => {
    if (!rotJSON) {
      fetchBuscarObs();
    }
  }, [rotJSON]);

  useEffect(() => {
    setObsJson(obs);
  }, [obs]);

  const fetchBuscarObs = () => {
    fetch(`${API_URL}/observacoes/rot`, {
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
    fetch(`${API_URL}/observacoes/rot`, {
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
          rows={6}
          value={dados}
          onChange={(e) => setObs(e.target.value)}
          onBlur={(e) => fetchAtualizarObs(e.target.value)}
        />
      </div>
    </div>
  );
}
