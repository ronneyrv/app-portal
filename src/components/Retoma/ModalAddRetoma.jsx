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

export default function ModalAddRetoma({
  abrirModalRetoma,
  setAbrirModalRetoma,
  formData,
  setFormData,
  fetchRetoma,
}) {
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setAbrirModalRetoma(false);
    setFormData((prevData) => ({
      ...prevData,
      maquina: "",
      ug: "",
      pilha: "",
      volume: null,
      navio: "",
      inicio: "",
      fim: "",
      observacao: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.maquina) {
      setNotify({
        open: true,
        message: "Informe o Equipamento",
        severity: "info",
      });
      return;
    }
    if (formData.classificacao == "RETOMA" && !formData.ug) {
      setNotify({
        open: true,
        message: "Informe a Unidade Geradora",
        severity: "info",
      });
      return;
    }
    if (formData.classificacao == "EMPILHA" && !formData.navio) {
      setNotify({
        open: true,
        message: "Informe o Navio",
        severity: "info",
      });
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/retoma/adicionar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ dados: formData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type == "success") {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
          fetchRetoma();
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const pilhaDisabled = (pilha, formData) => {
    const { classificacao, maquina, ug } = formData;

    if (classificacao !== "RETOMA") {
      return false;
    }

    if (maquina === "STACKER 1") {
      if (ug === "UG1" || ug === "UG2") {
        return !["2B", "2C", "2D"].includes(pilha);
      }
      if (ug === "UG3") {
        return !["1A", "1B", "2A"].includes(pilha);
      }
    }

    if (maquina === "STACKER 2") {
      if (ug === "UG1" || ug === "UG2") {
        return !["2B", "2C", "2D", "3A", "3B"].includes(pilha);
      }
      if (ug === "UG3") {
        return !["2A"].includes(pilha);
      }
    }

    if (maquina === "ESCAVADEIRA") {
      return false;
    }

    return true;
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog open={abrirModalRetoma} onClose={handleClose} fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <DialogTitle>Adicionar: {formData.classificacao}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={1}>
              <FormControl>
                <FormLabel id="maquina" required>
                  Equipamento:
                </FormLabel>
                <RadioGroup
                  row
                  name="maquina"
                  value={formData.maquina}
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
                  {formData.classificacao == "EMPILHA" && (
                    <FormControlLabel
                      value="CAÇAMBA"
                      control={<Radio />}
                      label="Caçamba"
                    />
                  )}
                  {formData.classificacao == "RETOMA" && (
                    <FormControlLabel
                      value="ESCAVADEIRA"
                      control={<Radio />}
                      label="Escavadeira"
                    />
                  )}
                </RadioGroup>
              </FormControl>
            </Box>
            {formData.classificacao == "RETOMA" && (
              <Box display="flex" gap={1}>
                <FormControl>
                  <FormLabel id="ug" required>
                    Unidade:
                  </FormLabel>
                  <RadioGroup
                    row
                    name="ug"
                    value={formData.ug}
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
            )}
            {formData.classificacao == "EMPILHA" && (
              <Box display="flex" gap={1}>
                <TextField
                  required
                  margin="dense"
                  name="navio"
                  label="Navio"
                  placeholder="Exemplo: MV NAVIO"
                  fullWidth
                  variant="outlined"
                  value={formData.navio}
                  onChange={handleChange}
                />
              </Box>
            )}
            {(formData.classificacao == "RETOMA" ||
              formData.classificacao == "EMPILHA") && (
              <Box display="flex" gap={1}>
                <TextField
                  required
                  select
                  margin="dense"
                  name="pilha"
                  label="Pilha"
                  fullWidth
                  variant="outlined"
                  value={formData.pilha}
                  onChange={handleChange}
                >
                  {["1A", "1B", "2A", "2B", "2C", "2D", "3A", "3B"].map(
                    (pilha) => (
                      <MenuItem
                        key={pilha}
                        value={pilha}
                        disabled={pilhaDisabled(pilha, formData)}
                      >
                        {pilha}
                      </MenuItem>
                    )
                  )}
                </TextField>
                <TextField
                  required
                  margin="dense"
                  name="volume"
                  label="Volume"
                  fullWidth
                  variant="outlined"
                  value={formData.volume}
                  onChange={handleChange}
                />
              </Box>
            )}
            <Divider sx={{ my: 3 }} />
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
                value={formData.inicio}
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
                value={formData.fim}
                onChange={handleChange}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>
            {(formData.classificacao == "DESL. AUTOMÁTICO" ||
              formData.classificacao == "MAN. CORRETIVA" ||
              formData.classificacao == "MAN. PROGRAMADA") && (
              <Box display="flex" gap={1}>
                <TextField
                  required
                  select
                  margin="dense"
                  name="especialidade"
                  label="Especialidade"
                  fullWidth
                  variant="outlined"
                  value={formData.especialidade}
                  onChange={handleChange}
                >
                  <MenuItem value="OPERAÇÃO">OPERAÇÃO</MenuItem>
                  <MenuItem value="MECÂNICA">MECÂNICA</MenuItem>
                  <MenuItem value="ELÉTRICA">ELÉTRICA</MenuItem>
                  <MenuItem value="AUTOMAÇÃO">AUTOMAÇÃO</MenuItem>
                </TextField>
              </Box>
            )}
            {(formData.classificacao == "DESL. AUTOMÁTICO" ||
              formData.classificacao == "MAN. CORRETIVA" ||
              formData.classificacao == "MAN. PROGRAMADA" ||
              formData.classificacao == "LIMPEZA") && (
              <Box display="flex" gap={1} alignItems="center" mt={1}>
                <TextField
                  required
                  margin="dense"
                  name="observacao"
                  label="Observação"
                  multiline
                  minRows={2}
                  fullWidth
                  variant="outlined"
                  value={formData.observacao}
                  onChange={handleChange}
                />
              </Box>
            )}
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
