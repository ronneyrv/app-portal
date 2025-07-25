import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "./graficoprevisaoreal.css";

function DiasPrevisaoReal(atracacao, saldo, taxa) {
  if (!atracacao || saldo == null || !taxa) return null;

  const dataAtracacao = new Date(atracacao);
  const agora = new Date();

  let diferenca = agora - dataAtracacao;
  if (diferenca < 0) diferenca = 0;

  const diasCorridos = diferenca / (1000 * 60 * 60 * 24);
  const diasRestantes = saldo / (taxa * 24);
  const totalDias = diasCorridos + diasRestantes;

  return parseFloat(totalDias.toFixed(2));
};

export default function GraficoPrevisaoReal({ dados }) {
  const chartRef = useRef(null);
  const meta = dados.meta;
  const medio = meta / 10;
  const bom = (meta - 1) / 10;
  const dias = DiasPrevisaoReal(dados.atracacao, dados.saldo, dados.taxa);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: "PREVISÃO DE TÉRMINO REAL",
        left: "center",
        top: "5%",
        textStyle: {
          fontSize: 12,
          color: "#333",
        },
      },
      series: [
        {
          type: "gauge",
          startAngle: 180,
          endAngle: 0,
          center: ["50%", "75%"],
          radius: "100%",
          min: 0,
          max: 10,
          axisLine: {
            lineStyle: {
              width: 20,
              color: [
                [bom || 0.4, "#7CFFB2"],
                [medio || 0.5, "#FDDD60"],
                [1, "#FF6E76"],
              ],
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          pointer: {
            icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
            length: "70%",
            width: 5,
            offsetCenter: [0, "-30%"],
            itemStyle: {
              color: "#333",
            },
          },
          detail: {
            fontSize: 20,
            offsetCenter: [0, 0],
            valueAnimation: true,
            formatter: function (value) {
              return value.toFixed(1).toString().replace(".", ",") + "d";
            },
            color: "#333",
          },
          data: [
            {
              value: dias || 0,
            },
          ],
        },
      ],
    };

    chart.setOption(option);

    window.addEventListener("resize", chart.resize);

    return () => {
      window.removeEventListener("resize", chart.resize);
      chart.dispose();
    };
  }, [dados]);

  return (
    <div className="main-previsao-real">
      <div ref={chartRef} style={{ width: "200px", height: "200px" }} />
    </div>
  );
}
