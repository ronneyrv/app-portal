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
  MenuItem,
} from "@mui/material";

const formatarDataParaInput = (dataBR) => {
  if (!dataBR) return "";
  const partes = dataBR.split("/");
  if (partes.length !== 3) {
    console.error("Formato de data inválido:", dataBR);
    return "";
  }
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
};

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

  const decimalPart = cleanedValue.split(",")[1];
  const decimalLength = decimalPart ? decimalPart.length : 0;
  const maxDigits = 3;

  const options = {
    minimumFractionDigits: Math.min(decimalLength, maxDigits),
    maximumFractionDigits: maxDigits,
    useGrouping: true,
  };
  const formatter = new Intl.NumberFormat("pt-BR", options);
  let formatted = formatter.format(numericValue * (isNegative ? -1 : 1));

  if (endsWithComma && !formatted.includes(",")) {
    return formatted + ",";
  }

  return formatted;
};

export default function ModalEditarContrato({
  abrirModalEditarContrato,
  setAbrirModalEditarContrato,
  rowContrato,
  setRowContrato,
  fetchContratos,
}) {
  const [loading, setLoading] = useState(false);
  const [formRowData, setFormRowData] = useState({
    id: "",
    contrato: "",
    fornecedor: "",
    valor_contrato: "",
    tipo: "",
    inicio: "",
    vigencia: "",
    reajuste: "",
    tarifa: "",
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setAbrirModalEditarContrato(false);
    setRowContrato([]);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "valor_contrato") {
      setFormRowData((prevData) => ({
        ...prevData,
        [name]: prepararNumero(value),
      }));
    } else {
      setFormRowData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let id = formRowData.id;

    if (!id) {
      setNotify({
        open: true,
        message: "Contrato não localizado",
        severity: "info",
      });
      return;
    }

    if (
      !formRowData.contrato ||
      !formRowData.fornecedor ||
      !formRowData.inicio ||
      !formRowData.vigencia ||
      !formRowData.valor_contrato
    ) {
      setNotify({
        open: true,
        message: "Dados obrigatórios",
        severity: "info",
      });
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/contratos`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ dados: formRowData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type == "success") {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
          fetchContratos();
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
    if (!rowContrato || rowContrato.length === 0) return;
    setLoading(false);
    setFormRowData({
      id: rowContrato.id,
      contrato: rowContrato.contrato,
      fornecedor: rowContrato.fornecedor,
      valor_contrato: rowContrato.valor_contrato.replace("R$", "").trim(),
      tipo: rowContrato.tipo,
      inicio: formatarDataParaInput(rowContrato.inicio),
      vigencia: formatarDataParaInput(rowContrato.vigencia),
      reajuste: formatarDataParaInput(rowContrato.reajuste),
      tarifa: rowContrato.tarifa,
    });
  }, [rowContrato]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog
        open={abrirModalEditarContrato}
        onClose={handleClose}
        disableRestoreFocus
        fullWidth
      >
        <DialogContent sx={{ p: 3 }}>
          <DialogTitle>Editar Contrato</DialogTitle>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                required
                size="small"
                margin="dense"
                name="contrato"
                label="Nº Contrato"
                variant="outlined"
                value={formRowData.contrato}
                onChange={handleChange}
                sx={{ width: "300px" }}
              />
              <TextField
                autoFocus
                required
                fullWidth
                size="small"
                margin="dense"
                name="fornecedor"
                label="Fornecedor"
                variant="outlined"
                value={formRowData.fornecedor}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                required
                fullWidth
                size="small"
                margin="dense"
                name="valor_contrato"
                label="Valor do Contrato"
                variant="outlined"
                value={formRowData.valor_contrato}
                onChange={handleChange}
              />
              <TextField
                required
                select
                size="small"
                margin="dense"
                name="tipo"
                label="Tipo de Contrato"
                variant="outlined"
                value={formRowData.tipo}
                onChange={handleChange}
                sx={{ width: "270px" }}
              >
                <MenuItem value="PPTM">PPTM</MenuItem>
                <MenuItem value="GTPC">GTPC</MenuItem>
              </TextField>
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                required
                size="small"
                margin="dense"
                id="inicio"
                name="inicio"
                label="Início do Contrato"
                type="date"
                variant="outlined"
                value={formRowData.inicio}
                onChange={handleChange}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              <TextField
                required
                fullWidth
                size="small"
                margin="dense"
                id="vigencia"
                name="vigencia"
                label="Vigência"
                type="date"
                variant="outlined"
                value={formRowData.vigencia}
                onChange={handleChange}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              <TextField
                fullWidth
                size="small"
                margin="dense"
                id="reajuste"
                name="reajuste"
                label="Reajuste"
                type="date"
                variant="outlined"
                value={formRowData.reajuste}
                onChange={handleChange}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                multiline
                fullWidth
                size="small"
                minRows={3}
                margin="dense"
                name="tarifa"
                label="Tarifa"
                variant="outlined"
                value={formRowData.tarifa}
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
