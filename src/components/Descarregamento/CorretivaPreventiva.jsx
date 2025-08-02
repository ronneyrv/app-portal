import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import "./corretivapreventiva.css";

export default function CorretivaPreventiva({ dados }) {
  const [corPrev, setCorPrev] = useState([]);
  const chartRef = useRef(null);
  const navio = dados.navio;

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  useEffect(() => {
    if (!navio) return;
    fetch(
      `${API_URL}/descarregamento/corretiva/preventiva/${navio}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setCorPrev(data.data);
        } else {
          console.error("Erro ao buscar dados de manutenção.");
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  }, [dados]);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      grid: {
        left: 10,
        right: 10,
      },
      legend: {},
      tooltip: {},
      dataset: {
        source: corPrev,
      },
      xAxis: {
        type: "category",
        axisLabel: {
          rotate: 25,
          fontSize: 10,
        },
      },
      yAxis: {
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          type: "bar",
          name: "Corretiva",
          encode: {
            x: "nome",
            y: "corretiva",
          },
          label: {
            show: true,
            position: "top",
            fontSize: 10,
            formatter: function (params) {
              return `${params.data.corretiva} h`;
            },
          },
        },
        {
          type: "bar",
          name: "Preventiva",
          encode: {
            x: "nome",
            y: "preventiva",
          },
          label: {
            show: true,
            position: "top",
            fontSize: 10,
            formatter: function (params) {
              return `${params.data.preventiva} h`;
            },
          },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [corPrev]);

  return (
    <div className="main-corretiva-preventiva">
      <div ref={chartRef} style={{ width: "100%", height: "250px" }} />
    </div>
  );
}
