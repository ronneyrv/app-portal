import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function GraficoContrato({ projecao }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !projecao) return;

    const chart = echarts.init(chartRef.current);
    const contrato = projecao.contratado;

    const option = {
      title: {
        text: "Contrato",
        left: "center",
      },
      legend: {
        bottom: 4,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: function (params) {
          let resultado = `<b>${params[0].name}</b><br/>`;
          params.forEach((item) => {
            const valorFormatado = item.value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            });
            resultado += `${item.marker} ${item.seriesName}: <span style="font-weight:bold; float:right; margin-left:20px">${valorFormatado}</span><br/>`;
          });
          return resultado;
        },
      },
      grid: {
        top: "10%",
        bottom: "20%",
        left: "5%",
        right: "20%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "category",
        data: ["CONTRATO"],
        axisLabel: {
          rotate: 90,
          fontSize: 10,
          fontWeight: "bold",
        },
        axisLine: {
          show: true,
        },
        axisTick: {
          show: true,
        },
      },
      series: [
        {
          name: "Previsto",
          type: "bar",
          data: [contrato.previsto],
          barWidth: "40%",
          itemStyle: {
            color: "#9e9e9e",
          },
          label: {
            show: true,
            position: "outside",
            fontSize: 15,
            formatter: function (params) {
              return params.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });
            },
          },
        },
        {
          name: "Realizado",
          type: "bar",
          data: [contrato.realizado],
          barWidth: "40%",
          itemStyle: {
            color: "#1976d2",
          },
          label: {
            show: true,
            position: "outside",
            fontSize: 15,
            formatter: function (params) {
              return params.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });
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
  }, [projecao]);

  return <div ref={chartRef} style={{ width: "100%", height: "190px" }} />;
}
