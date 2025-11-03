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

const formatarDataParaInput = (dataBR) => {
  if (!dataBR) return "";
  const partes = dataBR.split("/");
  if (partes.length !== 3) {
    console.error("Formato de data inválido:", dataBR);
    return "";
  }
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
};

export default function ModalEditarPolimero({
  abrirModalEditarPolimero,
  setAbrirModalEditarPolimero,
  rowEdit,
  fetchEstoquePolimero,
  fetchPolimero,
}) {
  const [loading, setLoading] = useState(false);
  const [formRowData, setFormRowData] = useState({
    id_aplicacao: "",
    data: "",
    tipo: "",
    pilha: "",
    volume: null,
    responsavel: "",
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setAbrirModalEditarPolimero(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormRowData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let id = formRowData.id_aplicacao;

    if (
      !formRowData.data ||
      !formRowData.tipo ||
      !formRowData.volume ||
      !formRowData.pilha ||
      !formRowData.responsavel
    ) {
      setNotify({
        open: true,
        message: "Dados obrigatórios",
        severity: "info",
      });
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/polimero/atualizar/${id}`, {
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

  useEffect(() => {
    setLoading(false);
    setFormRowData({
      id_aplicacao: rowEdit.id,
      data: formatarDataParaInput(rowEdit.data),
      tipo: rowEdit.tipo,
      pilha: rowEdit.pilha,
      volume: rowEdit.volume,
      responsavel: rowEdit.responsavel,
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
      <Dialog open={abrirModalEditarPolimero} onClose={handleClose} fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <DialogTitle>EDITAR</DialogTitle>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel id="tipo" required>
                Tipo:
              </FormLabel>
              <RadioGroup
                row
                name="tipo"
                value={formRowData.tipo}
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
            <TextField
              required
              margin="dense"
              id="data"
              name="data"
              label="Data"
              type="date"
              variant="outlined"
              value={formRowData.data}
              onChange={handleChange}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <Box display="flex" gap={1}>
              <TextField
                required
                margin="dense"
                name="volume"
                label="Volume"
                fullWidth
                variant="outlined"
                value={formRowData.volume}
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
                value={formRowData.pilha}
                onChange={handleChange}
              >
                {formRowData.tipo === "ENTRADA"
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
              </TextField>
            </Box>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                margin="dense"
                name="responsavel"
                label="Responsável"
                fullWidth
                variant="outlined"
                value={formRowData.responsavel}
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
