import React, { useState } from "react";
import { Button, Paper } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import SaveIcon from "@mui/icons-material/Save";
import Divider from "@mui/material/Divider";

import descarregamento from "../assets/config/DataDecarregamento";

import Prog from "../components/ProgRetoma";
import HeaderRot from "../components/HeaderRot";
import InfoTCLD from "../components/InfoTCLD";
import RetomaTurno from "../components/RetomaTurno";
import EventosRot from "../components/EventosRot";
import Patio from "../components/Patio";
import ValorEstoque from "../components/ValorEstoque";
import LoadingSpinner from "../components/LoadingSpinner";
import NotifyBar from "../components/NotifyBar";
import ModalConfirm from "../components/ModalConfirm";
import PatioUmectacao from "../components/PatioUmectacao";
import PatioPolimero from "../components/PatioPolimero";
import PatioObs from "../components/PatioObservacao";
import "../styles/rot.css";

export default function Rot() {
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [turnoSelecionado, setTurnoSelecionado] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");

  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const salvarROT = () => {
    setConfirmMessage(
      "Tem certeza que deseja salvar o ROT?\nDepois de salvar, não poderá alterar sem permição!"
    );
    setConfirm(true);
  };

  const handleConfirm = async () => {
    setConfirm(false);
    setLoading(true);

    try {
      await null; // sua função fetch
      // Notificar sucesso...
    } catch (error) {
      console.error(error);
      // Notificar erro...
    } finally {
      setLoading(false); // desliga o spinner
    }
  };

  const buscarROT = () => {};

  const gerarPDF = () => {
    const element = document.querySelector(".pdf");
    setLoading(true);

    if (!element) {
      setLoading(false);
      setNotify({
        open: true,
        message: "Elemento do relatório não encontrado!",
        severity: "error",
      });
      return;
    }

    element.querySelectorAll("input").forEach((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        if (input.checked) {
          input.setAttribute("checked", "checked");
        } else {
          input.removeAttribute("checked");
        }
      } else {
        input.setAttribute("value", input.value);
      }
    });

    element.querySelectorAll("textarea").forEach((textarea) => {
      textarea.innerHTML = textarea.value;
    });

    element.querySelectorAll("select").forEach((select) => {
      Array.from(select.options).forEach((option) => {
        if (option.selected) {
          option.setAttribute("selected", "selected");
        } else {
          option.removeAttribute("selected");
        }
      });
    });

    const styleContent = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
        } catch (e) {
          console.error("Erro ao acessar cssRules:", e);
          setNotify({
            open: true,
            message: "Erro ao acessar cssRules!",
            severity: "error",
          });
          return "";
        }
      })
      .join("");

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Relatório Operacional</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 20mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          ${styleContent}
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `;

    fetch("http://localhost:3001/gerar-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao gerar PDF");
        setLoading(false);
        setNotify({
          open: true,
          message: res.message,
          severity: res.type,
        });
        return res.blob();
      })
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setNotify({
          open: true,
          message: "Erro ao gerar PDF",
          severity: "error",
        });
      });
  };

  return (
    <div>
      {loading ? <LoadingSpinner /> : null}
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <ModalConfirm
        open={confirm}
        message={confirmMessage}
        onConfirm={handleConfirm}
        onClose={() => setConfirm(false)}
      />
      <div className="buttons-rot">
        <Button variant="outlined" onClick={salvarROT}>
          <SaveIcon style={{ marginRight: "5px" }} />
          Salvar
        </Button>
        <Button variant="outlined" onClick={buscarROT}>
          <FindInPageIcon style={{ marginRight: "5px" }} />
          Buscar
        </Button>
        <Button variant="outlined" onClick={gerarPDF}>
          <PictureAsPdfIcon style={{ marginRight: "5px" }} />
          Gerar
        </Button>
      </div>

      <Paper className="relatorio" elevation={3}>
        <div className="pdf">
          <div className="rot-header">
            <div className="rot-title">
              <h1>RELATÓRIO OPERACIONAL DE TURNO</h1>
              <img src="http://localhost:5173/logo.png" alt="Logo PPTM" />
            </div>
          </div>
          <HeaderRot
            dataSelecionada={dataSelecionada}
            setDataSelecionada={setDataSelecionada}
            turnoSelecionado={turnoSelecionado}
            setTurnoSelecionado={setTurnoSelecionado}
          />
          <div className="section-tcld">
            <h2>Operação TCLD</h2>
            <InfoTCLD dados={descarregamento} />
          </div>

          <div className="section-patio">
            <h2>Pátio de carvão</h2>
            <div className="area-patio">
              <div className="area-patio-pilha">
                <Patio />
              </div>
              <div className="area-patio-controle">
                <div className="area-patio-umectacao">
                  <PatioUmectacao />
                </div>
                <Divider />
                <div className="area-patio-polimero">
                  <PatioPolimero />
                </div>
                <Divider />
                <div className="area-patio-obs">
                  <PatioObs />
                </div>
              </div>
            </div>
            <ValorEstoque />
          </div>
          <div className="section-programacao">
            <h2>Programação de Retoma</h2>
            <Prog />
          </div>
          <div className="section-retoma">
            <h2>Retoma Realizada</h2>
            <RetomaTurno
              dataSelecionada={dataSelecionada}
              turnoSelecionado={turnoSelecionado}
            />
          </div>
          <div className="section-evento">
            <h2>Eventos</h2>
            <EventosRot />
          </div>
        </div>
      </Paper>
    </div>
  );
}
