import { useEffect, useState } from "react";
import NotifyBar from "../NotifyBar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import ConfigConsumo from "./configConsumo";

const prepararNumero = (value) => {
  const isNegative = value.startsWith("-");
  let cleanedValue = value.replace(/-/g, "").replace(/[^0-9,]/g, "");
  const endsWithComma = cleanedValue.endsWith(",");
  const parts = cleanedValue.split(",");
  if (parts.length > 2) {
    cleanedValue = parts[0] + "," + parts.slice(1).join("");
  }

  if (
    cleanedValue.length > 1 &&
    cleanedValue.startsWith("0") &&
    !cleanedValue.startsWith("0,")
  ) {
    cleanedValue = cleanedValue.substring(1);
  }

  if (
    cleanedValue === "" ||
    cleanedValue === "," ||
    value === "-" ||
    value === "-,"
  ) {
    if (isNegative && cleanedValue.length > 0) {
      return "-" + cleanedValue;
    }
    return isNegative ? value : cleanedValue;
  }
  const numericValue = parseFloat(cleanedValue.replace(",", "."));

  if (isNaN(numericValue)) {
    return isNegative ? "-" + cleanedValue : cleanedValue;
  }
  const options = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
    useGrouping: true,
  };

  const formatter = new Intl.NumberFormat("pt-BR", options);
  let formatted = formatter.format(numericValue * (isNegative ? -1 : 1));
  if (endsWithComma && !formatted.includes(",")) {
    return formatted + ",";
  }

  return formatted;
};

const mapConfig = (configArray) => {
  const map = {};
  configArray.forEach((item) => {
    const key = `${item.ug}${item.carga}`;
    map[key] = item.consumo;
  });
  return map;
};

export default function ModalConfigConsumo({
  abrirModalConfigConsumo,
  setAbrirModalConfigConsumo,
  fetchConsumo,
  config,
}) {
  const [loading, setLoading] = useState(false);
  const [formConfigData, setFormConfigData] = useState({
    UG1base: 0,
    UG2base: 0,
    UG3base: 0,
    UG1reduzida: 0,
    UG2reduzida: 0,
    UG3reduzida: 0,
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setAbrirModalConfigConsumo(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormConfigData((prevData) => ({
      ...prevData,
      [name]: prepararNumero(value),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);
    fetch(`${API_URL}/config/consumo`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ dados: formConfigData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type == "success") {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
          handleClose();
        } else {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
        }
        setLoading(false);
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  useEffect(() => {
    if (!config || !Array.isArray(config) || config.length === 0) return;
    const mappedData = mapConfig(config);
    setLoading(false);

    setFormConfigData({
      UG1base: mappedData.UG1base,
      UG2base: mappedData.UG2base,
      UG3base: mappedData.UG3base,
      UG1reduzida: mappedData.UG1reduzida,
      UG2reduzida: mappedData.UG2reduzida,
      UG3reduzida: mappedData.UG3reduzida,
    });
  }, [config]);

  useEffect(() => {
    if (!abrirModalConfigConsumo) return;
    fetchConsumo();
  }, [abrirModalConfigConsumo]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog open={abrirModalConfigConsumo} onClose={handleClose} fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <DialogTitle>Consumo em Carga Base:</DialogTitle>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                required
                size="small"
                margin="dense"
                name="UG1base"
                label="Consumo UG1"
                variant="outlined"
                value={formConfigData.UG1base}
                onChange={handleChange}
              />
              <TextField
                required
                size="small"
                margin="dense"
                name="UG2base"
                label="Consumo UG2"
                variant="outlined"
                value={formConfigData.UG2base}
                onChange={handleChange}
              />
              <TextField
                required
                size="small"
                margin="dense"
                name="UG3base"
                label="Consumo UG3"
                variant="outlined"
                value={formConfigData.UG3base}
                onChange={handleChange}
              />
            </Box>
            <DialogTitle>Consumo em Carga Reduzida:</DialogTitle>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                required
                size="small"
                margin="dense"
                name="UG1reduzida"
                label="Consumo UG1"
                variant="outlined"
                value={formConfigData.UG1reduzida}
                onChange={handleChange}
              />
              <TextField
                required
                size="small"
                margin="dense"
                name="UG2reduzida"
                label="Consumo UG2"
                variant="outlined"
                value={formConfigData.UG2reduzida}
                onChange={handleChange}
              />
              <TextField
                required
                size="small"
                margin="dense"
                name="UG3reduzida"
                label="Consumo UG3"
                variant="outlined"
                value={formConfigData.UG3reduzida}
                onChange={handleChange}
              />
            </Box>

            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Cancelar
              </Button>
              <Box sx={{ m: 1, position: "relative" }}>
                <Button type="submit" variant="contained" disabled={loading}>
                  Salvar
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
              </Box>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
