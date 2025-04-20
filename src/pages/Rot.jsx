import React, { useState } from "react";
import { Button, Paper } from "@mui/material";
import "../styles/rot.css";
import logo from "../assets/images/logo_pptm.png";
import operacao from "../assets/config/operacao";
import Relogio from "../components/GraficRelogio";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

export default function Rot() {
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [turnoSelecionado, setTurnoSelecionado] = useState("");
  const [equipeSelecionada, setEquipeSelecionada] = useState("");
  const [elaboradorSelecionado, setElaboradorSelecionado] = useState("");
  const [elaboradores, setElaboradores] = useState([]);
  const [supervisor, setSupervisor] = useState("");

  const descarregando = [
    { cliente: "Energia Pecem" },
    { navio: "MV TESTE MOCADO" },
    { arqueacao: "75.456,25" },
    { atracacao: "19/04/2025 10:30" },
    { inicioOP: "19/04/2025 13:15" },
    { saldo: "32.159,2" },
    { fimOP: "22/04/2025 6:40" },
    { meta: 3.5 },
    { dias: 3.8 },
  ];
  const dadosNavio = Object.assign({}, ...descarregando);

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
    <div>
      <Button variant="outlined">
        <PictureAsPdfOutlinedIcon />
      </Button>
      <Paper className="relatorio" elevation={3}>
        <div className="rot-header">
          <div className="rot-title">
            <h1>RELATÓRIO OPERACIONAL DE TURNO</h1>
            <img src={logo} alt="Logo PPTM" />
          </div>
        </div>
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

        <div className="section-tcld">
          <h2>Operação TCLD</h2>
          <div className="grid-tcld">
            <div className="info-navio">
              <div className="info-navio-row">
                <div>
                  <label>Cliente:</label>
                  <input
                    type="text"
                    style={{ width: "150px", height: "31px" }}
                    defaultValue={dadosNavio.cliente}
                  />
                </div>
                <div>
                  <label>Navio:</label>
                  <input
                    type="text"
                    style={{ width: "230px", height: "31px" }}
                    defaultValue={dadosNavio.navio}
                  />
                </div>
                <div>
                  <label>Arqueação Inicial:</label>
                  <input
                    type="text"
                    style={{ width: "120px", height: "31px" }}
                    defaultValue={dadosNavio.arqueacao}
                  />
                </div>
              </div>
              <div className="info-navio-row">
                <div>
                  <label>Atracação:</label>
                  <input type="text" defaultValue={dadosNavio.atracacao} />
                </div>
                <div>
                  <label>Início da operação:</label>
                  <input type="text" defaultValue={dadosNavio.inicioOP} />
                </div>
              </div>
              <div className="info-navio-row">
                <div>
                  <label>Saldo à Bordo:</label>
                  <input type="text" defaultValue={dadosNavio.saldo} />
                </div>
                <div>
                  <label>Previsão de Término:</label>
                  <input type="text" defaultValue={dadosNavio.fimOP} />
                </div>
              </div>
            </div>

            <div className="info-relogio">
              <Relogio plano={dadosNavio.meta} real={dadosNavio.dias} />
            </div>
          </div>
        </div>

        <div className="section-programacao">
          <h2>Programação de Retoma</h2>
          <table className="prog-tabela">
            <thead>
              <tr>
                <th rowSpan="2" colSpan="3"></th>
                <th colSpan="2">Segunda</th>
                <th colSpan="2">Terça</th>
                <th colSpan="2">Quarta</th>
                <th colSpan="2">Quinta</th>
                <th colSpan="2">Sexta</th>
                <th colSpan="2">Sábado</th>
                <th colSpan="2">Domingo</th>
                <th rowSpan="2" className="col-fim">
                  Observação
                </th>
              </tr>
              <tr>
                <th colSpan="2">21/abr</th>
                <th colSpan="2">22/abr</th>
                <th colSpan="2">23/abr</th>
                <th colSpan="2">24/abr</th>
                <th colSpan="2">25/abr</th>
                <th colSpan="2">26/abr</th>
                <th colSpan="2">27/abr</th>
              </tr>
            </thead>
            <tbody>
              <tr className="ug1">
                <td rowSpan="4" className="col-1">
                  UG1
                </td>
                <td rowSpan="2" className="col-2">
                  Retoma
                </td>
                <td className="col-3">Pilha</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td rowSpan="4"></td>
              </tr>
              <tr className="ug1">
                <td className="col-3">Navio</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="ug1">
                <td rowSpan="2" className="col-2">
                  Empilha
                </td>
                <td className="col-3">Pilha</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="ug1">
                <td className="col-3">Navio</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              <tr className="ug2">
                <td rowSpan="4" className="col-1">
                  UG2
                </td>
                <td rowSpan="2" className="col-2">
                  Retoma
                </td>
                <td className="col-3">Pilha</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td rowSpan="4"></td>
              </tr>
              <tr className="ug2">
                <td className="col-3">Navio</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="ug2">
                <td rowSpan="2" className="col-2">
                  Empilha
                </td>
                <td className="col-3">Pilha</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="ug2">
                <td className="col-3">Navio</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              <tr className="ug3">
                <td rowSpan="4" className="col-1">
                  UG3
                </td>
                <td rowSpan="2" className="col-2">
                  Retoma
                </td>
                <td className="col-3">Pilha</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td rowSpan="4"></td>
              </tr>
              <tr className="ug3">
                <td className="col-3">Navio</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="ug3">
                <td rowSpan="2">Empilha</td>
                <td className="col-3">Pilha</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="ug3">
                <td className="col-3">Navio</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="section-retoma">
          <h2>Retomado</h2>
        </div>

        <div className="section-evento">
          <h2>Eventos</h2>
          <table className="side-table">
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

        <div className="footer">
          São Luís, ____ de ______________ de ______. Hora: ____:____
        </div>
      </Paper>
    </div>
  );
}
