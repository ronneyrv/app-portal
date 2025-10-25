import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import "./planodescarga.css";

export default function PlanoDescarga({ dados, setTemPlano }) {
  const [planejado, setPlanejado] = useState([]);
  const [realizado, setRealizado] = useState([]);
  const [datas, setDatas] = useState([]);
  const chartRef = useRef(null);
  const navio = dados.navio;

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  useEffect(() => {
    if (!navio) return;
    fetch(`${API_URL}/descarregamento/plano/descarga/${navio}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setTemPlano(true);
          setDatas(data.data.datas);
          setPlanejado(data.data.planejado);
          setRealizado(data.data.realizado);
        } else {
          setTemPlano(false);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  }, [dados]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Planejado", "Realizado"],
        bottom: 0,
      },
      xAxis: {
        type: "category",
        data: datas,
        axisLabel: {
          fontSize: 20,
          interval: 0,
        },
        axisTick: {
          show: true,
        },
        axisLine: {
          show: true,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      series: [
        {
          name: "Planejado",
          type: "line",
          data: planejado,
          smooth: false,
          itemStyle: {
            color: "#5470C6",
          },
          label: {
            show: true,
            position: "top",
            formatter: (params) =>
              params.value.toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }) + " t",
            color: "#5470C6",
            fontSize: 18,
          },
        },
        {
          name: "Realizado",
          type: "line",
          data: realizado,
          smooth: false,
          itemStyle: {
            color: "#5ad634ff",
          },
          lineStyle: {
            width: 2,
          },
          label: {
            show: true,
            position: "top",
            formatter: (params) =>
              params.value.toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }) + " t",
            color: "#5ad634ff",
            fontSize: 20,
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
  }, [planejado, realizado, datas]);

  return (
    <div className="main-plano-descarga">
      <div ref={chartRef} style={{ width: "100%", height: "250px" }} />{" "}
    </div>
  );
}
