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

export default function ModalEncerrarContrato({
  abrirModalEncerrarContrato,
  setAbrirModalEncerrarContrato,
  rowContrato,
  setRowContrato,
  fetchContratos,
}) {
  const [loading, setLoading] = useState(false);
  const [formRowEncerra, setFormRowEncerra] = useState({
    id: "",
    contrato: "",
    fornecedor: "",
    valor_contrato: "",
    vigencia: "",
    reajuste: "",
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setAbrirModalEncerrarContrato(false);
    setRowContrato([]);
  };

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

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);
    fetch(`${API_URL}/contratos/encerramento`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ dados: formRowEncerra }),
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
    setFormRowEncerra({
      id: rowContrato.id,
      contrato: rowContrato.contrato,
      fornecedor: rowContrato.fornecedor,
      valor_contrato: rowContrato.valor_contrato
        ? rowContrato.valor_contrato.replace("R$", "").trim()
        : "",
      vigencia: formatarDataParaInput(rowContrato.vigencia),
      reajuste: formatarDataParaInput(rowContrato.reajuste),
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
        open={abrirModalEncerrarContrato}
        onClose={handleClose}
        disableRestoreFocus
        fullWidth
      >
        <DialogContent sx={{ p: 3 }}>
          <DialogTitle>Encerrar Contrato</DialogTitle>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                disabled
                margin="dense"
                name="contrato"
                label="Contrato Selecionado"
                variant="outlined"
                fullWidth
                value={formRowEncerra.contrato}
              />
              <TextField
                disabled
                fullWidth
                margin="dense"
                name="fornecedor"
                label="Fornecedor"
                variant="outlined"
                value={formRowEncerra.fornecedor}
              />
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                disabled
                fullWidth
                margin="dense"
                name="reajuste"
                label="Reajuste"
                type={formRowEncerra.reajuste === "SEM REAJUSTE" ? "text" : "date"}
                variant="outlined"
                value={formRowEncerra.reajuste}
              />
              <TextField
                disabled
                fullWidth
                margin="dense"
                id="vigencia"
                name="vigencia"
                label="Vigência"
                type="date"
                variant="outlined"
                value={formRowEncerra.vigencia}
              />
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                disabled
                fullWidth
                margin="dense"
                name="valor_contrato"
                label="Valor do Contrato"
                variant="outlined"
                value={formRowEncerra.valor_contrato}
              />
            </Box>
            <DialogActions>
              <Button autoFocus onClick={handleClose} variant="outlined">
                Cancelar
              </Button>
              <Box sx={{ m: 1, position: "relative" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  color="error"
                >
                  Encerrar
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
