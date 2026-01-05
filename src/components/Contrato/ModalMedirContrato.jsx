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

export default function ModalMedirContrato({
  abrirModalMedirContrato,
  setAbrirModalMedirContrato,
  rowContrato,
  setRowContrato,
  fetchContratos,
}) {
  const [loading, setLoading] = useState(false);
  const [formRowData, setFormRowData] = useState({
    contrato: "",
    fornecedor: "",
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;
  const anoAtual = new Date().getFullYear();
  const anoLista = [anoAtual - 1, anoAtual];

  const handleClose = () => {
    setAbrirModalMedirContrato(false);
    setRowContrato([]);
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

    if (
      !formRowData.mes ||
      !formRowData.ano ||
      !formRowData.medicao ||
      !formRowData.pedido ||
      !formRowData.valor ||
      !formRowData.descricao ||
      !formRowData.status_medicao
    ) {
      setNotify({
        open: true,
        message: "Ha campos obrigatórios não preenchidos",
        severity: "info",
      });
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/contratos/medicao`, {
      method: "POST",
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
      contrato: rowContrato.contrato,
      fornecedor: rowContrato.fornecedor,
      ano: anoAtual,
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
        open={abrirModalMedirContrato}
        onClose={handleClose}
        disableRestoreFocus
        fullWidth
      >
        <DialogContent sx={{ p: 3 }}>
          <DialogTitle>
            {formRowData.contrato} - {formRowData.fornecedor}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={1}>
              <TextField
                autoFocus
                required
                select
                size="small"
                margin="dense"
                name="mes"
                label="Mês"
                variant="outlined"
                value={formRowData.mes}
                onChange={handleChange}
                sx={{ width: "200px" }}
              >
                <MenuItem value="1">JANEIRO</MenuItem>
                <MenuItem value="2">FEVEREIRO</MenuItem>
                <MenuItem value="3">MARÇO</MenuItem>
                <MenuItem value="4">ABRIL</MenuItem>
                <MenuItem value="5">MAIO</MenuItem>
                <MenuItem value="6">JUNHO</MenuItem>
                <MenuItem value="7">JULHO</MenuItem>
                <MenuItem value="8">AGOSTO</MenuItem>
                <MenuItem value="9">SETEMBRO</MenuItem>
                <MenuItem value="10">OUTUBRO</MenuItem>
                <MenuItem value="11">NOVEMBRO</MenuItem>
                <MenuItem value="12">DEZEMBRO</MenuItem>
              </TextField>
              <TextField
                required
                size="small"
                margin="dense"
                name="ano"
                label="Ano"
                variant="outlined"
                value={formRowData.ano}
                onChange={handleChange}
                type="number"
                sx={{ width: "150px" }}
              />
            </Box>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                required
                fullWidth
                margin="dense"
                name="medicao"
                label="Medição"
                variant="outlined"
                value={formRowData.medicao}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                margin="dense"
                name="pedido"
                label="Pedido"
                variant="outlined"
                value={formRowData.pedido}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="dense"
                name="frs_migo"
                label="FRS/MIGO"
                variant="outlined"
                value={formRowData.frs_migo}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                required
                fullWidth
                margin="dense"
                name="valor"
                label="Valor"
                variant="outlined"
                value={formRowData.valor}
                onChange={handleChange}
              />
              <TextField
                fullWidth
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
                required
                multiline
                fullWidth
                minRows={3}
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
                fullWidth
                margin="dense"
                name="plano_orcamentario"
                label="Plano Orcamentário"
                variant="outlined"
                value={formRowData.plano_orcamentario}
                onChange={handleChange}
              />
              <TextField
                required
                select
                margin="dense"
                name="status_medicao"
                label="Status Medição"
                fullWidth
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
                  Salvar Medição
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
