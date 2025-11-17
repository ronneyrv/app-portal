import { useState, useEffect } from "react";
import { useUsuario } from "../../contexts/useUsuario";
import "./ConfigConsumo.css";
import { Box, Button } from "@mui/material";

export default function ConfigConsumo({
  setAbrirModalAddConsumo,
  setAbrirModalConfigConsumo,
}) {
  const { usuario } = useUsuario();

  return (
    <div className="main-config-consumo">
      <Box display="flex" gap={1}>
        <Button
          variant="contained"
          size="small"
          sx={{
            margin: "4px",
          }}
          onClick={() => setAbrirModalAddConsumo(true)}
        >
          Adicionar Consumo
        </Button>
        <Button
          disabled={usuario > 6 ? true : false}
          variant="contained"
          size="small"
          sx={{
            margin: "4px",
          }}
          onClick={() => setAbrirModalConfigConsumo(true)}
        >
          Configurações de Consumo
        </Button>
      </Box>
    </div>
  );
}
