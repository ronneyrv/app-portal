import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import "./graficocascata.css";

export default function GraficoCascata({ dados }) {
  const [eventos, setEventos] = useState([]);
  const chartRef = useRef(null);
  const navio = dados.navio;

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  useEffect(() => {
    if (!navio) return;
    fetch(
      `${API_URL}/descarregamento/cascata/eventos/${navio}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setEventos(data.data);
        } else {
          console.error("Erro ao buscar navio atracado");
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  }, [dados]);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    const tempos = eventos.map((e) => e.tempo);
    const acumulado = [0];
    let soma = 0;
    for (let i = 0; i < tempos.length - 2; i++) {
      soma += tempos[i];
      acumulado.push(parseFloat(soma.toFixed(2)));
    }
    acumulado.push(0);

    const option = {
      grid: {
        left: 10,
        right: 10,
      },
      title: {
        text: "Tempo por Eventos",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params) {
          const bar = params.find((p) => p.seriesName === "Tempo");
          return `${bar.name}<br/>${bar.seriesName}: ${bar.value} h`;
        },
      },
      xAxis: {
        type: "category",
        splitLine: { show: false },
        data: eventos.map((item) => item.nome),
        axisLabel: {
          rotate: 25,
          fontSize: 11,
        },
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          name: "Placeholder",
          type: "bar",
          stack: "Total",
          itemStyle: {
            borderColor: "transparent",
            color: "transparent",
          },
          emphasis: {
            itemStyle: {
              borderColor: "transparent",
              color: "transparent",
            },
          },
          data: acumulado,
        },
        {
          name: "Tempo",
          type: "bar",
          stack: "Total",
          label: {
            show: true,
            position: "top",
            formatter: "{c} h",
            fontSize: 11,
          },
          data: eventos.map((item) => item.tempo),
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [eventos]);

  return (
    <div className="main-cascata">
      <div ref={chartRef} style={{ width: "100%", height: "250px" }} />
    </div>
  );
}
