import { useEffect, useRef, useState } from "react";
import { useUsuario } from "../../contexts/useUsuario";
import ModalEditMetaTaxa from "./ModalEditMetaTaxa";
import NotifyBar from "../NotifyBar";
import * as echarts from "echarts";
import "./TaxaRetoma.css";

export default function TaxaRetoma({ age }) {
  const { usuario } = useUsuario();
  const [abrirModalMetaTaxa, setAbrirModalMetaTaxa] = useState(false);
  const [taxaCalculada, setTaxaCalculada] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [subtexto, setSubtexto] = useState("");
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formMeta, setFormMeta] = useState({
    ruim: "",
    bom: "",
    otimo: "",
  });

  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const chartRef = useRef(null);

  const editarMeta = () => {
    if (usuario.nivel > 6) {
      return setNotify({
        open: true,
        message: "Você não tem permissao para alterar!",
        severity: "info",
      });
    }
    setAbrirModalMetaTaxa(true);
  };

  useEffect(() => {
    if (!age) return;
    fetch(`${API_URL}/retoma/taxa/${age}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          const taxaMes = data.data.map((item) => item.taxa);
          setTaxaCalculada(taxaMes);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  }, [age]);

  const fetchMetaTaxa = () => {
    fetch(`${API_URL}/config/meta`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          const metaData = data.data;
          setFormMeta(metaData);
          setSubtexto(
            `${metaData[0].valor} | ${metaData[1].valor} | ${metaData[2].valor}`
          );
        } else {
          console.error("Erro ao buscar metas");
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  useEffect(() => {
    fetchMetaTaxa();
  }, [API_URL]);

  useEffect(() => {
    if (!chartRef.current) return;

    let chart = echarts.getInstanceByDom(chartRef.current);
    if (!chart) {
      chart = echarts.init(chartRef.current);
    }

    const option = {
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          const data = params[0];
          return `Mês: ${data.name}<br/>Taxa: ${data.value.toLocaleString(
            "pt-BR",
            {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }
          )} t/h`;
        },
      },
      legend: {
        show: false,
      },
      grid: {
        left: "2%",
        right: "2%",
        bottom: "2%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: meses,
        axisLabel: {
          fontSize: 14,
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
        type: "value",
        splitLine: {
          show: true,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      series: [
        {
          name: "Taxa Calculada",
          type: "bar",
          data: taxaCalculada,
          itemStyle: {
            color: "#5470C6",
          },
          label: {
            show: true,
            position: "top",
            formatter: (params) =>
              params.value.toLocaleString("pt-BR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }) + " t/h",
            color: "#333",
            fontSize: 12,
          },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    const container = chartRef.current.parentNode;
    const resizeObserver = new ResizeObserver((entries) => {
      if (chartRef.current) {
        chart.resize();
      }
    });

    resizeObserver.observe(container);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.unobserve(container);
      chart.dispose();
    };
  }, [subtexto, taxaCalculada]);

  return (
    <div className="main-taxa-retoma">
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <ModalEditMetaTaxa
        abrirModalMetaTaxa={abrirModalMetaTaxa}
        setAbrirModalMetaTaxa={setAbrirModalMetaTaxa}
        fetchMetaTaxa={fetchMetaTaxa}
        formMeta={formMeta}
      />
      <div className="retoma-header">
        <h3 className="main-title">Taxa de Retoma</h3>
        <span
          className="subtext-clicavel"
          onClick={editarMeta}
          title="Clique para editar as metas"
        >
          {subtexto}
        </span>
      </div>
      <div ref={chartRef} style={{ width: "100%", height: "200px" }} />
    </div>
  );
}
