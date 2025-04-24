import React from "react";
import { Button, Paper } from "@mui/material";
import "../styles/rot.css";
import logo from "../assets/images/logo_pptm.png";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import html2pdf from "html2pdf.js";
import Prog from "../components/ProgRetoma";
import progRetoma from "../assets/config/DataProgRetoma";
import HeaderRot from "../components/HeaderRot";
import InfoTCLD from "../components/InfoTCLD";
import descarregamento from "../assets/config/DataDecarregamento";
import RetomaTurno from "../components/RetomaTurno";
import retomado from "../assets/config/DataRetoma";
import EventosRot from "../components/EventosRot";
import Patio from "../components/Patio";

export default function Rot() {
  const gerarPDF = () => {
    const element = document.querySelector(".relatorio");

    const opt = {
      margin: 0,
      filename: "relatorio-turno.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
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
        <HeaderRot />
        <div className="section-tcld">
          <h2>Operação TCLD</h2>
          <InfoTCLD dados={descarregamento} />
        </div>

        <div className="section-patio">
        <h2>Pátio de carvão</h2>
          <Patio/>
        </div>

        <div className="section-programacao">
          <h2>Programação de Retoma</h2>
          <Prog dados={progRetoma} />
        </div>

        <div className="section-retoma">
          <h2>Retomado</h2>
          <RetomaTurno dados={retomado} />
        </div>

        <div className="section-evento">
          <h2>Eventos</h2>
          <EventosRot />
        </div>
      </Paper>
    </div>
  );
}
