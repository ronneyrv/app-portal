import { useEffect, useMemo, useState } from "react";
import "./headerrot.css";

export default function HeaderRot({
  dataSelecionada,
  setDataSelecionada,
  turnoSelecionado,
  setTurnoSelecionado,
  setEquipeSelecionada,
  elaboradorSelecionado,
  setElaboradorSelecionado,
  setSupervisor,
  supervisor,
  dadosJSON,
}) {
  const [operacao, setOperacao] = useState([]);
  const [elaboradores, setElaboradores] = useState([]);
  const [equipe, setEquipe] = useState("");
  const [elaborador, setElaborador] = useState("");

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleDataChange = (e) => {
    setDataSelecionada(e.target.value);
  };

  const handleTurnoChange = (e) => {
    setTurnoSelecionado(e.target.value);
  };

  const handleEquipeChange = (e) => {
    const equipe = e.target.value;
    setEquipe(equipe);
    setEquipeSelecionada(equipe);

    const filtrados = operacao.filter((dado) => dado.equipe === equipe);
    setElaboradores(filtrados);
  };

  const handleElaboradorChange = (e) => {
    const nome = e.target.value;
    setElaborador(nome);
    setElaboradorSelecionado(nome);

    const objeto = operacao.filter((dado) => dado.nome === elaborador);
    setSupervisor(objeto);
    handleGestor(nome);
  };

  const handleGestor = (e) => {
    const objetoEncontrado = operacao.find((dado) => dado.nome === e);
    const valor = objetoEncontrado ? objetoEncontrado.gestor : null;
    setSupervisor(valor);
  };

  useEffect(() => {
    fetch(`${API_URL}/equipe`, {
      headers: {
        "Content-Type": "application/json",
      },
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
          setOperacao(data.data);
        }
      })
      .catch((err) => console.error("Erro ao buscar equipe:", err));
  }, []);

  useEffect(() => {
    if (dadosJSON) {
      const dados = dadosJSON;
      const equipeROT = dados.equipe || "";
      const elaboradorROT = dados.elaborador || "";

      setDataSelecionada(dados.data || "");
      setTurnoSelecionado(dados.turno || "");
      setEquipeSelecionada(equipeROT);
      setEquipe(equipeROT);

      const filtrados = operacao.filter((op) => op.equipe === equipeROT);
      setElaboradores(filtrados);
      setElaboradorSelecionado(elaboradorROT);
      setElaborador(elaboradorROT);
      setSupervisor(dados.supervisao);
    } else {
      setDataSelecionada("");
      setTurnoSelecionado("");
      setEquipeSelecionada("");
      setEquipe("");
      setElaboradores([]);
      setElaboradorSelecionado("");
      setElaborador("");
      setSupervisor("");
    }
  }, [dadosJSON, operacao]);

  return (
    <div className="header">
      <div>
        <label htmlFor="data">Data:</label>
        <input
          id="data"
          type="date"
          value={dataSelecionada}
          onChange={handleDataChange}
        />
      </div>
      <div>
        <label htmlFor="turno">Turno:</label>
        <select
          id="turno"
          style={{ display: dataSelecionada ? "block" : "none" }}
          value={turnoSelecionado}
          onChange={handleTurnoChange}
        >
          <option value="">Selecione</option>
          <option value="DIA">07:30 as 19:30</option>
          <option value="NOITE">19:30 as 07:30</option>
        </select>
      </div>
      <div>
        <label htmlFor="equipe">Equipe:</label>
        {turnoSelecionado && (
          <select
            id="equipe"
            value={equipe}
            onChange={handleEquipeChange}
            style={{ display: dataSelecionada ? "block" : "none" }}
          >
            <option value="">Selecione</option>
            <option value="A">Equipe A</option>
            <option value="B">Equipe B</option>
            <option value="C">Equipe C</option>
            <option value="D">Equipe D</option>
            <option value="ADM">Equipe ADM</option>
          </select>
        )}
      </div>
      <div>
        <label htmlFor="elaborador">Elaborador:</label>
        <select
          id="elaborador"
          style={{ display: equipe ? "block" : "none" }}
          value={elaborador}
          onChange={handleElaboradorChange}
        >
          <option value="">Selecione</option>
          {elaboradores.map((item) => (
            <option key={item.id} value={item.nome}>
              {item.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="getor">Gestor:</label>
        <input
          id="getor"
          type="text"
          value={supervisor}
          readOnly
          style={{ display: elaboradorSelecionado ? "block" : "none" }}
        />
      </div>
    </div>
  );
}
