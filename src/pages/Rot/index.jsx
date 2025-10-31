import React, { useEffect, useState } from "react";
import { Button, Paper } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import Divider from "@mui/material/Divider";

import Prog from "../../components/Rot/ProgRetoma";
import HeaderRot from "../../components/Rot/HeaderRot";
import InfoTCLD from "../../components/Rot/InfoTCLD";
import RetomaTurno from "../../components/Rot/RetomaTurno";
import EventosRot from "../../components/Rot/EventosRot";
import Patio from "../../components/Rot/Patio";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import PatioPolimero from "../../components/Rot/PatioPolimero";
import ModalRot from "../../components/Rot/ModalRot";
import ValorEstoque from "../../components/Rot/ValorEstoque";
import NotifyBar from "../../components/NotifyBar";
import PatioUmectacao from "../../components/Rot/PatioUmectacao";
import PatioObs from "../../components/Rot/PatioObservacao";
import "./rot.css";

export default function Rot() {
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [turnoSelecionado, setTurnoSelecionado] = useState("");
  const [equipeSelecionada, setEquipeSelecionada] = useState("");
  const [elaboradorSelecionado, setElaboradorSelecionado] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmData, setConfirmData] = useState(false);
  const [funcaoPDF, setFuncaoPDF] = useState(false);
  const [deHoje, setDeHoje] = useState(true);

  const [infoTcldJson, setInfoTcldJson] = useState(null);
  const [patioJson, setPatioJson] = useState(null);
  const [umectacaoJson, setUmectacaoJson] = useState(null);
  const [polimeroJson, setPolimeroJson] = useState(null);
  const [polimeroVolJson, setPolimeroVolJson] = useState(null);
  const [obsJson, setObsJson] = useState(null);
  const [valorEstoqueJson, setValorEstoqueJson] = useState(null);
  const [programacaoJson, setProgramacaoJson] = useState(null);
  const [retomaJson, setRetomaJson] = useState(null);
  const [eventosJson, setEventosJson] = useState(null);
  const [andamentoJson, setAndamentoJson] = useState(null);
  const [dadosJSON, setDadosJSON] = useState(null);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const camposPreenchidos =
      funcaoPDF &&
      dataSelecionada &&
      turnoSelecionado &&
      equipeSelecionada &&
      elaboradorSelecionado &&
      supervisor;

    if (!camposPreenchidos) return;

    const executar = async () => {
      await gerarPDF();
      setFuncaoPDF(false);
      setLoading(false);
      setDadosJSON(null);
    };

    executar();
  }, [
    funcaoPDF,
    dataSelecionada,
    turnoSelecionado,
    equipeSelecionada,
    elaboradorSelecionado,
    supervisor,
  ]);

  const buscarROT = () => {
    setConfirmData(true);
  };

  const PDF = async () => {
    const turno = verificarTurno(dataSelecionada, turnoSelecionado);
    let show = false;
    let message = "";
    let severity = "";
    switch (turno) {
      case "invalido":
        show = true;
        message = "Turno inválido";
        severity = "error";
        break;
      case "passado":
        show = true;
        message = "Para a data informada, tente BUSCAR ROT";
        severity = "info";
        break;
      case "futuro":
        show = true;
        message = "Data/Turno inválido";
        severity = "error";
        break;

      default:
        show = false;
        message = "";
        severity = "";
        break;
    }
    setNotify({
      open: show,
      message: message,
      severity: severity,
    });

    if (turno === "atual") {
      setLoading(true);
      const salva = await salvarJSON();

      if (!salva.success) {
        setLoading(false);
        setNotify({
          open: true,
          message: resultado.message,
          severity: resultado.severity,
        });
        return;
      }
      const executar = async () => {
        await gerarPDF();
        setLoading(false);
      };
      executar();
    }
  };

  const salvarROT = async () => {
    const turno = verificarTurno(dataSelecionada, turnoSelecionado);

    if (turno === "atual") {
      setLoading(true);
      const salva = await salvarJSON();

      if (!salva.success) {
        setLoading(false);
        setNotify({
          open: true,
          message: resultado.message,
          severity: resultado.severity,
        });
        return;
      } else {
        setLoading(false);
        setNotify({
          open: true,
          message: salva.message,
          severity: salva.severity,
        });
      }
    } else {
      setNotify({
        open: true,
        message: "Verifique a Data e o Turno do ROT",
        severity: "info",
      });
      return;
    }
  };

  function verificarTurno(dataTurno, turno) {
    const [year, month, day] = dataTurno.split("-").map(Number);
    const agora = new Date();
    const dataBase = new Date(year, month - 1, day);
    let inicio, fim;

    if (turno.toUpperCase() === "DIA") {
      inicio = new Date(dataBase);
      inicio.setHours(7, 30, 0, 0);
      fim = new Date(dataBase);
      fim.setHours(19, 30, 0, 0);
    } else if (turno.toUpperCase() === "NOITE") {
      inicio = new Date(dataBase);
      inicio.setHours(19, 30, 0, 0);
      fim = new Date(dataBase);
      fim.setDate(fim.getDate() + 1);
      fim.setHours(7, 30, 0, 0);
    } else {
      return "invalido";
    }

    if (agora >= inicio && agora < fim) {
      return "atual";
    } else if (agora < inicio) {
      return "futuro";
    } else {
      return "passado";
    }
  }

  const salvarJSON = async () => {
    try {
      const res = await fetch(`${API_URL}/rot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          data: dataSelecionada,
          turno: turnoSelecionado,
          equipe: equipeSelecionada,
          elaborador: elaboradorSelecionado,
          supervisao: supervisor,
          info_tcld: infoTcldJson,
          patio: patioJson,
          patio_umectacao: umectacaoJson,
          patio_polimero: polimeroJson,
          patio_polimero_vol: polimeroVolJson,
          patio_obs: obsJson,
          valor_estoque: valorEstoqueJson,
          programacao: programacaoJson,
          retoma_turno: retomaJson,
          eventos: eventosJson,
          eventos_andamento: andamentoJson,
        }),
      });
      const data = await res.json();

      if (!res.ok || data.type !== "success") {
        return { success: false, message: data.message, severity: data.type };
      }

      return { success: true, message: data.message, severity: data.type };
    } catch (error) {
      console.error("Erro em salvar os dados ROT:", error);
      return {
        success: false,
        message: "Erro ao salvar os dados!",
        severity: "error",
      };
    }
  };

  const gerarPDF = async () => {
    const element = document.querySelector(".pdf");

    if (
      !dataSelecionada ||
      !turnoSelecionado ||
      !equipeSelecionada ||
      !elaboradorSelecionado ||
      !supervisor
    ) {
      setNotify({
        open: true,
        message: "Preencha todo o cabeçalho!",
        severity: "info",
      });
      return;
    }

    setLoading(true);

    if (!element) {
      setLoading(false);
      setNotify({
        open: true,
        message: "Elemento HTML do relatório não encontrado!",
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

    let styleContent = "";

    try {
      styleContent = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("");
          } catch (e) {
            console.error("Erro ao acessar cssRules:", e);
            return "";
          }
        })
        .join("");
    } catch (error) {
      console.error("Erro geral ao acessar CSS:", error);
      setNotify({
        open: true,
        message: "Erro ao acessar cssRules!",
        severity: "error",
      });
      setLoading(false);
      return;
    }

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

    try {
      const response = await fetch(`${API_URL}/gerar-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) {
        console.error("HTTP status:", response.status);
        setNotify({
          open: true,
          message: `Erro ao gerar PDF (status ${response.status})`,
          severity: "error",
        });

        return;
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (err) {
      console.error(err);
      setNotify({
        open: true,
        message: "Erro ao gerar PDF",
        severity: "error",
      });
    }
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
      <ModalRot
        confirmData={confirmData}
        setConfirmData={setConfirmData}
        funcaoPDF={funcaoPDF}
        setFuncaoPDF={setFuncaoPDF}
        deHoje={deHoje}
        setDeHoje={setDeHoje}
        setDadosJSON={setDadosJSON}
      />
      <div className="buttons-rot">
        <Button variant="outlined" onClick={salvarROT}>
          <FindInPageIcon style={{ marginRight: "5px" }} />
          Salvar
        </Button>
        <Button variant="outlined" onClick={buscarROT}>
          <FindInPageIcon style={{ marginRight: "5px" }} />
          Buscar Rot
        </Button>
        <Button variant="outlined" onClick={PDF}>
          <PictureAsPdfIcon style={{ marginRight: "5px" }} />
          Gerar PDF
        </Button>
      </div>

      <Paper className="relatorio" elevation={3}>
        <div className="pdf">
          <div className="rot-header">
            <div className="rot-title">
              <img
                src="http://172.20.229.55/images/logo_pptm.png"
                alt="Logo PPTM"
                id="pptm"
              />
              <h1>RELATÓRIO OPERACIONAL DE TURNO</h1>
              <img
                src="http://172.20.229.55/images/logo_ep.png"
                alt="Logo EP"
                id="ep"
              />
              <img
                src="http://172.20.229.55/images/logo_eneva.png"
                alt="Logo Eneva"
                id="eneva"
              />
            </div>
          </div>
          <HeaderRot
            dataSelecionada={dataSelecionada}
            setDataSelecionada={setDataSelecionada}
            turnoSelecionado={turnoSelecionado}
            setTurnoSelecionado={setTurnoSelecionado}
            setEquipeSelecionada={setEquipeSelecionada}
            elaboradorSelecionado={elaboradorSelecionado}
            setElaboradorSelecionado={setElaboradorSelecionado}
            supervisor={supervisor}
            setSupervisor={setSupervisor}
            dadosJSON={dadosJSON}
          />
          <div className="section-tcld">
            <h2>Operação TCLD</h2>
            <InfoTCLD setInfoTcldJson={setInfoTcldJson} dadosJSON={dadosJSON} />
          </div>
          <div className="section-patio">
            <h2>Pátio de carvão</h2>
            <div className="area-patio">
              <div className="area-patio-pilha">
                <Patio setPatioJson={setPatioJson} dadosJSON={dadosJSON} />
              </div>
              <div className="area-patio-controle">
                <div className="area-patio-umectacao">
                  <PatioUmectacao
                    setUmectacaoJson={setUmectacaoJson}
                    dadosJSON={dadosJSON}
                  />
                </div>
                <Divider />
                <div className="area-patio-polimero">
                  <PatioPolimero
                    setPolimeroJson={setPolimeroJson}
                    setPolimeroVolJson={setPolimeroVolJson}
                    dadosJSON={dadosJSON}
                  />
                </div>
                <Divider />
                <div className="area-patio-obs">
                  <PatioObs setObsJson={setObsJson} dadosJSON={dadosJSON} />
                </div>
              </div>
            </div>
            <div className="section-estoque">
              <ValorEstoque
                setValorEstoqueJson={setValorEstoqueJson}
                dadosJSON={dadosJSON}
              />
            </div>
          </div>
          <div className="section-programacao">
            <h2>Programação de Retoma</h2>
            <Prog
              setProgramacaoJson={setProgramacaoJson}
              dadosJSON={dadosJSON}
            />
          </div>
          <div className="section-retoma">
            <h2>Retoma Realizada</h2>
            <RetomaTurno
              dataSelecionada={dataSelecionada}
              turnoSelecionado={turnoSelecionado}
              setRetomaJson={setRetomaJson}
              dadosJSON={dadosJSON}
            />
          </div>
          <div className="section-evento">
            <h2>Eventos</h2>
            <EventosRot
              setEventosJson={setEventosJson}
              setAndamentoJson={setAndamentoJson}
              dadosJSON={dadosJSON}
            />
          </div>
        </div>
      </Paper>
    </div>
  );
}
