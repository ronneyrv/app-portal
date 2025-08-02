import { useEffect, useState } from "react";
import Pier1Carvao from "../../components/Descarregamento/Pier1Carvao";
import GraficoPrevisaoReal from "../../components/Descarregamento/GraficoPrevisaoReal";
import GraficoPrevisaoBase75 from "../../components/Descarregamento/GraficoPrevisaoBase75";
import "./home.css";

export default function Home() {
  const [pier, setPier] = useState([]);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  useEffect(() => {
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
  }, []);

  return (
    <div className="main-home">
      <div className="container-home-1">
        <Pier1Carvao dados={pier} />
        <GraficoPrevisaoReal dados={pier} />
        <GraficoPrevisaoBase75 dados={pier} />
      </div>
      <div className="container-home-2"></div>
    </div>
  );
}
