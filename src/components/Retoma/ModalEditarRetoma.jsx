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
  Divider,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  MenuItem,
} from "@mui/material";

const formatarDataParaInput = (dataString) => {
  if (!dataString) {
    return "";
  }
  const [data, hora] = dataString.split(" ");
  const [dia, mes, ano] = data.split("/");

  return `${ano}-${mes}-${dia}T${hora}`;
};

export default function ModalEditarRetoma({
  abrirModalEditarRetoma,
  setAbrirModalEditarRetoma,
  rowEdit,
  fetchValores,
}) {
  const [loading, setLoading] = useState(false);
  const [formRowData, setFormRowData] = useState({
    id: "",
    inicio: "",
    fim: "",
    classificacao: "",
    especialidade: "",
    maquina: "",
    ug: "",
    pilha: "",
    volume: null,
    observacao: "",
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setAbrirModalEditarRetoma(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let id = formRowData.id;

    if (!formRowData.inicio || !formRowData.fim) {
      setNotify({
        open: true,
        message: "Início e Fim são obrigatórios",
        severity: "info",
      });
      return;
    }

    if (!formRowData.maquina) {
      setNotify({
        open: true,
        message: "Equipamento obrigatório",
        severity: "info",
      });
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/retoma/atualizar/${id}`, {
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
          fetchValores();
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormRowData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setLoading(false);
    setFormRowData({
      id: rowEdit.id,
      inicio: formatarDataParaInput(rowEdit.inicio),
      fim: formatarDataParaInput(rowEdit.fim),
      classificacao: rowEdit.classificacao,
      especialidade: rowEdit.especialidade,
      maquina: rowEdit.maquina,
      ug: rowEdit.ug,
      pilha: rowEdit.pilha,
      volume: rowEdit.volume,
      observacao: rowEdit.observacao,
    });
  }, [rowEdit]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog open={abrirModalEditarRetoma} onClose={handleClose} fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <DialogTitle>EDITAR</DialogTitle>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                required
                margin="dense"
                id="inicio"
                name="inicio"
                label="Inicio"
                fullWidth
                type="datetime-local"
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
                margin="dense"
                id="fim"
                name="fim"
                label="Fim"
                fullWidth
                type="datetime-local"
                variant="outlined"
                value={formRowData.fim}
                onChange={handleChange}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>
            <Box display="flex" gap={1}>
              <FormControl>
                <FormLabel id="maquina" required>
                  Equipamento:
                </FormLabel>
                <RadioGroup
                  row
                  name="maquina"
                  value={formRowData.maquina}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="STACKER 1"
                    control={<Radio />}
                    label="Stacker 1"
                  />
                  <FormControlLabel
                    value="STACKER 2"
                    control={<Radio />}
                    label="Stacker 2"
                  />
                  <FormControlLabel
                    value="CAÇAMBA"
                    control={<Radio />}
                    label="Caçamba"
                  />
                  <FormControlLabel
                    value="ESCAVADEIRA"
                    control={<Radio />}
                    label="Escavadeira"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box display="flex" gap={1}>
              <FormControl>
                <FormLabel id="ug">Unidade:</FormLabel>
                <RadioGroup
                  row
                  name="ug"
                  value={formRowData.ug}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="UG1"
                    control={<Radio />}
                    label="UG1"
                  />
                  <FormControlLabel
                    value="UG2"
                    control={<Radio />}
                    label="UG2"
                  />
                  <FormControlLabel
                    value="UG3"
                    control={<Radio />}
                    label="UG3"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                required
                select
                margin="dense"
                name="classificacao"
                label="Ocorrência"
                fullWidth
                variant="outlined"
                value={formRowData.classificacao}
                onChange={handleChange}
              >
                {[
                  "RETOMA",
                  "EMPILHA",
                  "MUDANÇA DE PILHA",
                  "DESL. AUTOMÁTICO",
                  "MAN. CORRETIVA",
                  "MAN. PROGRAMADA",
                  "LIMPEZA",
                ].map((classificacao) => (
                  <MenuItem key={classificacao} value={classificacao}>
                    {classificacao}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                select
                margin="dense"
                name="especialidade"
                label="Especialidade"
                fullWidth
                variant="outlined"
                value={formRowData.especialidade}
                onChange={handleChange}
              >
                {["OPERAÇÃO", "MECÂNICA", "ELÉTRICA", "AUTOMAÇÃO"].map(
                  (especialidade) => (
                    <MenuItem key={especialidade} value={especialidade}>
                      {especialidade}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                select
                margin="dense"
                name="pilha"
                label="Pilha"
                fullWidth
                variant="outlined"
                value={formRowData.pilha}
                onChange={handleChange}
              >
                {["1A", "1B", "2A", "2B", "2C", "2D", "3A", "3B"].map(
                  (pilha) => (
                    <MenuItem key={pilha} value={pilha}>
                      {pilha}
                    </MenuItem>
                  )
                )}
              </TextField>
              <TextField
                margin="dense"
                name="volume"
                label="Volume"
                fullWidth
                variant="outlined"
                value={formRowData.volume}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                margin="dense"
                name="observacao"
                label="Observação"
                multiline
                minRows={2}
                fullWidth
                variant="outlined"
                value={formRowData.observacao}
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
