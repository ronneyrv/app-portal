import { useEffect, useMemo, useState } from "react";
import "./retomaturno.css";

export default function RetomaTurno({
  dataSelecionada,
  turnoSelecionado,
  setRetomaJson,
  dadosJSON,
}) {
  const [retomado, setRetomado] = useState([]);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const dataFormatada = (d) => {
    const data = new Date(d);
    const dataStr = data.toLocaleDateString("pt-BR");
    const horaStr = data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dataStr} ${horaStr}`;
  };

  useEffect(() => {
    setRetomaJson(retomado);
  }, [retomado]);

  useEffect(() => {
    let dadosParaSetar;
    if (dadosJSON) {
      try {
        dadosParaSetar = JSON.parse(dadosJSON.retoma_turno);
        setRetomado(dadosParaSetar);
      } catch (error) {
        console.error("Erro ao fazer parse do JSON:", error);
      }
    } else {
      fetchProgramacao();
    }
  }, [dadosJSON]);

  const fetchProgramacao = () => {
    if (!dataSelecionada || !turnoSelecionado) return;
    if (dataSelecionada && turnoSelecionado) {
      fetch(`${API_URL}/retoma`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          data: dataSelecionada,
          turno: turnoSelecionado,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            console.error("HTTP status:", res.status);
          }
          return res.json();
        })
        .then((data) => {
          if (data.type === "success") {
            setRetomado(data.data);
          }
        })
        .catch((err) => {
          console.error("Erro ao buscar o retomado:", err);
        });
    }
  };

  return (
    <div className="tabela-container">
      <table className="tabela-retomado">
        <thead>
          <tr>
            <th>Unidade</th>
            <th>Equipamento</th>
            <th>Pilha</th>
            <th>Início</th>
            <th>Fim</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {retomado.length === 0 ? (
            <tr>
              <td colSpan="6">Sem retoma no turno</td>
            </tr>
          ) : (
            retomado.map((item, index) => (
              <tr key={index}>
                <td>{item.ug}</td>
                <td>{item.maquina}</td>
                <td>{item.pilha}</td>
                <td>{dataFormatada(item.inicio)}</td>
                <td>{dataFormatada(item.fim)}</td>
                <td>{item.volume} t</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
