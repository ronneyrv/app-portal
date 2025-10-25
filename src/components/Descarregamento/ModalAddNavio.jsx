import { useEffect, useState } from "react";
import NotifyBar from "../NotifyBar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";

export default function ModalAddNavio({
  abrirModalAdd,
  setAbrirModalAdd,
  fetchPier,
}) {
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [form, setForm] = useState({
    navio: "",
    cliente: "",
    carvao_tipo: "",
    atracacao: null,
    inicio_op: null,
    arqueacao_inicial: null,
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setAbrirModalAdd(false);
  };

  const formatarDataParaInput = (dataString) => {
    const data = new Date(dataString);

    const ano = data.getUTCFullYear().toString();
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, "0");
    const dia = data.getUTCDate().toString().padStart(2, "0");
    const horas = data.getUTCHours().toString().padStart(2, "0");
    const minutos = data.getUTCMinutes().toString().padStart(2, "0");

    return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  }

  const handleChange = (e, selectName) => {
    const { value } = e.target;
    let newValue = value;

    if (selectName === "arqueacao_inicial") {
      const cleanedValue = value.replace(/[^0-9,]/g, "");
      const parts = cleanedValue.split(",");
      if (parts.length > 2) {
        newValue = parts[0] + "," + parts.slice(1).join("");
      } else {
        newValue = cleanedValue;
      }

      if (
        newValue.length > 1 &&
        newValue.startsWith("0") &&
        !newValue.startsWith("0,")
      ) {
        newValue = newValue.substring(1);
      }

      const numericValue = parseFloat(newValue.replace(",", "."));

      if (!isNaN(numericValue) && newValue.trim() !== "" && newValue !== ",") {
        const options = {
          minimumFractionDigits: 0,
          maximumFractionDigits: 3,
          useGrouping: true,
        };

        const formatted = new Intl.NumberFormat("pt-BR", options).format(
          numericValue
        );
        if (newValue.endsWith(",")) {
          newValue = formatted + ",";
        } else {
          newValue = formatted;
        }
      } else {
        newValue = cleanedValue;
      }
    } else if (selectName === "carvao_tipo" || selectName === "navio") {
      newValue = value.toUpperCase();
    } else {
      newValue = value;
    }
    const newForm = { ...form, [selectName]: newValue };
    setForm(newForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    fetch(`${API_URL}/descarregamento`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ dados: form }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
          handleClose();
          fetchPier();
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
    fetch(`${API_URL}/descarregamento/ultima/ocorrencia`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          const dataAtracacao = formatarDataParaInput(data.data.fim);
          setForm((prevForm) => ({
            ...prevForm,
            atracacao: dataAtracacao,
          }));
        } else {
          console.error("Erro ao buscar lista");
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  }, [abrirModalAdd]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog open={abrirModalAdd} onClose={handleClose} fullWidth>
        <DialogTitle>ADICIONAR NAVIO</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                required
                margin="dense"
                id="navio"
                name="navio"
                label="Navio"
                fullWidth
                variant="outlined"
                value={form.navio}
                autoFocus
                onChange={(e) => handleChange(e, "navio")}
              />
              <TextField
                required
                select
                margin="dense"
                id="cliente"
                name="cliente"
                label="Cliente"
                fullWidth
                variant="outlined"
                value={form.cliente}
                onChange={(e) => handleChange(e, "cliente")}
              >
                <MenuItem value={"ENERGIA PECÉM"}>{"ENERGIA PECÉM"}</MenuItem>
                <MenuItem value={"ENEVA"}>{"ENEVA"}</MenuItem>
                <MenuItem value={"AMP"}>{"AMP"}</MenuItem>
              </TextField>
            </Box>

            <Box display="flex" gap={2} mt={2}>
              <TextField
                required
                margin="dense"
                id="atracacao"
                name="atracacao"
                label="Atracação"
                type="datetime-local"
                fullWidth
                variant="outlined"
                value={form.atracacao}
                onChange={(e) => handleChange(e, "atracacao")}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                disabled
              />
              <TextField
                required
                margin="dense"
                id="inicio_op"
                name="inicio_op"
                label="Início da Operação"
                type="datetime-local"
                fullWidth
                variant="outlined"
                value={form.inicio_op}
                onChange={(e) => handleChange(e, "inicio_op")}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                required
                margin="dense"
                id="arqueacao_inicial"
                name="arqueacao_inicial"
                label="Arqueação Inicial"
                fullWidth
                variant="outlined"
                value={form.arqueacao_inicial}
                onChange={(e) => handleChange(e, "arqueacao_inicial")}
              />
              <TextField
                required
                margin="dense"
                id="carvao_tipo"
                name="carvao_tipo"
                label="Tipo de Carvão"
                fullWidth
                variant="outlined"
                value={form.carvao_tipo}
                onChange={(e) => handleChange(e, "carvao_tipo")}
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
