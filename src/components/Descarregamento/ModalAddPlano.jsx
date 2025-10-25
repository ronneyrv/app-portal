import { useEffect, useState } from "react";
import NotifyBar from "../NotifyBar";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
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
} from "@mui/material";

export default function ModalAddPlano({
  abrirModalPlano,
  setAbrirModalPlano,
  setTemPlano,
  fetchPier,
  dados,
}) {
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [form, setForm] = useState({
    navio: "",
    meta: 0,
    atracacao: null,
    arqueacao_inicial: null,
    previsao: null,
    dias: [{ dia: "", planejado: "", realizado: "" }],
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const stateInicial = () => {
    const dataAtracacao = formatarDataParaInput(dados.atracacao);
    setForm((prevForm) => ({
      ...prevForm,
      navio: dados.navio,
      atracacao: dataAtracacao,
      meta: 0,
      prancha: null,
      arqueacao_inicial: dados.arqueacao_inicial,
      saldo: dados.arqueacao_inicial,
      dias: [{ dia: dataAtracacao, planejado: "", realizado: "" }],
    }));
  };

  const formatarDataParaInput = (dataString) => {
    const data = new Date(dataString);
    const ano = data.getUTCFullYear().toString();
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, "0");
    const dia = data.getUTCDate().toString().padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };

  const formatarDataParaExibicao = (dataString) => {
    if (!dataString) {
      return "-";
    }
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const formatarNumero = (valor) => {
    const cleanedValue = valor.replace(/[^0-9,]/g, "");
    const parts = cleanedValue.split(",");
    let newValue = "";

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
        return formatted.split(",")[0] + ",";
      }
      return formatted;
    }
    return cleanedValue;
  };

  const adicionarUmDia = (dataString) => {
    const [ano, mes, dia] = dataString.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);
    data.setDate(data.getDate() + 1);
    const novoAno = data.getFullYear();
    const novoMes = (data.getMonth() + 1).toString().padStart(2, "0");
    const novoDia = data.getDate().toString().padStart(2, "0");
    return `${novoAno}-${novoMes}-${novoDia}`;
  };

  const calcularSomatorioPlanejado = (dias) => {
    return dias.reduce((total, item) => {
      const valorPlanejado = parseFloat(
        item.planejado.replace(/\./g, "").replace(",", ".")
      );
      return total + (isNaN(valorPlanejado) ? 0 : valorPlanejado);
    }, 0);
  };

  const handleClose = () => {
    setAbrirModalPlano(false);
    stateInicial();
  };

  const handleAdicionarDia = () => {
    const ultimaData =
      form.dias.length > 0
        ? form.dias[form.dias.length - 1].dia
        : form.atracacao;

    const novaData = adicionarUmDia(ultimaData);
    const novosDias = [
      ...form.dias,
      {
        dia: novaData,
        planejado: "",
        realizado: "",
      },
    ];
    setForm({ ...form, dias: novosDias });
  };

  const handleRemoverUltimoDia = () => {
    if (form.dias.length > 1) {
      const novosDias = [...form.dias];
      novosDias.pop();
      setForm({ ...form, dias: novosDias });
    }
  };

  const handleChangeDias = (e, index, campo) => {
    const { value } = e.target;
    let newValue = value;

    if (campo === "planejado" || campo === "realizado") {
      newValue = formatarNumero(value);
    }

    const novosDias = [...form.dias];
    novosDias[index][campo] = newValue;

    let novoSaldo = form.saldo;
    if (campo === "planejado") {
      const somatorio = calcularSomatorioPlanejado(novosDias);
      novoSaldo = form.arqueacao_inicial - somatorio;
    }

    setForm((prevForm) => ({
      ...prevForm,
      dias: novosDias,
      saldo: novoSaldo,
    }));
  };

  const handleChangePrincipal = (e) => {
    const { name, value } = e.target;
    let newMeta = form.meta;

    if (name === "prancha") {
      const valorLimpoParaCalculo = value.replace(/\./g, "").replace(",", ".");
      const pranchaNumerica = parseFloat(valorLimpoParaCalculo);
      const arqueacaoNumerica = parseFloat(
        form.arqueacao_inicial.toString().replace(",", ".")
      );

      let newMeta = 0;
      if (
        !isNaN(arqueacaoNumerica) &&
        !isNaN(pranchaNumerica) &&
        pranchaNumerica > 0
      ) {
        newMeta = parseFloat((arqueacaoNumerica / pranchaNumerica).toFixed(2));
      }

      const dataInicial = new Date(dados.atracacao);

      if (!isNaN(dataInicial.getTime())) {
        const diasEmMilissegundos = Math.floor(newMeta) * 24 * 60 * 60 * 1000;
        const horasEmMilissegundos =
          (newMeta - Math.floor(newMeta)) * 24 * 60 * 60 * 1000;

        const previsaoData = new Date(
          dataInicial.getTime() + diasEmMilissegundos + horasEmMilissegundos
        );

        const ano = previsaoData.getFullYear();
        const mes = String(previsaoData.getMonth() + 1).padStart(2, "0");
        const dia = String(previsaoData.getDate()).padStart(2, "0");

        const previsaoFormatada = `${ano}-${mes}-${dia}`;

        const valorFormatadoParaExibicao = formatarNumero(value);
        setForm((prevForm) => ({
          ...prevForm,
          [name]: valorFormatadoParaExibicao,
          meta: newMeta.toFixed(2), 
          previsao: previsaoFormatada, 
        }));
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          meta: newMeta.toFixed(2),
          previsao: null,
        }));
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const ultimoDia = null;

    if (form.saldo !== 0) {
      setNotify({
        open: true,
        message: "O Saldo precisa ser zerado!",
        severity: "error",
      });
      return;
    }

    if (form.meta === "0.00") {
      setNotify({
        open: true,
        message: "Prancha Média invalida!",
        severity: "error",
      });
      return;
    }

    const dadosParaEnviar = form.dias.map((item) => ({
      navio: form.navio,
      data: item.dia,
      planejado: item.planejado,
      realizado: item.realizado,
    }));
    
    const ultimoDiaObjeto = form.dias[form.dias.length - 1];

    if (form.previsao !== ultimoDiaObjeto.dia) {
      setNotify({
        open: true,
        message: `O plano deve finalizar em: ${formatarDataParaExibicao(form.previsao)}`,
        severity: "info",
      });
      return;
    }
    
    setLoading(true);
    fetch(`${API_URL}/descarregamento/adicionar/plano/descarga`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ dados: dadosParaEnviar }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setTemPlano(true);
          fetch(`${API_URL}/descarregamento/meta`, {
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
    stateInicial();
  }, [dados]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog open={abrirModalPlano} onClose={handleClose} fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {form.navio}, atracado em{" "}
              {formatarDataParaExibicao(form.atracacao)}
              <br />
              Arqueação: {form.arqueacao_inicial}t, previsão final: {formatarDataParaExibicao(form.previsao)}
            </DialogTitle>
            <Box display="flex" gap={1}>
              <TextField
                disabled
                margin="dense"
                id="saldo"
                name="saldo"
                label="Saldo à Planejar"
                fullWidth
                variant="outlined"
                value={form.saldo}
              />
              <TextField
                required
                autoFocus
                margin="dense"
                id="prancha"
                name="prancha"
                label="Prancha Média Diária (t/d)"
                fullWidth
                variant="outlined"
                value={form.prancha}
                onChange={(e) => handleChangePrincipal(e)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <TextField
                disabled
                margin="dense"
                id="meta"
                name="meta"
                label="Meta"
                variant="outlined"
                value={form.meta}
                sx={{ width: "250px" }}
              />
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                gap={0}
              >
                <AddCircleOutlineIcon
                  color="primary"
                  sx={{ cursor: "pointer", fontSize: 30 }}
                  onClick={handleAdicionarDia}
                />
                {form.dias.length > 1 && (
                  <RemoveCircleOutlineIcon
                    color="primary"
                    sx={{ cursor: "pointer", fontSize: 30 }}
                    onClick={handleRemoverUltimoDia}
                  />
                )}
              </Box>
            </Box>
            <Divider sx={{ my: 3 }} />
            {form.dias.map((item, index) => (
              <Box
                key={index}
                display="flex"
                gap={1}
                alignItems="center"
                mt={1}
              >
                <TextField
                  required
                  margin="dense"
                  label="Data"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={item.dia}
                  onChange={(e) => handleChangeDias(e, index, "dia")}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  label="Planejado"
                  fullWidth
                  variant="outlined"
                  value={item.planejado}
                  onChange={(e) => handleChangeDias(e, index, "planejado")}
                />
                <TextField
                  disabled
                  margin="dense"
                  label="Realizado"
                  fullWidth
                  variant="outlined"
                  value={item.realizado}
                  onChange={(e) => handleChangeDias(e, index, "realizado")}
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
