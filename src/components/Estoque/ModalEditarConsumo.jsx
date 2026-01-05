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

const formatarDataParaInput = (dataBR) => {
  if (!dataBR) return "";
  const partes = dataBR.split("/");
  if (partes.length !== 3) {
    console.error("Formato de data inválido:", dataBR);
    return "";
  }
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
};

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

  const decimalPart = cleanedValue.split(",")[1];
  const decimalLength = decimalPart ? decimalPart.length : 0;
  const maxDigits = 3; 

  const options = {
    minimumFractionDigits: Math.min(decimalLength, maxDigits),
    maximumFractionDigits: maxDigits,
    useGrouping: true,
  };
  const formatter = new Intl.NumberFormat("pt-BR", options);
  let formatted = formatter.format(numericValue * (isNegative ? -1 : 1));

  if (endsWithComma && !formatted.includes(",")) {
    return formatted + ",";
  }

  return formatted;
};

export default function ModalEditarConsumo({
  abrirModalEditarConsumo,
  setAbrirModalEditarConsumo,
  fetchEstoque,
  fetchVolumePilhaGeral,
  rowConsumo,
}) {
  const [loading, setLoading] = useState(false);
  const [diaEstoque, setDiaEstoque] = useState("");
  const [formRowData, setFormRowData] = useState({
    id: "",
    dia: "",
    tcld_ep: "",
    tcld_eneva: "",
    rodoviario_ep: "",
    rodoviario_eneva: "",
    emprestimo_ep: "",
    emprestimo_eneva: "",
    ajuste_ep: "",
    ajuste_eneva: "",
    consumo_ug1: "",
    consumo_ug2: "",
    consumo_ug3: "",
    comentario: "",
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setAbrirModalEditarConsumo(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name !== "data" && name !== "comentario") {
      setFormRowData((prevData) => ({
        ...prevData,
        [name]: prepararNumero(value),
      }));
    } else {
      setFormRowData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let id = formRowData.id;

    if (!id) {
      setNotify({
        open: true,
        message: "ID não localizado",
        severity: "info",
      });
      return;
    }

    if (!formRowData.dia) {
      setNotify({
        open: true,
        message: "Data obrigatória",
        severity: "info",
      });
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/estoque/consumo`, {
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
          fetchEstoque();
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
    if (!rowConsumo) return;
    setDiaEstoque(rowConsumo.data);
    setLoading(false);
    setFormRowData({
      id: rowConsumo.id,
      dia: formatarDataParaInput(rowConsumo.data),
      tcld_ep: rowConsumo.tcldEp,
      tcld_eneva: rowConsumo.tcldEneva,
      rodoviario_ep: rowConsumo.tmutEp,
      rodoviario_eneva: rowConsumo.tmutEneva,
      emprestimo_ep: rowConsumo.emprestimoEP,
      emprestimo_eneva: rowConsumo.emprestimoEneva,
      ajuste_ep: rowConsumo.ajusteEp,
      ajuste_eneva: rowConsumo.ajusteEneva,
      consumo_ug1: rowConsumo.consUg1,
      consumo_ug2: rowConsumo.consUg2,
      consumo_ug3: rowConsumo.consUg3,
      comentario: rowConsumo.comentario,
    });
  }, [rowConsumo]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog open={abrirModalEditarConsumo} onClose={handleClose} fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <DialogTitle>Editar dia {diaEstoque}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={1}>
              <TextField
                required
                margin="dense"
                name="consumo_ug1"
                label="Consumo UG1"
                fullWidth
                variant="outlined"
                value={formRowData.consumo_ug1}
                onChange={handleChange}
              />
              <TextField
                required
                margin="dense"
                name="consumo_ug2"
                label="Consumo UG2"
                fullWidth
                variant="outlined"
                value={formRowData.consumo_ug2}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                required
                size="small"
                margin="dense"
                name="ajuste_ep"
                label="Ajuste EP"
                variant="outlined"
                value={formRowData.ajuste_ep}
                onChange={handleChange}
              />
              <TextField
                required
                size="small"
                margin="dense"
                name="tcld_ep"
                label="TCLD EP"
                variant="outlined"
                value={formRowData.tcld_ep}
                onChange={handleChange}
              />
              <TextField
                required
                size="small"
                margin="dense"
                name="rodoviario_ep"
                label="Rodoviario EP"
                variant="outlined"
                value={formRowData.rodoviario_ep}
                onChange={handleChange}
              />
              <TextField
                required
                size="small"
                margin="dense"
                name="emprestimo_ep"
                label="Emprestimo EP"
                variant="outlined"
                value={formRowData.emprestimo_ep}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                required
                margin="dense"
                name="consumo_ug3"
                label="Consumo UG3"
                fullWidth
                variant="outlined"
                value={formRowData.consumo_ug3}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                required
                size="small"
                margin="dense"
                name="ajuste_eneva"
                label="Ajuste ENEVA"
                variant="outlined"
                value={formRowData.ajuste_eneva}
                onChange={handleChange}
              />
              <TextField
                required
                size="small"
                margin="dense"
                name="tcld_eneva"
                label="TCLD ENEVA"
                variant="outlined"
                value={formRowData.tcld_eneva}
                onChange={handleChange}
              />
              <TextField
                required
                size="small"
                margin="dense"
                name="rodoviario_eneva"
                label="Rodoviario ENEVA"
                variant="outlined"
                value={formRowData.rodoviario_eneva}
                onChange={handleChange}
              />
              <TextField
                required
                size="small"
                margin="dense"
                name="emprestimo_eneva"
                label="Emprestimo ENEVA"
                variant="outlined"
                value={formRowData.emprestimo_eneva}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                margin="dense"
                name="comentario"
                label="Comentário"
                multiline
                minRows={2}
                fullWidth
                variant="outlined"
                value={formRowData.comentario}
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
