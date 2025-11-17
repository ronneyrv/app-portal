import { useEffect, useState } from "react";
import NotifyBar from "../NotifyBar";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";

export default function ModalConsolidado({
  rowEdit3,
  fetchTabelaGeral,
  abrirModalConsolidado,
  setAbrirModalConsolidado,
}) {
  const [loading, setLoading] = useState(false);
  const [consolidado, setConsolidado] = useState([]);
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const idNavio = rowEdit3.navio;

  const [form, setForm] = useState({
    navio: "",
    cliente: "",
    carvao_tipo: "",
    sistema: "",
    nor: "",
    atracacao: "",
    desatracacao: "",
    inicio_operacao: "",
    fim_operacao: "",
    dias_operando: "",
    dias_atracado: "",
    dias_base_75k: "",
    carga: "",
    produtividade: "",
    dias_de_demurrage: "",
    valor_demurrage_USD: "",
    demurrage_ou_despatch_aproximado: "",
    taxa_comercial: "",
    taxa_efetiva: "",
    meta: "",
    observacao: "",
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const initialState = {
    navio: "",
    cliente: "",
    carvao_tipo: "",
    sistema: "",
    nor: "",
    atracacao: "",
    desatracacao: "",
    inicio_operacao: "",
    fim_operacao: "",
    dias_operando: "",
    dias_atracado: "",
    dias_base_75k: "",
    carga: "",
    produtividade: "",
    dias_de_demurrage: "",
    valor_demurrage_USD: "",
    demurrage_ou_despatch_aproximado: "",
    taxa_comercial: "",
    taxa_efetiva: "",
    meta: "",
    observacao: "",
  };

  const formatarDataParaInput = (dataString) => {
    const data = new Date(dataString);

    const ano = data.getUTCFullYear().toString();
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, "0");
    const dia = data.getUTCDate().toString().padStart(2, "0");
    const horas = data.getUTCHours().toString().padStart(2, "0");
    const minutos = data.getUTCMinutes().toString().padStart(2, "0");

    return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  };

  const handleClose = () => {
    setAbrirModalConsolidado(false);
  };

  const handleChange = (e, selectName) => {
    const { value } = e.target;
    let newForm = { ...form, [selectName]: value };

    if (selectName === "resumo") {
      newForm = {
        ...newForm,
        sistema: "",
        subsistema: "",
        classificacao: "",
        especialidade: "",
        tipo_desligamento: "",
      };
    } else if (selectName === "sistema") {
      newForm = {
        ...newForm,
        subsistema: "",
        classificacao: "",
        especialidade: "",
        tipo_desligamento: "",
      };
    } else if (selectName === "subsistema") {
      newForm = {
        ...newForm,
        classificacao: "",
        especialidade: "",
        tipo_desligamento: "",
      };
    } else if (selectName === "classificacao") {
      newForm = { ...newForm, especialidade: "", tipo_desligamento: "" };
    } else if (selectName === "especialidade") {
      newForm = { ...newForm, tipo_desligamento: "" };
    }
    setForm(newForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    fetch(`${API_URL}/descarregamento/atualizar/ocorrencia`, {
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
          fetchTabelaGeral();
          handleClose();
          setForm(initialState);
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

    setForm({
      navio: consolidado.navio,
      cliente: consolidado.cliente,
      carvao_tipo: consolidado.carvao_tipo,
      sistema: consolidado.sistema,
      nor: formatarDataParaInput(consolidado.nor),
      atracacao: formatarDataParaInput(consolidado.atracacao),
      desatracacao: formatarDataParaInput(consolidado.desatracacao),
      inicio_operacao: formatarDataParaInput(consolidado.inicio_operacao),
      fim_operacao: formatarDataParaInput(consolidado.fim_operacao),
      dias_operando: consolidado.dias_operando,
      dias_atracado: consolidado.dias_atracado,
      dias_base_75k: consolidado.dias_base_75k,
      carga: consolidado.carga,
      produtividade: consolidado.produtividade,
      dias_de_demurrage: consolidado.dias_de_demurrage,
      valor_demurrage_USD: consolidado.valor_demurrage_USD,
      demurrage_ou_despatch_aproximado:
        consolidado.demurrage_ou_despatch_aproximado,
      taxa_comercial: consolidado.taxa_comercial,
      taxa_efetiva: consolidado.taxa_efetiva,
      meta: consolidado.meta,
      observacao: consolidado.observacao,
    });
  }, [consolidado]);

  useEffect(() => {
    if (abrirModalConsolidado) {
      fetch(`${API_URL}/descarregamento/consolidado/${idNavio}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.type === "success") {
            setConsolidado(data.data[0]);
          }
        })
        .catch((err) => console.error("Erro de rede:", err));
    }
  }, [abrirModalConsolidado]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog
        open={abrirModalConsolidado}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                required
                margin="dense"
                id="navio"
                name="navio"
                label="NAVIO"
                fullWidth
                sx={{ flex: 3 }}
                variant="outlined"
                value={form.navio}
                onChange={(e) => handleChange(e, "navio")}
              />
              <TextField
                required
                select
                margin="dense"
                id="cliente"
                name="cliente"
                label="CLIENTE"
                fullWidth
                sx={{ flex: 2.5 }}
                variant="outlined"
                value={form.cliente}
                onChange={(e) => handleChange(e, "cliente")}
              >
                <MenuItem value={"ENERGIA PECÉM"}>{"ENERGIA PECÉM"}</MenuItem>
                <MenuItem value={"ENEVA"}>{"ENEVA"}</MenuItem>
                <MenuItem value={"AMP"}>{"AMP"}</MenuItem>
                <MenuItem disabled value={"CSP"}>
                  {"CSP"}
                </MenuItem>
              </TextField>
              <TextField
                required
                select
                margin="dense"
                id="sistema"
                name="sistema"
                label="SISTEMA"
                fullWidth
                sx={{ flex: 2 }}
                variant="outlined"
                value={form.sistema}
                onChange={(e) => handleChange(e, "sistema")}
              >
                <MenuItem value={"CAMINHÃO"}>{"CAMINHÃO"}</MenuItem>
                <MenuItem value={"CORREIA"}>{"CORREIA"}</MenuItem>
              </TextField>
              <TextField
                required
                margin="dense"
                id="carga"
                name="carga"
                label="CARGA"
                fullWidth
                sx={{ flex: 1.5 }}
                variant="outlined"
                value={form.carga}
                onChange={(e) => handleChange(e, "carga")}
              />
              <TextField
                required
                margin="dense"
                id="nor"
                name="nor"
                label="NOR"
                type="datetime-local"
                fullWidth
                sx={{ flex: 3 }}
                variant="outlined"
                value={form.nor}
                onChange={(e) => handleChange(e, "nor")}
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
                label="ATRACAÇÃO"
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
              />
              <TextField
                required
                margin="dense"
                id="inicio_operacao"
                name="inicio_operacao"
                label="INÍCIO DA OPERAÇÃO"
                type="datetime-local"
                fullWidth
                variant="outlined"
                value={form.inicio_operacao}
                onChange={(e) => handleChange(e, "inicio_operacao")}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              <TextField
                required
                margin="dense"
                id="fim_operacao"
                name="fim_operacao"
                label="FIM DA OPERAÇÃO"
                type="datetime-local"
                fullWidth
                variant="outlined"
                value={form.fim_operacao}
                onChange={(e) => handleChange(e, "fim_operacao")}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              <TextField
                required
                margin="dense"
                id="desatracacao"
                name="desatracacao"
                label="DESATRACAÇÃO"
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
                id="meta"
                name="meta"
                label="META (d)"
                fullWidth
                variant="outlined"
                value={form.meta}
                onChange={(e) => handleChange(e, "meta")}
              />
              <TextField
                required
                margin="dense"
                id="dias_atracado"
                name="dias_atracado"
                label="REALIZADO (d)"
                fullWidth
                variant="outlined"
                value={form.dias_atracado}
                onChange={(e) => handleChange(e, "dias_atracado")}
              />
              <TextField
                required
                margin="dense"
                id="dias_operando"
                name="dias_operando"
                label="OPERANDO"
                fullWidth
                variant="outlined"
                value={form.dias_operando}
                onChange={(e) => handleChange(e, "dias_operando")}
              />
              <TextField
                required
                margin="dense"
                id="dias_base_75k"
                name="dias_base_75k"
                label="BASE 75K"
                fullWidth
                variant="outlined"
                value={form.dias_base_75k}
                onChange={(e) => handleChange(e, "dias_base_75k")}
              />
            </Box>

            <Box display="flex" gap={2} mt={2}>
              <TextField
                required
                margin="dense"
                id="taxa_comercial"
                name="taxa_comercial"
                label="TAXA COMERCIAL"
                fullWidth
                variant="outlined"
                value={form.taxa_comercial}
                onChange={(e) => handleChange(e, "taxa_comercial")}
              />
              <TextField
                required
                margin="dense"
                id="taxa_efetiva"
                name="taxa_efetiva"
                label="TAXA EFETIVA"
                fullWidth
                variant="outlined"
                value={form.taxa_efetiva}
                onChange={(e) => handleChange(e, "taxa_efetiva")}
              />
              <TextField
                required
                margin="dense"
                id="produtividade"
                name="produtividade"
                label="PRODUTIVIDADE"
                fullWidth
                variant="outlined"
                value={form.produtividade}
                onChange={(e) => handleChange(e, "produtividade")}
              />
              <TextField
                required
                margin="dense"
                id="carvao_tipo"
                name="carvao_tipo"
                label="PRODUTO"
                fullWidth
                variant="outlined"
                value={form.carvao_tipo}
                onChange={(e) => handleChange(e, "carvao_tipo")}
              />
            </Box>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                required
                margin="dense"
                id="dias_de_demurrage"
                name="dias_de_demurrage"
                label="DEMURRAGE (d)"
                fullWidth
                variant="outlined"
                value={form.dias_de_demurrage}
                onChange={(e) => handleChange(e, "dias_de_demurrage")}
              />
              <TextField
                required
                margin="dense"
                id="valor_demurrage_USD"
                name="valor_demurrage_USD"
                label="VALOR DEMURRAGE (USD)"
                fullWidth
                variant="outlined"
                value={form.valor_demurrage_USD}
                onChange={(e) => handleChange(e, "valor_demurrage_USD")}
              />
              <TextField
                required
                margin="dense"
                id="demurrage_ou_despatch_aproximado"
                name="demurrage_ou_despatch_aproximado"
                label="DEMURRAGE OU DESPATCH (USD)"
                fullWidth
                variant="outlined"
                value={form.demurrage_ou_despatch_aproximado}
                onChange={(e) =>
                  handleChange(e, "demurrage_ou_despatch_aproximado")
                }
              />
            </Box>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                required
                margin="dense"
                id="observacao"
                name="observacao"
                label="OBSERVAÇÃO"
                multiline
                minRows={2}
                fullWidth
                variant="outlined"
                value={form.observacao}
                onChange={(e) => handleChange(e, "observacao")}
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
