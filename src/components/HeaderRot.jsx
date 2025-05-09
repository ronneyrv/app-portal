import { useState } from "react";
import operacao from "../assets/config/DataOperacao";
import '../styles/headerrot.css';

export default function HeaderRot({
  dataSelecionada,
  setDataSelecionada,
  turnoSelecionado,
  setTurnoSelecionado,
}) {
  const [equipeSelecionada, setEquipeSelecionada] = useState("");
  const [elaboradorSelecionado, setElaboradorSelecionado] = useState("");
  const [elaboradores, setElaboradores] = useState([]);
  const [supervisor, setSupervisor] = useState("");

  const handleDataChange = (e) => {
    setDataSelecionada(e.target.value);
  };
  const handleTurnoChange = (e) => {
    setTurnoSelecionado(e.target.value);
  };
  const handleElaboradorChange = (e) => {
    setElaboradorSelecionado(e.target.value);
  };
  const handleEquipeChange = (e) => {
    const equipe = e.target.value;
    setEquipeSelecionada(equipe);
    const filtrados = operacao.filter((op) => op.equipe === equipe);
    setElaboradores(filtrados);
    const gestor = filtrados.length > 0 ? filtrados[0].gestor : "";
    setSupervisor(gestor);
  };

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
            value={equipeSelecionada}
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
          style={{ display: equipeSelecionada ? "block" : "none" }}
          value={elaboradorSelecionado}
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
