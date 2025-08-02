import * as React from "react";
import { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { CircularProgress, Box } from "@mui/material";
import "./linhasestoque.css";

export default function LinhasEstoque() {
  const [estoqueLinhas, setEstoqueLinhas] = useState([]);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_URL}/estoque/realizado`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setEstoqueLinhas(data.data);
        } else {
          console.error("Erro ao buscar estoque");
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  }, []);

  if (!estoqueLinhas.length) {
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

  const dias = estoqueLinhas.map((item) => new Date(item.dia));
  const epData = estoqueLinhas.map((item) => item.dia_ep);
  const enevaData = estoqueLinhas.map((item) => item.dia_eneva);

  return (
    <div className="main-linhas-estoque">
      <h4 style={{ textAlign: "center", margin: "0 0 10px" }}>
        Histórico do Estoque por Cliente (dias)
      </h4>
      <LineChart
        xAxis={[
          {
            scaleType: "time",
            data: dias,
            valueFormatter: (value) => {
              const date = new Date(value);
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = String(date.getFullYear()).slice(-2);
              return `${day}/${month}/${year}`;
            },
            min: dias[0],
          },
        ]}
        series={[
          { data: epData, label: "EP", color: "#00bcd4", showMark: false },
          {
            data: enevaData,
            label: "ENEVA",
            color: "#ff6d00",
            showMark: false,
          },
        ]}
        responsive
        height={333}
        margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
      />
    </div>
  );
}
