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
} from "@mui/material";

const formatarDataParaInput = (data) => {
  if (!data) return "";
  const ano = data.getFullYear();
  const mes = (data.getMonth() + 1).toString().padStart(2, "0");
  const dia = data.getDate().toString().padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

const formatarNumero = (valor) => {
  if (valor === undefined || valor === null || valor === "") {
    return "";
  }
  const cleanedValue = String(valor).replace(/[^\d,]/g, "");
  const [inteiro, decimal] = cleanedValue.split(",");
  const formattedInteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (decimal !== undefined) {
    return `${formattedInteiro},${decimal}`;
  }
  return formattedInteiro;
};

const toNumero = (valor) => {
  if (typeof valor !== "string") {
    return valor;
  }
  const valorLimpo = valor.replace(/\./g, "").replace(",", ".");

  return parseFloat(valorLimpo);
};

export default function ModalAddArqueacao({
  abrirModalArqueacao,
  setAbrirModalArqueacao,
  fetchPier,
  setTemPlano,
  dados,
}) {
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navio = dados.navio;
  const dataHojeFormatada = formatarDataParaInput(new Date());
  const [form, setForm] = useState({
    navio: "",
    data: dataHojeFormatada,
    atracado: "",
    arqueacao: "",
    descarregado: "",
    arqueadoDia: "",
    arqueado: "",
    tipoArqueacao: "",
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;
  const data = form.data;

  const formatarNumeroParaExibicao = (valor) => {
    const valorNumerico = parseFloat(valor).toFixed(2);
    const valorComVirgula = valorNumerico.replace(".", ",");
    const [inteiro, decimal] = valorComVirgula.split(",");
    const parteInteiraFormatada = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${parteInteiraFormatada},${decimal}`;
  };

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    const today = new Date();
    let newDate = new Date(today);

    if (selectedValue === "00") {
      newDate.setDate(today.getDate() - 1);
    }

    setForm((prevForm) => ({
      ...prevForm,
      data: formatarDataParaInput(newDate),
      tipoArqueacao: selectedValue,
    }));
  };

  const handleChangeDate = (e) => {
    const novaData = e.target.value;
    setForm((prevForm) => ({
      ...prevForm,
      data: novaData,
    }));
  };

  const handleChangeValue = (e) => {
    const { value } = e.target;
    const formattedValue = formatarNumero(value);
    setForm((prevForm) => ({
      ...prevForm,
      arqueado: formattedValue,
    }));
  };

  const stateInicial = () => {
    fetch(`${API_URL}/descarregamento/total/arqueado/${navio}?data=${data}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {

        if (data.type === "success") {
          setForm((prevForm) => ({
            ...prevForm,
            navio: navio,
            data: prevForm.data,
            atracado: dados.inicio_op,
            arqueacao: dados.arqueacao_inicial,
            descarregado: data.descarregado,
            arqueadoDia: data.ultimoDia,
          }));
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  const handleClose = () => {
    setAbrirModalArqueacao(false);
    setForm((prevForm) => ({
      ...prevForm,
      tipoArqueacao: "",
      arqueado: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.tipoArqueacao) {
      setNotify({
        open: true,
        message: "Informe qual Arqueação gostaria de inserir",
        severity: "info",
      });
      return;
    }

    if (toNumero(form.arqueado) <= form.descarregado) {
      setNotify({
        open: true,
        message: "A arqueação precisa ser maior que o descarregado",
        severity: "info",
      });
      return;
    }

    if (form.tipoArqueacao === "final") {
      setNotify({
        open: true,
        message: "Necessário revisar e finalizar o navio!",
        severity: "info",
      });
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/descarregamento/arqueacao`, {
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
          fetchPier();
          setTemPlano(true);
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
    if (abrirModalArqueacao) {
      stateInicial();
    }
  }, [abrirModalArqueacao, form.data, navio]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog open={abrirModalArqueacao} onClose={handleClose} fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <DialogTitle>
            {form.navio}
            <br />
            Total descarregado: {formatarNumeroParaExibicao(form.descarregado)}t
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={1}>
              <FormControl>
                <FormLabel id="radio-arqueacao" required>
                  Arqueação:
                </FormLabel>
                <RadioGroup
                  row
                  name="radio-arqueacao"
                  onChange={handleRadioChange}
                  value={form.tipoArqueacao}
                >
                  <FormControlLabel
                    value="00"
                    control={<Radio />}
                    label="De 00:00h"
                  />
                  <FormControlLabel
                    value="intermediaria"
                    control={<Radio />}
                    label="Outra Arqueação"
                  />
                  <FormControlLabel
                    value="final"
                    control={<Radio />}
                    label="Arqueação Final"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                disabled
                margin="dense"
                id="data"
                name="data"
                label="Data"
                type="date"
                fullWidth
                variant="outlined"
                value={form.data}
                onChange={handleChangeDate}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              <TextField
                required
                margin="dense"
                label="Arqueado"
                fullWidth
                variant="outlined"
                value={form.arqueado}
                onChange={handleChangeValue}
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
