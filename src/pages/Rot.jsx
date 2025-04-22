import React, { useState } from "react";
import { Button, Paper } from "@mui/material";
import "../styles/rot.css";
import logo from "../assets/images/logo_pptm.png";
import operacao from "../assets/config/operacao";
import Relogio from "../components/GraficRelogio";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import html2pdf from "html2pdf.js";
import Prog from "../components/ProgRetoma";
import progRetoma from "../assets/config/DataProgRetoma";

export default function Rot() {
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [turnoSelecionado, setTurnoSelecionado] = useState("");
  const [equipeSelecionada, setEquipeSelecionada] = useState("");
  const [elaboradorSelecionado, setElaboradorSelecionado] = useState("");
  const [elaboradores, setElaboradores] = useState([]);
  const [supervisor, setSupervisor] = useState("");

  const gerarPDF = () => {
    const element = document.querySelector(".relatorio");

    const opt = {
      margin: 0,
      filename: "relatorio-turno.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const pdfBlob = pdf.output("blob");
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, "_blank");
      });
  };

  const descarregamento = [
    { cliente: "ENERGIA PECEM" },
    { navio: "MV TESTE MOCADO" },
    { arqueacao: "75.456,25" },
    { atracacao: "19/04/2025 10:30" },
    { inicioOP: "19/04/2025 13:15" },
    { saldo: "32.159,2" },
    { fimOP: "22/04/2025 6:40" },
    { meta: 3.5 },
    { dias: 3.8 },
  ];
  const dadosNavio = Object.assign({}, ...descarregamento);

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
      <Button
        variant="outlined"
        onClick={gerarPDF}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <PictureAsPdfOutlinedIcon />
        gerar pdf
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
                    style={{ width: "150px" }}
                    defaultValue={dadosNavio.cliente}
                    readOnly
                  />
                </div>
                <div>
                  <label>Navio:</label>
                  <input
                    type="text"
                    style={{ width: "230px" }}
                    defaultValue={dadosNavio.navio}
                    readOnly
                  />
                </div>
                <div>
                  <label>Arqueação Inicial:</label>
                  <input
                    type="text"
                    style={{ width: "120px" }}
                    defaultValue={dadosNavio.arqueacao}
                    readOnly
                  />
                </div>
              </div>
              <div className="info-navio-row">
                <div>
                  <label>Atracação:</label>
                  <input
                    type="text"
                    defaultValue={dadosNavio.atracacao}
                    readOnly
                  />
                </div>
                <div>
                  <label>Início da operação:</label>
                  <input
                    type="text"
                    defaultValue={dadosNavio.inicioOP}
                    readOnly
                  />
                </div>
              </div>
              <div className="info-navio-row">
                <div>
                  <label>Saldo à Bordo:</label>
                  <input type="text" defaultValue={dadosNavio.saldo} readOnly />
                </div>
                <div>
                  <label>Previsão de Término:</label>
                  <input type="text" defaultValue={dadosNavio.fimOP} readOnly />
                </div>
              </div>
            </div>

            <div className="info-relogio">
              <Relogio
                plano={dadosNavio.meta}
                real={dadosNavio.dias}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="section-programacao">
          <h2>Programação de Retoma</h2>
          <Prog dados={progRetoma}/>
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
