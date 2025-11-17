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

const formatValueToFloat = (value) => {
  if(!value) return 0;
  let cleanedValue = value.replace(/\./g, "");
  cleanedValue = cleanedValue.replace(/,/g, ".");
  const floatValue = parseFloat(cleanedValue);

  return floatValue;
};

export default function ModalEditarEstoquePorPilha({
  abrirModalEstoquePorPilha,
  setAbrirModalEstoquePorPilha,
  fetchVolumePilhaGeral,
  pilha,
  idEdit,
}) {
  const [loading, setLoading] = useState(false);
  const [formRowData, setFormRowData] = useState({
    id: "",
    navio: "",
    volume: null,
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setAbrirModalEstoquePorPilha(false);
  };

  const handleChange = (id, event) => {
    const { name, value } = event.target;
    let newValue = value;
    if (name === "volume") {
      newValue = formatValueToFloat(value);
    }

    setFormRowData((prevData) =>
      prevData.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [name]: newValue,
          };
        }
        return item;
      })
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validado = formRowData.some((item) => {
      if (!item.id || !item.navio || item.volume < 0) {
        setNotify({
          open: true,
          message: "Dados obrigatórios",
          severity: "info",
        });
        return true;
      }
      return false;
    });

    if (validado) return;

    setLoading(true);
    fetch(`${API_URL}/estoque/navio/pilha`, {
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
          fetchVolumePilhaGeral();
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
    setLoading(false);
    if (!pilha || pilha.length === 0) return;
    const newRows = pilha.map((d) => ({
      id: d.id,
      navio: d.navio,
      volume: d.volume,
    }));
    setFormRowData(newRows);
  }, [pilha]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog open={abrirModalEstoquePorPilha} onClose={handleClose} fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <DialogTitle>Estoque da Pilha {idEdit}</DialogTitle>
          <form onSubmit={handleSubmit}>
            {formRowData &&
              formRowData.length > 0 &&
              formRowData.map((item, key) => (
                <Box display="flex" gap={1} key={item.id || key}>
                  {" "}
                  <TextField
                    type="hidden"
                    name="id"
                    value={item.id}
                    style={{ display: "none" }}
                  />
                  <TextField
                    required
                    margin="dense"
                    name="navio"
                    label="Navio"
                    fullWidth
                    variant="outlined"
                    value={item.navio}
                    onChange={(event) => handleChange(item.id, event)}
                  />
                  <TextField
                    required
                    margin="dense"
                    name="volume"
                    label="Volume"
                    fullWidth
                    variant="outlined"
                    value={item.volume}
                    onChange={(event) => handleChange(item.id, event)}
                  />
                </Box>
              ))}
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
