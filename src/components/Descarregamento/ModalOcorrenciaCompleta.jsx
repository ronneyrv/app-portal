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
} from "@mui/material";

export default function ModalOcorrenciaCompleta({
  navio,
  abrirModal,
  setAbrirModal,
  fetchPier,
}) {
  const [loading, setLoading] = useState(false);
  const [listaDados, setListaDados] = useState({});
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [form, setForm] = useState({
    navio: "",
    cliente: "",
    inicio: "",
    fim: "",
    ocorrencia: "",
    resumo: "",
    sistema: "",
    subsistema: "",
    classificacao: "",
    especialidade: "",
    tipo_desligamento: "",
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const dadosSelects = [
    "DESCARREGAMENTO",
    "CHUVA",
    "ARQUEAÇÃO",
    "ATRACAÇÃO/DESATRACAÇÃO",
    "MUDANÇA DE PORÃO",
    "RECHEGO",
    "TROCA DE TURNO",
    "MOVIMENTAÇÃO NO PORÃO",
    "ABASTECIMENTO",
    "AG. ABERTURA DE PORÃO",
    "AG. PRATICAGEM",
    "AJUSTE ELÉTRICO",
    "AJUSTE MECÂNICO",
    "ATUAÇÃO DETECTOR DE METAIS",
    "MANUTENÇÃO EM OCIOSIDADE",
    "FALHA DE COMUNICAÇÃO",
    "FALHA ELÉTRICA",
    "FALHA MECÂNICA",
    "FALHA NA CORREIA",
    "FALHA NA TEMPERATURA",
    "FALHA NO SENSOR",
    "FALHA NO SISTEMA DE LUBRIFICAÇÃO",
    "FALHA NO SISTEMA HIDRÁULICO",
    "FALTA DE ENERGIA",
    "INSPEÇÃO",
    "INTERFERÊNCIA EM POSICIONAMENTO",
    "INVENTÁRIO PÁTIO DE CARVÃO",
    "LIMPEZA DO SISTEMA",
    "OCIOSIDADE",
    "OUTROS",
    "PARADA PARA RETOMA",
    "PROCEDIMENTOS OPERACIONAIS",
    "RETIRADA DE CONTAMINANTE",
    "SENSOR ATUADO",
    "SERVIÇOS DE REVITALIZAÇÃO",
    "INVERSÃO DE PÁTIO",
    "EMERGÊNCIA ACIONADA",
  ];

  const initialState = {
    inicio: "",
    fim: "",
    ocorrencia: "",
    resumo: "",
    sistema: "",
    subsistema: "",
    classificacao: "",
    especialidade: "",
    tipo_desligamento: "",
  };

  const handleClose = () => {
    setAbrirModal(false);
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

  function formatarDataParaInput(dataString) {
    const data = new Date(dataString);

    const ano = data.getUTCFullYear().toString();
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, "0");
    const dia = data.getUTCDate().toString().padStart(2, "0");
    const horas = data.getUTCHours().toString().padStart(2, "0");
    const minutos = data.getUTCMinutes().toString().padStart(2, "0");

    return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    fetch(`${API_URL}/descarregamento/adicionar/ocorrencia`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ dados: form }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setLoading(false);
          fetchPier();
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
          handleClose();
          setForm(initialState);
        } else {
          setLoading(false);
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  const fetchLista = () => {
    fetch(`${API_URL}/descarregamento/lista/ocorrencia`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setListaDados(data.data);
        } else {
          console.error("Erro ao buscar lista");
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  const fetchOcorrencia = () => {
    fetch(`${API_URL}/descarregamento/ultima/ocorrencia/${navio}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          const dataInicio = formatarDataParaInput(data.data.fim);
          setForm((prevForm) => ({
            ...prevForm,
            navio: data.data.navio,
            cliente: data.data.cliente,
            inicio: dataInicio,
          }));
        } else {
          console.error("Erro ao buscar lista");
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchLista();
    fetchOcorrencia();
  }, []);

  useEffect(() => {
    fetchOcorrencia();
  }, [abrirModal]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 350,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog open={abrirModal} onClose={handleClose} fullWidth>
        <DialogTitle>
          {form.navio} - {form.cliente}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                required
                margin="dense"
                id="inicio"
                name="inicio"
                label="Início"
                type="datetime-local"
                fullWidth
                variant="outlined"
                value={form.inicio}
                disabled
              />
              <TextField
                required
                margin="dense"
                id="fim"
                name="fim"
                label="Fim"
                type="datetime-local"
                fullWidth
                variant="outlined"
                value={form.fim}
                onChange={(e) => handleChange(e, "fim")}
                autoFocus
              />
            </Box>
            <TextField
              required
              margin="dense"
              id="ocorrencia"
              name="ocorrencia"
              label="Ocorrência"
              multiline
              minRows={3}
              fullWidth
              variant="outlined"
              value={form.ocorrencia}
              onChange={(e) => handleChange(e, "ocorrencia")}
            />
            <TextField
              required
              select
              margin="dense"
              id="resumo"
              name="resumo"
              label="Resumo"
              fullWidth
              variant="outlined"
              value={form.resumo}
              onChange={(e) => handleChange(e, "resumo")}
            >
              {dadosSelects.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                required
                select
                margin="dense"
                id="sistema"
                name="sistema"
                label="Sistema"
                fullWidth
                variant="outlined"
                value={form.sistema}
                onChange={(e) => handleChange(e, "sistema")}
                disabled={!form.resumo}
              >
                {form.resumo &&
                  listaDados[form.resumo]?.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
              </TextField>
              <TextField
                required
                select
                margin="dense"
                id="subsistema"
                name="subsistema"
                label="Subsistema"
                fullWidth
                variant="outlined"
                value={form.subsistema}
                onChange={(e) => handleChange(e, "subsistema")}
                disabled={!form.sistema}
              >
                {form.sistema &&
                  listaDados[form.sistema]?.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                required
                select
                margin="dense"
                id="classificacao"
                name="classificacao"
                label="Classificação"
                fullWidth
                variant="outlined"
                value={form.classificacao}
                onChange={(e) => handleChange(e, "classificacao")}
                disabled={!form.subsistema}
              >
                {form.subsistema &&
                  listaDados[form.subsistema]?.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
              </TextField>
              <TextField
                required
                select
                margin="dense"
                id="especialidade"
                name="especialidade"
                label="Especialidade"
                fullWidth
                variant="outlined"
                value={form.especialidade}
                onChange={(e) => handleChange(e, "especialidade")}
                disabled={!form.classificacao}
              >
                {form.classificacao &&
                  listaDados[form.classificacao]?.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>
            <TextField
              required
              select
              margin="dense"
              id="tipo_desligamento"
              name="tipo_desligamento"
              label="Tipo"
              fullWidth
              variant="outlined"
              value={form.tipo_desligamento}
              onChange={(e) => handleChange(e, "tipo_desligamento")}
              disabled={!form.especialidade}
              sx={{ flex: 6 }}
            >
              {form.especialidade &&
                listaDados[form.especialidade]?.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
            </TextField>
            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Cancelar
              </Button>
              <Button type="submit" variant="contained">
                Salvar
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
