import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function GraficoAnual({
  dadosContrato,
  anoSelecionado,
  divWidth,
}) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !dadosContrato) return;
    const chart = echarts.init(chartRef.current);
    const realizado = dadosContrato.anual_realizado || 0;
    const orcado = dadosContrato.anual_orcado || 0;

    const option = {
      title: {
        text: `Medições - Ano ${anoSelecionado}`,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: function (params) {
          if (!params || params.length === 0) return "";
          let resultado = `<div style="text-align: left; margin-bottom: 4px;"><b>${params[0].name}</b></div>`;
          let exibiuPeloMenosUm = false;

          params.forEach((item) => {
            if (
              item.value !== null &&
              item.value !== undefined &&
              !isNaN(item.value)
            ) {
              exibiuPeloMenosUm = true;
              const valorFormatado = item.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });
              resultado += `
                <div style="display: flex; justify-content: space-between; align-items: center; min-width: 180px;">
                  <span style="margin-right: 20px;">${item.marker} ${item.seriesName}</span>
                  <span style="font-weight: bold;">${valorFormatado}</span>
                </div>
              `;
            }
          });
          return exibiuPeloMenosUm ? resultado : "";
        },
      },
      grid: {
        top: "20%",
        bottom: "25%",
        left: "2%",
        right: "2%",
        containLabel: false,
      },
      legend: {
        data: ["Orçado", "Realizado"],
        bottom: 4,
      },
      xAxis: {
        type: "category",
        data: [
          "JANEIRO",
          "FEVEREIRO",
          "MARÇO",
          "ABRIL",
          "MAIO",
          "JUNHO",
          "JULHO",
          "AGOSTO",
          "SETEMBRO",
          "OUTUBRO",
          "NOVEMBRO",
          "DEZEMBRO",
        ],
        axisLabel: {
          fontSize: 10,
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
          name: "Realizado",
          type: "bar",
          barWidth: "80%",
          data: realizado,
          smooth: false,
          itemStyle: {
            color: "#1976d2",
          },
          label: {
            show: true,
            position: "inside",
            formatter: function (params) {
              const val = params.value;
              if (val === null || val === undefined || isNaN(val)) {
                return "";
              }
              return val.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });
            },
            fontSize: 10,
          },
        },
        {
          name: "Orçado",
          type: "line",
          data: orcado,
          connectNulls: false,
          smooth: false,
          itemStyle: {
            color: "#ed6c02",
          },
          lineStyle: {
            width: 2,
          },
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              const val = params.value;
              if (val === null || val === undefined || isNaN(val)) {
                return "";
              }
              return val.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });
            },
            color: "#ed6c02",
            fontSize: 10,
            textBorderColor: "#ffffff",
            textBorderWidth: 2,
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
  }, [dadosContrato, divWidth]);

  return <div ref={chartRef} style={{ width: "100%", height: "200px" }} />;
}
