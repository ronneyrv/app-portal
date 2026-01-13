import { useEffect, useState } from "react";
import NotifyBar from "../NotifyBar";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

const formatarDataParaInput = (dataBR) => {
  if (!dataBR) return "";
  if (dataBR === "SEM REAJUSTE") {
    return dataBR;
  }
  const partes = dataBR.split("/");
  if (partes.length !== 3) {
    console.error("Formato de data inválido:", dataBR);
    return "";
  }
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
};

export default function ModalReajusteContrato({
  abrirModalReajusteContrato,
  setAbrirModalReajusteContrato,
  rowContrato,
  setRowContrato,
  fetchContratos,
}) {
  const [loading, setLoading] = useState(false);
  const [formRowData, setFormRowData] = useState({
    id: "",
    contrato: "",
    fornecedor: "",
    reajuste: "",
    novo_reajuste: "",
    tarifa: "",
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setAbrirModalReajusteContrato(false);
    setRowContrato([]);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormRowData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const upAno = () => {
    const dataAtual = new Date(formRowData.reajuste);
    const novaData = new Date(dataAtual);
    novaData.setFullYear(novaData.getFullYear() + 1);
    setFormRowData((prevData) => ({
      ...prevData,
      novo_reajuste: novaData.toISOString().split("T")[0],
    }));
  };

  const downAno = () => {
    const dataAtual = new Date(formRowData.reajuste);
    const novaData = new Date(dataAtual);
    novaData.setFullYear(novaData.getFullYear() - 1);
    setFormRowData((prevData) => ({
      ...prevData,
      novo_reajuste: novaData.toISOString().split("T")[0],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formRowData.contrato || !formRowData.fornecedor) {
      setNotify({
        open: true,
        message: "Dados obrigatórios",
        severity: "info",
      });
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/contratos/reajuste`, {
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
      tarifa: rowContrato.tarifa,
      reajuste:
        rowContrato.reajuste === "SEM REAJUSTE"
          ? null
          : formatarDataParaInput(rowContrato.reajuste),
      novo_reajuste: "",
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
        open={abrirModalReajusteContrato}
        onClose={handleClose}
        disableRestoreFocus
        fullWidth
      >
        <DialogContent sx={{ p: 3 }}>
          <DialogTitle>Reajuste Anual</DialogTitle>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={1} alignItems="center" mb={1}>
              <TextField
                disabled
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
            {!formRowData.reajuste ? (
              <Typography sx={{ fontWeight: "bold", margin: 8, paddingLeft: 10}}>
                CONTRATO SEM REAJUSTE ANUAL.
              </Typography>
            ) : (
              <>
                <Box display="flex" gap={1}>
                  <TextField
                    disabled
                    fullWidth
                    margin="dense"
                    id="reajuste"
                    name="reajuste"
                    label="Data de Reajuste"
                    type="date"
                    variant="outlined"
                    value={formRowData.reajuste}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    margin="dense"
                    id="novo_reajuste"
                    name="novo_reajuste"
                    label="Data do Próximo Reajuste"
                    type="date"
                    variant="outlined"
                    value={formRowData.novo_reajuste}
                    onChange={handleChange}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ArrowCircleUpIcon
                      onClick={() => {
                        upAno();
                      }}
                      sx={{ cursor: "pointer" }}
                    />
                    <ArrowCircleDownIcon
                      onClick={() => {
                        downAno();
                      }}
                      sx={{ cursor: "pointer" }}
                    />
                  </Box>
                </Box>

                <Box display="flex" gap={1}>
                  <TextField
                    multiline
                    fullWidth
                    minRows={3}
                    margin="dense"
                    name="tarifa"
                    label="Tarifa"
                    variant="outlined"
                    value={formRowData.tarifa}
                    onChange={handleChange}
                  />
                </Box>
              </>
            )}
            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Cancelar
              </Button>
              <Box sx={{ m: 1, position: "relative" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !formRowData.novo_reajuste}
                >
                  Salvar nova data de reajuste
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
