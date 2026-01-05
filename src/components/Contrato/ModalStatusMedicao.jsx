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

export default function ModalStatusMedicao({
  abrirModalStatusMedicao,
  setAbrirModalStatusMedicao,
  rowMedicao,
  setRowMedicao,
  fetchMedicoes,
}) {
  const [loading, setLoading] = useState(false);
  const [formRowData, setFormRowData] = useState({
    id: "",
    mes: "",
    medicao: "",
    pedido: "",
    contrato: "",
    centro_custo: "",
    fornecedor: "",
    descricao: "",
    valor: "",
    status_medicao: "",
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setAbrirModalStatusMedicao(false);
    setRowMedicao([]);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "valor") {
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
        message: "Medição não localizada",
        severity: "info",
      });
      return;
    }

    if (!formRowData.status_medicao) {
      setNotify({
        open: true,
        message: "Status obrigatórios",
        severity: "info",
      });
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/contratos/medicao/status`, {
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
          fetchMedicoes();
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
    if (!rowMedicao || rowMedicao.length === 0) return;
    setLoading(false);
    setFormRowData({
      id: rowMedicao.id,
      mes: rowMedicao.mes,
      medicao: rowMedicao.medicao,
      pedido: rowMedicao.pedido,
      centro_custo: rowMedicao.centro_custo,
      contrato: rowMedicao.contrato,
      fornecedor: rowMedicao.fornecedor,
      descricao: rowMedicao.descricao,
      valor: rowMedicao.valor.replace("R$", "").trim(),
      status_medicao: rowMedicao.status_medicao,
    });
  }, [rowMedicao]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog
        open={abrirModalStatusMedicao}
        onClose={handleClose}
        disableRestoreFocus
        fullWidth
      >
        <DialogContent sx={{ p: 3 }}>
          <DialogTitle>
            Status Medição {formRowData.contrato}, mês de {formRowData.mes}.
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                disabled
                fullWidth
                size="small"
                margin="dense"
                name="contrato"
                label="Contrato"
                variant="outlined"
                value={formRowData.contrato}
                onChange={handleChange}
                sx={{ width: "300px" }}
              />
              <TextField
                disabled
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
                disabled
                fullWidth
                size="small"
                margin="dense"
                name="medicao"
                label="Medição"
                variant="outlined"
                value={formRowData.medicao}
                onChange={handleChange}
              />
              <TextField
                disabled
                fullWidth
                size="small"
                margin="dense"
                name="pedido"
                label="Pedido"
                variant="outlined"
                value={formRowData.pedido}
                onChange={handleChange}
              />
              <TextField
                disabled
                fullWidth
                size="small"
                margin="dense"
                name="centro_custo"
                label="Centro de Custo"
                variant="outlined"
                value={formRowData.centro_custo}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                disabled
                multiline
                fullWidth
                minRows={2}
                size="small"
                margin="dense"
                name="descricao"
                label="Descrição"
                variant="outlined"
                value={formRowData.descricao}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                disabled
                fullWidth
                size="small"
                margin="dense"
                name="valor"
                label="Valor"
                variant="outlined"
                value={formRowData.valor}
                onChange={handleChange}
              />
              <TextField
                required
                select
                fullWidth
                size="small"
                margin="dense"
                name="status_medicao"
                label="Status "
                variant="outlined"
                value={formRowData.status_medicao}
                onChange={handleChange}
              >
                {[
                  "EM ANDAMENTO",
                  "NF ENVIADA NFE",
                  "NF ENVIADA NFS",
                  "NF ENVIADA NFE/NFS",
                  "AGUARDANDO APROVAÇÃO",
                  "APROVADO",
                ].map((status_medicao) => (
                  <MenuItem key={status_medicao} value={status_medicao}>
                    {status_medicao}
                  </MenuItem>
                ))}
              </TextField>
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
