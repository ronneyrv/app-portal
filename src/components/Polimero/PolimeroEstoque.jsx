import { useEffect, useState } from "react";
import { Paper, Grid } from "@mui/material";
import "./PolimeroEstoque.css";

const volumeFormat = (valor) => {
  if (valor === null || valor === undefined) return "-";
  const valorNumerico = Number(String(valor).replace(",", "."));

  if (isNaN(valorNumerico)) return "-";
  let volumeString = String(Math.round(valorNumerico));
  volumeString = volumeString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${volumeString} litros`;
};

export default function PolimeroEstoque({
  estoquePolimero,
}) {
  const [EP, setEP] = useState([]);
  const [ENEVA, setENEVA] = useState([]);

  useEffect(() => {
    if (!estoquePolimero|| estoquePolimero.length < 2) return;
    setEP(estoquePolimero[0].volume);
    setENEVA(estoquePolimero[1].volume);
  }, [estoquePolimero]);

  return (
    <div className="main-estoque-polimero">
      <Grid container spacing={2} className="grid">
        <Grid size={6}>
          <span>Energia Pecém:</span>
          <Paper className="item">{volumeFormat(EP)}</Paper>
        </Grid>

        <Grid size={6}>
          <span>Eneva:</span>
          <Paper className="item">{volumeFormat(ENEVA)}</Paper>
        </Grid>
      </Grid>
    </div>
  );
}
