import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import InputsProgramacao from "../../components/RetomaProg/inputsProgramacao";
import logoPPTM from "../../../public/images/logo_pptm.png";
import logoEneva from "../../../public/images/logo_eneva.png";
import logoEP from "../../../public/images/logo_ep.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./retomaprog.css";

export default function ProgramacaoRetoma() {
  const [ano, setAno] = useState("");
  const [semana, setSemana] = useState("");
  const [dias, setDias] = useState([]);
  const [programado, setProgramado] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleGeneratePDF = async () => {
    const element = document.querySelector(".main-retoma-prog");

    if (!element) return;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,

      onclone: (clonedDoc) => {
        const clonedMain = clonedDoc.querySelector(".main-retoma-prog");
        if (clonedMain) {
          clonedMain.style.marginTop = "0px";
          clonedMain.style.paddingTop = "0px";
          clonedMain.style.backgroundColor = "#ffffff";
        }

        const buttonsAdd = clonedDoc.querySelectorAll(".button-add");
        buttonsAdd.forEach((btn) => {
          const inputSibling = btn.previousElementSibling;
          btn.style.display = "none";

          if (inputSibling) {
            inputSibling.style.width = "100%";
            inputSibling.style.maxWidth = "none";
            inputSibling.dataset.expanded = "true";
          }
        });

        const botoesGerais = clonedDoc.querySelector(
          ".buttons-programacao-retoma"
        );
        if (botoesGerais) botoesGerais.style.display = "none";

        const textareas = clonedDoc.querySelectorAll("textarea");
        textareas.forEach((ta) => {
          const div = clonedDoc.createElement("div");
          const style = window.getComputedStyle(ta);
          const rect = ta.getBoundingClientRect();

          if (!ta.value && ta.placeholder) {
            div.innerText = ta.placeholder;
            div.style.color = "#999999";
          } else {
            div.innerText = ta.value || " ";
            div.style.color = "#000000";
          }

          div.style.border = style.border;
          div.style.borderRadius = style.borderRadius;
          div.style.backgroundColor = style.backgroundColor;
          div.style.padding = style.padding;
          div.style.margin = style.margin;
          div.style.boxSizing = "border-box";
          div.style.fontFamily = style.fontFamily;
          div.style.fontSize = style.fontSize;
          div.style.fontWeight = style.fontWeight;
          div.style.lineHeight = style.lineHeight;
          div.style.textAlign = style.textAlign;

          const isFinalTextarea =
            ta.classList.contains(
              "inputs-programacao-textarea-final-empilha"
            ) || ta.classList.contains("inputs-programacao-textarea-final-ug");

          if (isFinalTextarea) {
            div.style.width = `${rect.width}px`;
            div.style.display =
              style.display === "inline" ? "inline-block" : style.display;
          } else if (ta.dataset.expanded === "true") {
            div.style.width = "100%";
          } else {
            div.style.width = `${rect.width}px`;
          }

          div.style.height = "auto";
          if (ta.offsetHeight) {
            div.style.minHeight = `${ta.offsetHeight}px`;
          } else {
            div.style.minHeight = style.height;
          }

          div.style.whiteSpace = "pre-wrap";
          div.style.wordWrap = "break-word";
          div.style.overflow = "hidden";

          if (ta.parentNode) {
            ta.parentNode.replaceChild(div, ta);
          }
        });
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 5;

    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );
    pdf.save(`Programacao-semana-${semana}-${ano}.pdf`);
  };

  const definirSemana = () => {
    const hoje = new Date();
    const primeiroDiaDoAno = new Date(hoje.getFullYear(), 0, 1);
    const diaSemana = primeiroDiaDoAno.getDay();
    const ajustePrimeiroDia = diaSemana === 0 ? 6 : diaSemana - 1;
    const msPorDia = 24 * 60 * 60 * 1000;

    const diasDesdePrimeiro =
      Math.floor((hoje - primeiroDiaDoAno) / msPorDia) + ajustePrimeiroDia;

    const semanaAtual = Math.ceil(diasDesdePrimeiro / 7);

    setAno(hoje.getFullYear());
    setSemana(semanaAtual);
  };

  const definirDias = () => {
    if (!semana || !ano) return;

    const msPorDia = 24 * 60 * 60 * 1000;
    const primeiroDiaDoAno = new Date(ano, 0, 1);
    const diaSemana = primeiroDiaDoAno.getDay();
    const ajustePrimeiroDia = diaSemana === 0 ? 6 : diaSemana - 1;

    const diasDesdeInicio = (semana - 1) * 7 - ajustePrimeiroDia;
    const segundaFeira = new Date(
      primeiroDiaDoAno.getTime() + diasDesdeInicio * msPorDia
    );

    const dias = [];

    for (let i = 0; i < 7; i++) {
      const dia = new Date(segundaFeira.getTime() + i * msPorDia);
      const diaFormatado = dia.toLocaleDateString("pt-BR");
      dias.push(diaFormatado);
    }

    setDias(dias);
  };

  const dataHojeFormatada = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

  const pesquisarProg = (ano, semana) => {
    if (!semana || !ano) return;
    setProgramado(null);

    fetch(`${API_URL}/prog-retoma/${ano}/${semana}`, {
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
          setProgramado(data.data);
        }
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  };

  useEffect(() => {
    definirSemana();
  }, []);

  useEffect(() => {
    definirDias();
    pesquisarProg(ano, semana);
  }, [semana, ano]);

  if (carregando) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 350,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="main-retoma-prog">
      <div className="semana-container">
        <label htmlFor="semana">PROGRAMAÇÂO DE RETOMA - SEMANA</label>
        <input
          id="semana"
          type="number"
          value={semana}
          onChange={(e) => setSemana(e.target.value)}
        />
        <label htmlFor="ano">ANO</label>
        <input
          id="ano"
          type="number"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
        />
        <div className="container-logo-clientes">
          <img src={logoEP} alt="Logo EP" id="logo-ep" />
          <img src={logoEneva} alt="Logo Eneva" id="logo-eneva" />
          <img src={logoPPTM} alt="Logo PPTM" id="logo-pptm" />
          <span>{dataHojeFormatada}</span>
        </div>
      </div>

      <InputsProgramacao
        dias={dias}
        semana={semana}
        ano={ano}
        programado={programado}
        handleGeneratePDF={handleGeneratePDF}
      />

      <div className="footer-retoma-prog">
        <div className="signature-box">
          <span>ENERGIA PECÉM</span>
        </div>

        <div className="signature-box">
          <span>ENEVA</span>
        </div>

        <div className="signature-box">
          <span>PPTM</span>
        </div>
      </div>
    </div>
  );
}
