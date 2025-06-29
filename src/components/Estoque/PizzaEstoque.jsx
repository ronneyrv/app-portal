import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

function formatTon(value) {
  return value
    .toFixed(3)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function PizzaEstoque(estoque) {
  if (!estoque) return null;
  const volume = [
    {
      label: "Energia Pecém",
      value: estoque.estoque.volume_ep,
      color: "#00bcd4",
    },
    {
      label: "Estoque Conjunto",
      value: estoque.estoque.volume_conjunto,
      color: "#1976d2",
    },
    {
      label: "Eneva",
      value: estoque.estoque.volume_eneva,
      color: "#ff6d00",
    },
  ];

  const dias = [
    {
      label: "Energia Pecém",
      value: estoque.estoque.dia_ep,
      color: "#00bcd4",
    },
    {
      label: "Estoque Conjunto",
      value: estoque.estoque.dia_conjunto,
      color: "#1976d2",
    },
    {
      label: "Eneva",
      value: estoque.estoque.dia_eneva,
      color: "#ff6d00",
    },
  ];
  console.log(volume);

  return (
    <div style={{ textAlign: "center" }}>
      <PieChart
        series={[
          {
            innerRadius: 0,
            outerRadius: 80,
            data: dias,
            arcLabel: (item) => `${item.value} dias`,
            paddingAngle: 3,
          },
          {
            innerRadius: 120,
            outerRadius: 170,
            data: volume,
            arcLabel: (item) => `${formatTon(item.value)} ton`,
            paddingAngle: 3,
          },
        ]}
        width={350}
        height={350}
        hideLegend
      />
      <div>
        <div>circulo colorido + img da logo ep</div>
        <div>circulo colorido + img da logo Eneva</div>
        <div>circulo colorido + img da logo ep e logo eneva</div>
      </div>
    </div>
  );
}
