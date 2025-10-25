import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "./graficotempoatracado.css";

function tempoAtracado(atracacao) {
  if (!atracacao) return null;
  const data = new Date(atracacao);
  const ano = data.getUTCFullYear().toString();
  const mes = (data.getUTCMonth() + 1).toString().padStart(2, "0");
  const dia = data.getUTCDate().toString().padStart(2, "0");
  const horas = data.getUTCHours().toString().padStart(2, "0");
  const minutos = data.getUTCMinutes().toString().padStart(2, "0");
  const atracacaoFormatado = `${ano}-${mes}-${dia}T${horas}:${minutos}`;

  const dataAtracacao = new Date(atracacaoFormatado);
  const agora = new Date();
  const diferenca = agora - dataAtracacao;
  if (diferenca < 0) return 0;
  const diferencaDias = diferenca / (1000 * 60 * 60 * 24);

  return parseFloat(diferencaDias);
}

export default function GraficoTempoAtracado({ dados }) {
  const chartRef = useRef(null);
  const meta = dados.meta;
  const total = meta * 2;
  const medio = (meta + total * 0.1) / 10;
  const bom = meta / 10;
  const dias = tempoAtracado(dados.atracacao);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: "TEMPO DE ATRACADO",
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
                [total || 1, "#FF6E76"],
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
              return value.toFixed(2).toString().replace(".", ",") + "d";
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
