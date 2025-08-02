import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import "./paretomanutencao.css";

export default function ParetoManutencao({ dados }) {
  const [paretoCategoria, setParetoCategoria] = useState([]);
  const [paretoTempo, setParetoTempo] = useState([]);
  const chartRef = useRef(null);
  const navio = dados.navio;

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  useEffect(() => {
    if (!navio) return;
    fetch(
      `${API_URL}/descarregamento/pareto/manutencao/${navio}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setParetoCategoria(data.data.categorias);
          setParetoTempo(data.data.tempo);
        } else {
          console.error("Erro ao buscar navio atracado");
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  }, [dados]);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    const categorias = paretoCategoria;
    const tempo = paretoTempo;

    const total = tempo.reduce((sum, val) => sum + val, 0);
    let acumulado = 0;
    const percentuais = tempo.map((val) => {
      acumulado += val;
      return +((acumulado / total) * 100).toFixed(0);
    });

    const option = {
      grid: {
        left: 80,
        right: 10,
        bottom: 100,
      },
      title: {
        text: "Impactos de Manutenção",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          const bar = params.find((p) => p.seriesType === "bar");
          const line = params.find((p) => p.seriesType === "line");
          return `
            ${bar.axisValue}<br/>
            Tempo: ${bar.data}h<br/>
            Acumulado: ${line.data}%
          `;
        },
      },
      xAxis: {
        type: "category",
        data: categorias,
        axisLabel: {
          rotate: 25,
          fontSize: 10,
        },
        axisTick: {
          show: true,
        },
        axisLine: {
          show: true,
        },
      },
      yAxis: [
        {
          type: "value",
          name: "Tempo (h)",
          show: false,
        },
        {
          type: "value",
          name: "% Acumulado",
          min: -100,
          max: 100,
          show: false,
        },
      ],
      series: [
        {
          name: "Tempo (h)",
          type: "bar",
          data: tempo,
          itemStyle: {
            color: "#5470C6",
          },
          label: {
            show: true,
            position: "top",
            formatter: "{c} h",
            fontSize: 10,
          },
        },
        {
          name: "% Acumulado",
          type: "line",
          yAxisIndex: 1,
          data: percentuais,
          smooth: true,
          itemStyle: {
            color: "#EE6666",
          },
          lineStyle: {
            width: 2,
          },
          label: {
            show: true,
            position: "top",
            formatter: "{c}%",
            color: "#EE6666",
            fontSize: 10,
          },
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
  }, [paretoCategoria, paretoTempo]);

  return (
    <div className="main-pareto-operacao">
      <div ref={chartRef} style={{ width: "100%", height: "250px" }} />
    </div>
  );
}
