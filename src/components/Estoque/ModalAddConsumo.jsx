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
  Divider,
  DialogTitle,
} from "@mui/material";

const prepararNumero = (value) => {
  const isNegative = value.startsWith("-");
  let cleanedValue = value.replace(/-/g, "").replace(/[^0-9,]/g, "");
  const endsWithComma = cleanedValue.endsWith(",");
  const parts = cleanedValue.split(",");
  if (parts.length > 2) {
    cleanedValue = parts[0] + "," + parts.slice(1).join("");
  }

  if (
    cleanedValue.length > 1 &&
    cleanedValue.startsWith("0") &&
    !cleanedValue.startsWith("0,")
  ) {
    cleanedValue = cleanedValue.substring(1);
  }

  if (
    cleanedValue === "" ||
    cleanedValue === "," ||
    value === "-" ||
    value === "-,"
  ) {
    if (isNegative && cleanedValue.length > 0) {
      return "-" + cleanedValue;
    }
    return isNegative ? value : cleanedValue;
  }

  const numericValue = parseFloat(cleanedValue.replace(",", "."));

  if (isNaN(numericValue)) {
    return isNegative ? "-" + cleanedValue : cleanedValue;
  }

  const options = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
    useGrouping: true,
  };

  const formatter = new Intl.NumberFormat("pt-BR", options);
  let formatted = formatter.format(numericValue * (isNegative ? -1 : 1));

  if (endsWithComma && !formatted.includes(",")) {
    return formatted + ",";
  }

  return formatted;
};

export default function ModalAddConsumo({
  abrirModalAddConsumo,
  setAbrirModalAddConsumo,
  fetchEstoque,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    data: "",
    consumo_ug1: null,
    consumo_ug2: null,
    consumo_ug3: null,
    ajuste_ep: null,
    ajuste_eneva: null,
    tcld_ep: null,
    tcld_eneva: null,
    rodoviario_ep: null,
    rodoviario_eneva: null,
    emprestimo_ep: null,
    emprestimo_eneva: null,
    comentario: "",
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const yesterday = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1);

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const ontemFormatado = `${year}-${month}-${day}`;

    setFormData((prevData) => ({
      ...prevData,
      data: ontemFormatado,
    }));
  };

  const limparInputs = () => {
    setFormData((prevData) => ({
      ...prevData,
      consumo_ug1: null,
      consumo_ug2: null,
      consumo_ug3: null,
      ajuste_ep: null,
      ajuste_eneva: null,
      tcld_ep: null,
      tcld_eneva: null,
      rodoviario_ep: null,
      rodoviario_eneva: null,
      emprestimo_ep: null,
      emprestimo_eneva: null,
      comentario: "",
    }));
  };

  const handleClose = () => {
    setAbrirModalAddConsumo(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.data) {
      setNotify({
        open: true,
        message: "Informe a data do consumo!",
        severity: "info",
      });
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/estoque/consumo`, {
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
          fetchEstoque();
          handleClose();
          limparInputs();
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
    if (name !== "data" && name !== "comentario") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: prepararNumero(value),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    setLoading(false);
    yesterday();
  }, []);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog
        open={abrirModalAddConsumo}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
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
            <DialogTitle
              sx={{
                borderRadius: 1,
                bgcolor: "#e1f5fe",
              }}
            >
              Energia Pecém
            </DialogTitle>
            <Box display="flex" gap={1}>
              <TextField
                margin="dense"
                name="consumo_ug1"
                label="Consumo UG1"
                fullWidth
                variant="outlined"
                value={formData.consumo_ug1}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="consumo_ug2"
                label="Consumo UG2"
                fullWidth
                variant="outlined"
                value={formData.consumo_ug2}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                size="small"
                margin="dense"
                name="ajuste_ep"
                label="Ajuste EP"
                variant="outlined"
                value={formData.ajuste_ep}
                onChange={handleChange}
              />
              <TextField
                size="small"
                margin="dense"
                name="tcld_ep"
                label="TCLD EP"
                variant="outlined"
                value={formData.tcld_ep}
                onChange={handleChange}
              />
              <TextField
                size="small"
                margin="dense"
                name="rodoviario_ep"
                label="Rodoviario EP"
                variant="outlined"
                value={formData.rodoviario_ep}
                onChange={handleChange}
              />
              <TextField
                size="small"
                margin="dense"
                name="emprestimo_ep"
                label="Emprestimo EP"
                variant="outlined"
                value={formData.emprestimo_ep}
                onChange={handleChange}
              />
            </Box>
            <DialogTitle
              sx={{
                borderRadius: 1,
                bgcolor: "#ffe0b2",
              }}
            >
              Eneva
            </DialogTitle>
            <Box display="flex" gap={1}>
              <TextField
                color="warning"
                margin="dense"
                name="consumo_ug3"
                label="Consumo UG3"
                fullWidth
                variant="outlined"
                value={formData.consumo_ug3}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                color="warning"
                size="small"
                margin="dense"
                name="ajuste_eneva"
                label="Ajuste ENEVA"
                variant="outlined"
                value={formData.ajuste_eneva}
                onChange={handleChange}
              />
              <TextField
                color="warning"
                size="small"
                margin="dense"
                name="tcld_eneva"
                label="TCLD ENEVA"
                variant="outlined"
                value={formData.tcld_eneva}
                onChange={handleChange}
              />
              <TextField
                color="warning"
                size="small"
                margin="dense"
                name="rodoviario_eneva"
                label="Rodoviario ENEVA"
                variant="outlined"
                value={formData.rodoviario_eneva}
                onChange={handleChange}
              />
              <TextField
                color="warning"
                size="small"
                margin="dense"
                name="emprestimo_eneva"
                label="Emprestimo ENEVA"
                variant="outlined"
                value={formData.emprestimo_eneva}
                onChange={handleChange}
              />
            </Box>
            <Divider />
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                color="#616161"
                margin="dense"
                name="comentario"
                label="Comentário"
                multiline
                minRows={2}
                fullWidth
                variant="outlined"
                value={formData.comentario}
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
