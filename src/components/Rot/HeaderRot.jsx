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
  rotJSON,
}) {
  const [operacao, setOperacao] = useState([]);
  const [elaboradores, setElaboradores] = useState([]);
  const [equipe, setEquipe] = useState("");
  const [elaborador, setElaborador] = useState("");

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

    const filtrados = operacao.filter((op) => op.equipe === equipe);
    setElaboradores(filtrados);
    const gestor = filtrados.length > 0 ? filtrados[0].gestor : "";
    setSupervisor(gestor);
  };

  const handleElaboradorChange = (e) => {
    const nome = e.target.value;
    setElaborador(nome);
    setElaboradorSelecionado(nome);
  };

  useEffect(() => {
    fetch("http://172.20.229.55:3000/equipe", {
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
    if (rotJSON) {
      const dados = rotJSON;
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

      const gestor = filtrados.length > 0 ? filtrados[0].gestor : "";
      setSupervisor(dados.supervisor || gestor);
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
  }, [rotJSON, operacao]);

  return (
    <div className="header">
      <div>
        <label>Data:</label>
        <input
          type="date"
          value={dataSelecionada}
          onChange={handleDataChange}
        />
      </div>
      <div>
        <label>Turno:</label>
        <select
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
        <label>Equipe:</label>
        {turnoSelecionado && (
          <select
            value={equipe}
            onChange={handleEquipeChange}
            style={{ display: dataSelecionada ? "block" : "none" }}
          >
            <option value="">Selecione</option>
            <option value="A">Equipe A</option>
            <option value="B">Equipe B</option>
            <option value="C">Equipe C</option>
            <option value="D">Equipe D</option>
          </select>
        )}
      </div>
      <div>
        <label>Elaborador:</label>
        <select
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
        <label>Supervisão:</label>
        <input
          type="text"
          value={supervisor}
          readOnly
          style={{ display: elaboradorSelecionado ? "block" : "none" }}
        />
      </div>
    </div>
  );
}
