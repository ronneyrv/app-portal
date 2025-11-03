import { useEffect, useState } from "react";
import NotifyBar from "../NotifyBar";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  MenuItem,
} from "@mui/material";

export default function ModalAddPolimero({
  abrirModalAddPolimero,
  setAbrirModalAddPolimero,
  fetchEstoquePolimero,
  fetchPolimero,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setAbrirModalAddPolimero(false);
    setFormData((prevData) => ({
      ...prevData,
      data: "",
      tipo: "",
      volume: null,
      pilha: "",
      responsavel: "",
      observacao: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !formData.data ||
      !formData.tipo ||
      !formData.pilha ||
      !formData.volume ||
      !formData.responsavel
    ) {
      setNotify({
        open: true,
        message: "Preencha todos os obrigatórios!",
        severity: "info",
      });
      return;
    }
    setLoading(true);
    fetch(`${API_URL}/polimero/adicionar`, {
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
          fetchPolimero();
          fetchEstoquePolimero();
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
      <Dialog open={abrirModalAddPolimero} onClose={handleClose} fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={1}>
              <FormControl>
                <FormLabel id="tipo" required>
                  Tipo:
                </FormLabel>
                <RadioGroup
                  row
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="SAIDA"
                    control={<Radio />}
                    label="SAÍDA"
                  />
                  <FormControlLabel
                    value="ENTRADA"
                    control={<Radio />}
                    label="ENTRADA"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                required
                margin="dense"
                id="data"
                name="data"
                label="Data"
                type="date"
                variant="outlined"
                value={formData.data}
                onChange={handleChange}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>
            <Box display="flex" gap={1}>
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
                {formData.tipo === "ENTRADA"
                  ? ["EP", "ENEVA"].map((pilha) => (
                      <MenuItem key={pilha} value={pilha}>
                        {pilha}
                      </MenuItem>
                    ))
                  : ["1A", "1B", "2A", "2B", "2C", "2D", "3A", "3B"].map(
                      (pilha) => (
                        <MenuItem key={pilha} value={pilha}>
                          {pilha}
                        </MenuItem>
                      )
                    )}
              </TextField>{" "}
            </Box>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                required
                margin="dense"
                name="responsavel"
                label="Responsável"
                fullWidth
                variant="outlined"
                value={formData.responsavel}
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
                value={formData.observacao}
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
