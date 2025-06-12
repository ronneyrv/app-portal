import { useEffect, useMemo, useState } from "react";
import "../styles/eventosrot.css";

export default function EventosRot({
  setAndamentoJson,
  setEventosJson,
  rotJSON,
  deHoje,
}) {
  const [eventoAndamento, setEventoAndamento] = useState([]);
  const equipamentos = [
    "CSU/MHC",
    "TCLD",
    "Stacker Reclaimer 01",
    "Stacker Reclaimer 02",
    "Trippers",
    "Pátio de carvão",
    "TMUT",
    "Empréstimo de carvão",
    "Autocombustão de pilha",
  ];

  const [eventos, setEventos] = useState(() => {
    const inicial = {};
    equipamentos.forEach((eq) => (inicial[eq] = ""));
    return inicial;
  });

  const event = useMemo(() => {
    if (deHoje) return eventoAndamento;
    return rotJSON?.eventos_andamento ?? eventoAndamento;
  }, [rotJSON, eventoAndamento, deHoje]);

  const dados = useMemo(() => {
    if (deHoje) return equipamentos;
    return rotJSON?.eventos ? Object.keys(rotJSON.eventos) : equipamentos;
  }, [rotJSON, equipamentos, deHoje]);

  function autoResize(e) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }

  function handleChange(e, equipamento) {
    const { value } = e.target;
    setEventos((prev) => ({
      ...prev,
      [equipamento]: value,
    }));
  }

  function handleBlur() {
    setEventosJson(eventos);
  }

  const fetchBuscarEvent = () => {
    fetch("http://localhost:3001/eventos/andamento/rot", {
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
          setEventoAndamento(data.data[0].andamento);
        } else {
          console.error("Erro ao buscar evento");
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  };

  const fetchAtualizarEvent = (text) => {
    fetch("http://localhost:3001/eventos/andamento/rot", {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newEvent: text }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("HTTP status:", res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.type === "success") {
          fetchBuscarEvent();
        }
      })
      .catch((err) => {
        console.error("Erro na base de dados:", err);
        fetchBuscarEvent();
      });
  };

  useEffect(() => {
    if (rotJSON?.eventos) {
      setEventos(rotJSON.eventos);
    }
  }, [rotJSON]);

  useEffect(() => {
    if (rotJSON === null) {
      const vazio = {};
      equipamentos.forEach((eq) => (vazio[eq] = ""));
      setEventos(vazio);
    }
  }, [rotJSON]);

  useEffect(() => {
    setEventosJson(eventos);
    setAndamentoJson(eventoAndamento);
  }, [eventos, setEventosJson, eventoAndamento, setAndamentoJson]);

  useEffect(() => {
    if (!rotJSON) {
      fetchBuscarEvent();
    }
  }, [rotJSON]);

  return (
    <div className="evento-main">
      <div className="evento-container">
        <div className="evento-header">
          <div className="evento-header-a">
            <label>Equipamento</label>
          </div>
          <div className="evento-header-b">
            <label> Resumo dos eventos (Últimas 12h)</label>
          </div>
        </div>

        <div className="rows">
          {dados.map((item, index) => {
            const id = `evento-${index}`;
            return (
              <div className="evento-row" key={index}>
                <div className="evento-title">
                  <label htmlFor={id}>{item}</label>
                </div>
                <div className="evento-content">
                  <textarea
                    id={id}
                    rows="2"
                    value={eventos[item]}
                    onChange={(e) => handleChange(e, item)}
                    onBlur={handleBlur}
                    onInput={autoResize}
                    placeholder="Sem ocorrências no turno;"
                  />
                </div>
              </div>
            );
          })}
          <div className="evento-row">
            <div className="evento-title">
              <label htmlFor={"ocorrencia"}>Ocorrência em andamento</label>
            </div>
            <div className="evento-content">
              <textarea
                id={"ocorrencia"}
                rows="2"
                value={event}
                onChange={(e) => setEventoAndamento(e.target.value)}
                onBlur={(e) => fetchAtualizarEvent(e.target.value)}
                onInput={autoResize}
                placeholder="Sem ocorrências em andamento;"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
