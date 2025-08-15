import { useEffect, useRef, useState } from "react";
import "./eventosrot.css";

export default function EventosRot({
  setEventosJson,
  setAndamentoJson,
  dadosJSON,
}) {
  const [eventoAndamento, setEventoAndamento] = useState("");
  const textareaRefs = useRef({});

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const [eventos, setEventos] = useState({
    "CSU/MHC": "",
    TCLD: "",
    "Stacker Reclaimer 01": "",
    "Stacker Reclaimer 02": "",
    Trippers: "",
    "Pátio de carvão": "",
    TMUT: "",
    "Empréstimo de carvão": "",
    "Autocombustão de pilha": "",
  });

  useEffect(() => {
    setEventosJson(eventos);
    setAndamentoJson(eventoAndamento);
  }, [eventos, eventoAndamento]);

  useEffect(() => {
    let dadosParaSetar;
    if (dadosJSON) {
      try {
        dadosParaSetar = JSON.parse(dadosJSON.eventos);
        setEventos(dadosParaSetar);
        setEventoAndamento(dadosJSON.eventos_andamento);
      } catch (error) {
        console.error("Erro ao fazer parse do JSON:", error);
      }
    } else {
      setEventos({
        "CSU/MHC": "",
        TCLD: "",
        "Stacker Reclaimer 01": "",
        "Stacker Reclaimer 02": "",
        Trippers: "",
        "Pátio de carvão": "",
        TMUT: "",
        "Empréstimo de carvão": "",
        "Autocombustão de pilha": "",
      });
      fetchBuscarEventoAndamento();
    }
  }, [dadosJSON]);

  useEffect(() => {
    if (textareaRefs.current.andamento) {
      autoResize(textareaRefs.current.andamento);
    }

    Object.keys(eventos).forEach((equipamento) => {
      const textarea = textareaRefs.current[equipamento];
      if (textarea) {
        autoResize(textarea);
      }
    });
  }, [eventos, eventoAndamento]);

  function autoResize(element) {
    if (element) {
      element.style.height = "auto";
      element.style.height = element.scrollHeight + "px";
    }
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

  const fetchBuscarEventoAndamento = () => {
    fetch(`${API_URL}/eventos/andamento/rot`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setEventoAndamento(data.data[0].andamento);
        } else {
          console.error("Erro ao buscar evento");
        }
      })
      .catch((error) => console.error("Erro de rede:", error));
  };

  const fetchAtualizarEventoAndamento = (text) => {
    fetch(`${API_URL}/eventos/andamento/rot`, {
      credentials: "include",
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newEvent: text }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          fetchBuscarEventoAndamento();
        }
      })
      .catch((err) => {
        console.error("Erro na base de dados:", err);
        fetchBuscarEventoAndamento();
      });
  };

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
          {Object.keys(eventos).map((equipamento, index) => {
            const id = `evento-${index}`;
            return (
              <div className="evento-row" key={equipamento}>
                <div className="evento-title">
                  <label htmlFor={id}>{equipamento}</label>
                </div>
                <div className="evento-content">
                  <textarea
                    id={id}
                    rows="2"
                    ref={(el) => (textareaRefs.current[equipamento] = el)}
                    value={eventos[equipamento]}
                    onChange={(e) => handleChange(e, equipamento)}
                    onBlur={handleBlur}
                    onInput={(e) => autoResize(e.target)}
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
                ref={(el) => (textareaRefs.current.andamento = el)}
                value={eventoAndamento}
                onChange={(e) => setEventoAndamento(e.target.value)}
                onBlur={(e) => fetchAtualizarEventoAndamento(e.target.value)}
                onInput={(e) => autoResize(e.target)}
                placeholder="Sem ocorrências em andamento;"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
