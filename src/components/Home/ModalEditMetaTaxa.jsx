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

export default function ModalEditMetaTaxa({
  abrirModalMetaTaxa,
  setAbrirModalMetaTaxa,
  fetchMetaTaxa,
  formMeta,
}) {
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formMetaTaxa, setFormMetaTaxa] = useState({
    ruim: "",
    bom: "",
    otimo: "",
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setAbrirModalMetaTaxa(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormMetaTaxa((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    for (const meta in formMetaTaxa) {
      if (formMetaTaxa.hasOwnProperty(meta)) {
        const valor = formMetaTaxa[meta];
        if (valor === "") {
          return setNotify({
            open: true,
            message: "Dados obrigatórios",
            severity: "info",
          });
        }
      }
    }

    setLoading(true);
    fetch(`${API_URL}/config/meta`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ dados: formMetaTaxa }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type == "success") {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
          fetchMetaTaxa();
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
    if (formMeta.bom === "") return;
    setLoading(false);
    setFormMetaTaxa({
      ruim: formMeta[0].valor,
      bom: formMeta[1].valor,
      otimo: formMeta[2].valor,
    });
  }, [formMeta]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog open={abrirModalMetaTaxa} onClose={handleClose} fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <DialogTitle>Metas da Taxa de Retoma</DialogTitle>{" "}
            <TextField
              required
              size="small"
              margin="dense"
              fullWidth
              name="ruim"
              label="Ruim"
              variant="outlined"
              value={formMetaTaxa.ruim}
              onChange={handleChange}
            />
            <TextField
              required
              size="small"
              margin="dense"
              fullWidth
              name="bom"
              label="Bom"
              variant="outlined"
              value={formMetaTaxa.bom}
              onChange={handleChange}
            />
            <TextField
              required
              size="small"
              margin="dense"
              fullWidth
              name="otimo"
              label="Ótimo"
              variant="outlined"
              value={formMetaTaxa.otimo}
              onChange={handleChange}
            />
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
