import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { CircularProgress, Box } from "@mui/material";
import "./pizzaestoque.css";

function formatTon(value) {
  return value
    .toFixed(1)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function PizzaEstoque() {
  const [estoque, setEstoque] = useState({});
  const dados = estoque;

  useEffect(() => {
    fetch("http://172.20.229.55:3000/estoque/diario", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          console.error("HTTP status:", res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.type === "success") {
          setEstoque(data.data[0]);
        } else {
          console.error("Erro ao buscar estoque");
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  }, []);

  if (!dados) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 350,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const volume = [
    {
      label: "Energia Pecém",
      value: dados?.volume_ep || 0,
      color: "#00bcd4",
    },
    {
      label: "Estoque Conjunto",
      value: dados?.volume_conjunto || 0,
      color: "#8a8989",
    },
    {
      label: "Eneva",
      value: dados?.volume_eneva || 0,
      color: "#ff6d00",
    },
  ];

  const dias = [
    {
      label: "Energia Pecém",
      value: dados?.dia_ep || 0,
      color: "#00bcd4",
    },
    {
      label: "Estoque Conjunto",
      value: dados?.dia_conjunto || 0,
      color: "#8a8989",
    },
    {
      label: "Eneva",
      value: dados?.dia_eneva || 0,
      color: "#ff6d00",
    },
  ];

  return (
    <div className="main-graf-pizza">
      <PieChart
        key={JSON.stringify(dados)}
        series={[
          {
            innerRadius: 0,
            outerRadius: 80,
            data: dias,
            arcLabel: (item) => `${item.value} dias`,
            arcLabelMinAngle: 10,
            paddingAngle: 3,
          },
          {
            innerRadius: 120,
            outerRadius: 170,
            data: volume,
            arcLabel: (item) => `${formatTon(item.value)} ton`,
            arcLabelMinAngle: 10,
            paddingAngle: 3,
          },
        ]}
        width={400}
        height={350}
        hideLegend
      />
      <div className="legenda">
        <div className="item">
          <span
            className="circulo"
            style={{ backgroundColor: "#00bcd4" }}
          ></span>
          <img
            src="http://172.20.229.55/images/logo_ep.png"
            alt="Logo EP"
            className="logo"
          />
        </div>
        <div className="item">
          <span
            className="circulo"
            style={{ backgroundColor: "#ff6d00" }}
          ></span>
          <img
            src="http://172.20.229.55/images/logo_eneva.png"
            alt="Logo Eneva"
            className="logo"
          />
        </div>
        <div className="item">
          <span
            className="circulo"
            style={{ backgroundColor: "#8a8989" }}
          ></span>
          <img
            src="http://172.20.229.55/images/logo_ep.png"
            alt="Logo EP"
            className="logo"
          />
          +
          <img
            src="http://172.20.229.55/images/logo_eneva.png"
            alt="Logo Eneva"
            className="logo"
          />
        </div>
      </div>
    </div>
  );
}
