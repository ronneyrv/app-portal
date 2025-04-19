import React, { useState } from "react";
import { Paper, Divider, Stack } from "@mui/material";
import "../styles/rot.css";
import logo from "../assets/images/logo_pptm.png";
import operacao from "../assets/config/operacao";
import Relogio from "../components/GraficRelogio";

export default function Rot() {
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [turnoSelecionado, setTurnoSelecionado] = useState("");
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
    <Paper className="relatorio" elevation={3}>
      <div className="rot-header">
        <div className="rot-title">
          <h1>RELATÓRIO OPERACIONAL DE TURNO</h1>
          <img src={logo} alt="Logo PPTM" />
        </div>
      </div>
      <div class="header">
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
            <option value="manha">07:30 as 19:30</option>
            <option value="noite">19:30 as 07:30</option>
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
            {elaboradores.map((item, index) => (
              <option key={index} value={item.nome}>
                {item.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Supervisão:</label>
          <select
            value={supervisor}
            style={{ display: elaboradorSelecionado ? "block" : "none" }}
          >
            <option value="">{supervisor || "Selecione"}</option>
          </select>
        </div>
      </div>

      <div className="section-tcld">
        <h2>Operação TCLD</h2>
        <div className="grid-tcld">
          <div className="info-navio">
            <div className="info-navio-row">
              <div>
                <label>Cliente:</label>
                <select name="" id="" style={{ width: "150px" }}>
                  <option value="">Selecione</option>
                  <option value="AMP">ARCELORMITTAL</option>
                  <option value="EP">ENERGIA PECÉM</option>
                  <option value="ENEVA">ENEVA</option>
                </select>
              </div>
              <div>
                <label>Navio:</label>
                <input type="text" style={{ width: "230px", height: "31px" }} />
              </div>
              <div>
                <label>Arqueação Inicial:</label>
                <input type="text" style={{ width: "120px", height: "31px" }} />
              </div>
            </div>
            <div className="info-navio-row">
              <div>
                <label>Atracação:</label>
                <input type="text" />
              </div>
              <div>
                <label>Início da operação:</label>
                <input type="text" />
              </div>
            </div>
            <div className="info-navio-row">
              <div>
                <label>Saldo à Bordo:</label>
                <input type="text" />
              </div>
              <div>
                <label>Previsão de Término:</label>
                <input type="text" />
              </div>
            </div>
          </div>

          <div className="info-relogio">
            <Relogio plano={4} real={3} />
          </div>
        </div>
      </div>

      <div className="section-programacao">
        <h2>Programação de Retoma</h2>
        <table class="side-table">
          <thead>
            <tr>
              <th></th>
              <th>UG1</th>
              <th>UG2</th>
              <th>UG3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                <input type="text" placeholder="Data" />
              </th>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="text" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>Retomado</h2>
        <table class="table">
          <thead>
            <tr>
              <th>UG</th>
              <th>Equipamento</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Pilha</th>
              <th>Volume</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="text" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>Eventos</h2>
        <table class="side-table">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                <input type="text" placeholder="Ex: Falha UG1" />
              </th>
              <td>
                <input type="text" placeholder="Descreva aqui..." />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="footer">
        São Luís, ____ de ______________ de ______. Hora: ____:____
      </div>
    </Paper>
  );
}
