import { useEffect, useMemo, useState } from "react";
import "./retomaturno.css";

export default function RetomaTurno({
  dataSelecionada,
  turnoSelecionado,
  setRetomaJson,
  rotJSON,
  deHoje,
}) {
  const [retomado, setRetomado] = useState([]);

  const dataFormatada = (d) => {
    const data = new Date(d);
    const dataStr = data.toLocaleDateString("pt-BR");
    const horaStr = data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dataStr} ${horaStr}`;
  };

  const dados = useMemo(() => {
    if (deHoje) return retomado;
    return rotJSON?.retoma_turno ?? retomado;
  }, [rotJSON, retomado, deHoje]);
  
  useEffect(() => {
    setRetomaJson(retomado);
  }, [retomado]);

  useEffect(() => {
    setRetomado([]);

    if (dataSelecionada && turnoSelecionado) {
      fetch("http://localhost:3001/retoma", {
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
  }, [dataSelecionada, turnoSelecionado]);

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
          {dados.length === 0 ? (
            <tr>
              <td colSpan="6">Sem retoma no turno</td>
            </tr>
          ) : (
            dados.map((item, index) => (
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
