import { useEffect, useRef, useState } from "react";
import GraficoPrevisaoReal from "../../components/Descarregamento/GraficoPrevisaoReal";
import Pier1Carvao from "../../components/Descarregamento/Pier1Carvao";
import GraficoPrevisaoBase75 from "../../components/Descarregamento/GraficoPrevisaoBase75";
import GraficoTempoAtracado from "../../components/Descarregamento/GraficoTempoAtracado";
import TabelaNavioPier1 from "../../components/Descarregamento/TabelaNavioPier1";
import ParetoOperacao from "../../components/Descarregamento/ParetoOperacao";
import ParetoManutencao from "../../components/Descarregamento/ParetoManutencao";
import GraficoCascata from "../../components/Descarregamento/GraficoCascata";
import CorretivaPreventiva from "../../components/Descarregamento/CorretivaPreventiva";
import PlanoDescarga from "../../components/Descarregamento/PlanoDescarga";
import html2canvas from "html2canvas";
import TabelaTopOpe from "../../components/Descarregamento/TabelaTopOpe";
import TabelaTopMan from "../../components/Descarregamento/TabelaTopMan";
import "./descarregamento.css";

export default function Descarregamento() {
  const [descarregando, setDescarregando] = useState(false);
  const [temOcorrencia, setTemOcorrencia] = useState(false);
  const [temPlano, setTemPlano] = useState(false);
  const [ocioso, setOcioso] = useState(true);
  const [pier, setPier] = useState([]);
  const [agora, setAgora] = useState("");
  const printRef = useRef(null);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const dataHora = () => {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, "0");
    const minuto = String(data.getMinutes()).padStart(2, "0");
    return setAgora(`${dia}/${mes}/${ano} ${hora}:${minuto}`);
  };

  const handlePrint = async () => {
    if (!printRef.current) {
      return;
    }

    try {
      const canvas = await html2canvas(printRef.current);
      const image = canvas.toDataURL("image/png");

      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const formattedDateTime = `${day}${month}${year}-${hours}${minutes}${seconds}`;
      const fileName = `TEMPO REAL ${formattedDateTime}.png`;

      const link = document.createElement("a");
      link.href = image;
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Erro ao capturar a imagem:", error);
    }
  };

  const previsãoFinal = () => {
    if (!temOcorrencia) return;
    if (!descarregando) return;

    fetch(`${API_URL}/descarregamento`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.error("HTTP status:", res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.type === "success") {
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  };

  const fetchPier = () => {
    fetch(`${API_URL}/descarregamento/descarregando`, {
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
          const navio = data.data[0].navio;
          const taxa = data.data[0].taxa;
          taxa === 0 ? setDescarregando(false) : setDescarregando(true);

          setPier(data.data[0]);
          setOcioso(false);

          fetch(`${API_URL}/descarregamento/ocorrencia/atracado/${navio}`, {
            credentials: "include",
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.type === "success") {
                setTemOcorrencia(true);
              } else {
                setTemOcorrencia(false);
              }
            })
            .catch((err) => console.error("Erro de rede:", err));
        } else {
          setTemOcorrencia(false);
          setPier([]);
          setOcioso(true);
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  };

  useEffect(() => {
    fetchPier();
    dataHora();
  }, []);

  useEffect(() => {
    dataHora();
  }, [pier]);

  return (
    <div className="main-descarregamento">
      <div className="print-tempo-real" ref={printRef}>
        <div className="container-infor5">
          <h1>Tempo Real TCLD - {agora}</h1>
        </div>
        <div className="container-infor">
          <Pier1Carvao dados={pier} />
          <GraficoTempoAtracado dados={pier} />
          <GraficoPrevisaoReal dados={pier} />
          <GraficoPrevisaoBase75 dados={pier} />
        </div>
        <div>
          <PlanoDescarga dados={pier} setTemPlano={setTemPlano} />
        </div>
        <div className="container-infor2">
          <ParetoOperacao dados={pier} temOcorrencia={temOcorrencia} />
          <ParetoManutencao dados={pier} temOcorrencia={temOcorrencia} />
        </div>
        <div className="container-infor3">
          <CorretivaPreventiva dados={pier} temOcorrencia={temOcorrencia} />
          <GraficoCascata dados={pier} temOcorrencia={temOcorrencia} />
        </div>
        <div className="container-infor6">
          <TabelaTopOpe dados={pier} />
          <TabelaTopMan dados={pier} />
        </div>
      </div>
      <div className="container-infor4">
        <TabelaNavioPier1
          handlePrint={handlePrint}
          temPlano={temPlano}
          setTemPlano={setTemPlano}
          dados={pier}
          fetchPier={fetchPier}
          dataHora={dataHora}
          ocioso={ocioso}
          setOcioso={setOcioso}
        />
      </div>
    </div>
  );
}
