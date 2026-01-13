import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function GraficoAcumulado({ projecao }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !projecao) return;

    const chart = echarts.init(chartRef.current);
    const valorAcumulado = projecao.acumulado;

    const option = {
      title: {
        text: `Orçamento PPTM ${valorAcumulado.ano}`,
        left: "center",
      },
      legend: { bottom: 4 },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params) {
          let resultado = `<b>${params[0].name}</b><br/>`;
          params.forEach((item) => {
            const valorMilhoes = item.value / 1000000;
            const valorFormatado = valorMilhoes.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            resultado += `${item.marker} ${item.seriesName}: <span style="font-weight:bold; float:right; margin-left:20px">${valorFormatado} MM</span><br/>`;
          });
          return resultado;
        },
      },
      grid: {
        top: "10%",
        bottom: "20%",
        left: "5%",
        right: "5%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["ACUMULADO"],
        axisLabel: {
          fontSize: 10,
          fontWeight: "bold",
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
          name: "Orçado",
          type: "bar",
          data: [valorAcumulado.orcado],
          barWidth: "40%",
          itemStyle: {
            color: "#ed6c02",
          },
          label: {
            show: true,
            position: "inside",
            fontSize: 12,
            formatter: function (params) {
              let valorMilhoes = params.value / 1000000;
              return (
                valorMilhoes.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }) + " MM"
              );
            },
          },
        },
        {
          name: "Realizado",
          type: "bar",
          data: [valorAcumulado.realizado],
          barWidth: "40%",
          itemStyle: {
            color: "#1976d2",
          },
          label: {
            show: true,
            position: "inside",
            fontSize: 12,
            formatter: function (params) {
              let valorMilhoes = params.value / 1000000;
              return (
                valorMilhoes.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }) + " MM"
              );
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
