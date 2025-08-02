import { useEffect, useState } from "react";
import GraficoPrevisaoReal from "../../components/Descarregamento/GraficoPrevisaoReal";
import Pier1Carvao from "../../components/Descarregamento/Pier1Carvao";
import GraficoPrevisaoBase75 from "../../components/Descarregamento/GraficoPrevisaoBase75";
import GraficoTempoAtracado from "../../components/Descarregamento/GraficoTempoAtracado";
import TabelaNavioPier1 from "../../components/Descarregamento/TabelaNavioPier1";
import ParetoOperacao from "../../components/Descarregamento/ParetoOperacao";
import ParetoManutencao from "../../components/Descarregamento/ParetoManutencao";
import GraficoCascata from "../../components/Descarregamento/GraficoCascata";
import CorretivaPreventiva from "../../components/Descarregamento/CorretivaPreventiva";
import "./descarregamento.css";

export default function Descarregamento() {
  const [pier, setPier] = useState([]);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const fetchPier = () => {
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
                setPier(data.data[0]);
              }
            })
            .catch((error) => {
              console.error("Erro de rede:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  };

  useEffect(() => {
    fetchPier();
  }, []);

  return (
    <div className="main-descarregamento">
      <div className="container-infor">
        <Pier1Carvao dados={pier} />
        <GraficoTempoAtracado dados={pier} />
        <GraficoPrevisaoReal dados={pier} />
        <GraficoPrevisaoBase75 dados={pier} />
      </div>
      <div className="container-infor2">
        <ParetoOperacao dados={pier} />
        <ParetoManutencao dados={pier} />
      </div>
      <div className="container-infor3">
        <CorretivaPreventiva dados={pier} />
        <GraficoCascata dados={pier} />
      </div>
      <div>
        <TabelaNavioPier1 dados={pier} fetchPier={fetchPier} />
      </div>
    </div>
  );
}
