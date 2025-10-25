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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ModalFinalNavio({
  abrirModalFinal,
  setAbrirModalFinal,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [bercoOcioso, setBercoOcioso] = useState(false);
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [form, setForm] = useState({
    navio: "",
    cliente: "",
    sistema: "",
    carvao_tipo: "",
    nor: null,
    atracacao: null,
    desatracacao: null,
    inicio_op: null,
    fim_op: null,
    arqueacao_inicial: null,
    arqueacao_final: null,

  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const formatarDataParaInput = (dataString) => {
    const data = new Date(dataString);

    const ano = data.getUTCFullYear().toString();
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, "0");
    const dia = data.getUTCDate().toString().padStart(2, "0");
    const horas = data.getUTCHours().toString().padStart(2, "0");
    const minutos = data.getUTCMinutes().toString().padStart(2, "0");

    return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  };

  const formatarArqueacaoParaInput = (valor) => {
    if (valor === null || valor === undefined || isNaN(Number(valor))) {
      return "";
    }
    const formatador = new Intl.NumberFormat("pt-BR");
    return formatador.format(valor);
  };

  const handleDateChange = (value) => {
    const dateValue = new Date(value);
        return !isNaN(dateValue.getTime()) ? dateValue : value;
};

  const handleClose = () => {
    setOpen(false);
    setAbrirModalFinal(false);
  };

  const handleChange = (e, selectName) => {
    const { value } = e.target;
    let newValue = value;

    if (selectName === "arqueacao_final") {
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
    } else if (selectName === "carvao_tipo") {
      newValue = value.toUpperCase();
    } else {
      newValue = value;
    }
    const newForm = { ...form, [selectName]: newValue };
    setForm(newForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.sistema) {
      setNotify({
        open: true,
        message: "Informe o sistema",
        severity: "info",
      });
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/descarregamento/finalizar`, {
      method: "PUT",
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
          setBercoOcioso(true);
          navigate("/pptm/descarregamento");
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
    fetch(`${API_URL}/descarregamento/descarregando`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          console.error("HTTP status:", res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.type === "success") {
          const dados = data.data[0];
          const atracado = formatarDataParaInput(dados.atracacao);
          const iniciado = formatarDataParaInput(dados.inicio_op);
          const arqueado = formatarArqueacaoParaInput(dados.arqueacao_inicial);

          setForm((prevForm) => ({
            ...prevForm,
            navio: dados.navio,
            cliente: dados.cliente,
            carvao_tipo: dados.carvao_tipo,
            atracacao: atracado,
            inicio_op: iniciado,
            arqueacao_inicial: arqueado,
          }));
        } else {
          setBercoOcioso(true);
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  }, []);

  useEffect(() => {
    if (abrirModalFinal) {
      if (bercoOcioso) {
        setNotify({
          open: true,
          message: "Não há navio para finalizar!",
          severity: "info",
        });
        setOpen(false);
      } else {
        setOpen(true);
      }
    }
  }, [abrirModalFinal]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          {form.navio} - {form.cliente}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <FormControl>
                <FormLabel id="radio-sistema" required>
                  Sistema
                </FormLabel>
                <RadioGroup
                  row
                  name="radio-sistema"
                  value={form.sistema}
                  onChange={(e) => handleChange(e, "sistema")}
                >
                  <FormControlLabel
                    value="CORREIA"
                    control={<Radio />}
                    label="TCLD"
                  />
                  <FormControlLabel
                    value="CAMINHÃO"
                    control={<Radio />}
                    label="TMUT"
                  />
                </RadioGroup>
              </FormControl>
              <TextField
                margin="dense"
                id="nor"
                name="nor"
                label="NOR"
                type="datetime-local"
                fullWidth
                variant="outlined"
                value={form.nor}
                onChange={(e) => handleChange(e, "nor")}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
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
            <Box display="flex" gap={2} mt={2}>
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
                disabled
              />
              <TextField
                required
                margin="dense"
                id="fim_op"
                name="fim_op"
                label="Fim da Operação"
                type="datetime-local"
                fullWidth
                variant="outlined"
                value={form.fim_op}
                onChange={(e) => handleChange(e, "fim_op")}
                autoFocus
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
                id="atracacao"
                name="atracacao"
                label="Atracação"
                type="datetime-local"
                fullWidth
                variant="outlined"
                value={form.atracacao}
                onChange={(e) => handleChange(e, "atracacao")}
                disabled
              />
              <TextField
                required
                margin="dense"
                id="desatracacao"
                name="desatracacao"
                label="Desatracação"
                type="datetime-local"
                fullWidth
                variant="outlined"
                value={form.desatracacao}
                onChange={(e) => handleChange(e, "desatracacao")}
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
                disabled
              />
              <TextField
                required
                margin="dense"
                id="arqueacao_final"
                name="arqueacao_final"
                label="Arqueação Final"
                fullWidth
                variant="outlined"
                value={form.arqueacao_final}
                onChange={(e) => handleChange(e, "arqueacao_final")}
              />
            </Box>
            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Cancelar
              </Button>
              <Box sx={{ m: 1, position: "relative" }}>
                <Button type="submit" variant="contained" disabled={loading}>
                  Finalizar Navio
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
