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
} from "@mui/material";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export default function ModalOcorrenciaSimples({
  id,
  abrir,
  setAbrir,
  fetchTabela,
  fetchPier,
}) {
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [form, setForm] = useState({
    id: 0,
    ocorrencia: "",
    resumo: "",
    sistema: "",
    subsistema: "",
    classificacao: "",
    especialidade: "",
    tipo_desligamento: "",
  });

  const handleClose = () => {
    setAbrir(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const idOcorrencia = form.id;
    setLoading(true);

    fetch(
      `http://172.20.229.55:3000/descarregamento/ocorrencia/simples/${idOcorrencia}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ dados: form }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setLoading(false);
          fetchTabela();
          fetchPier();

          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
          handleClose();
        } else {
          console.error("Erro ao buscar navio atracado");
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

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://172.20.229.55:3000/descarregamento/ocorrencia/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setForm(data.data[0]);
          setLoading(false);
        } else {
          console.error("Erro ao buscar navio atracado");
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  }, [id]);

  return (
    <div>
      {loading ? <LoadingSpinner /> : null}
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog open={abrir} onClose={handleClose} fullWidth>
        <DialogTitle>Editar Ocorrência</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
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
              onChange={handleChange}
            />
            <Box display="flex" gap={2} mt={2}>
              <TextField
                required
                select
                margin="dense"
                name="resumo"
                label="Resumo"
                fullWidth
                variant="outlined"
                value={form.resumo}
                onChange={handleChange}
                sx={{ flex: 7 }}
              >
                <MenuItem value="ABASTECIMENTO">ABASTECIMENTO</MenuItem>
                <MenuItem value="AG. ABERTURA DE PORÃO">
                  AG. ABERTURA DE PORÃO
                </MenuItem>
                <MenuItem value="AG. PRATICAGEM">AG. PRATICAGEM</MenuItem>
                <MenuItem value="AJUSTE ELÉTRICO">AJUSTE ELÉTRICO</MenuItem>
                <MenuItem value="AJUSTE MECÂNICO">AJUSTE MECÂNICO</MenuItem>
                <MenuItem value="ARQUEAÇÃO">ARQUEAÇÃO</MenuItem>
                <MenuItem value="DESCARREGANDO">DESCARREGANDO</MenuItem>
                <MenuItem value="ATRACAÇÃO/DESATRACAÇÃO">
                  ATRACAÇÃO/DESATRACAÇÃO
                </MenuItem>
                <MenuItem value="ATUAÇÃO DETECTOR DE METAIS">
                  ATUAÇÃO DETECTOR DE METAIS
                </MenuItem>
                <MenuItem value="CHUVA">CHUVA</MenuItem>
                <MenuItem value="EMERGÊNCIA ACIONADA">
                  EMERGÊNCIA ACIONADA
                </MenuItem>
                <MenuItem value="FALHA DE COMUNICAÇÃO">
                  FALHA DE COMUNICAÇÃO
                </MenuItem>
                <MenuItem value="FALHA ELÉTRICA ">FALHA ELÉTRICA </MenuItem>
                <MenuItem value="FALHA MECÂNICA">FALHA MECÂNICA</MenuItem>
                <MenuItem value="FALHA NA CORREIA">FALHA NA CORREIA</MenuItem>
                <MenuItem value="FALHA NA TEMPERATURA">
                  FALHA NA TEMPERATURA
                </MenuItem>
                <MenuItem value="FALHA SISTEMA DE LUBRIFICAÇÃO">
                  FALHA SISTEMA DE LUBRIFICAÇÃO
                </MenuItem>
                <MenuItem value="FALHA SISTEMA HIDRÁULICO">
                  FALHA SISTEMA HIDRÁULICO
                </MenuItem>
                <MenuItem value="FALHA NO SENSOR">FALHA NO SENSOR</MenuItem>
                <MenuItem value="SENSOR ACIONADO">SENSOR ACIONADO</MenuItem>
                <MenuItem value="FALTA DE ENERGIA">FALTA DE ENERGIA</MenuItem>
                <MenuItem value="INSPEÇÃO">INSPEÇÃO</MenuItem>
                <MenuItem value="INTERFERÊNCIA EM POSICIONAMENTO">
                  INTERFERÊNCIA EM POSICIONAMENTO
                </MenuItem>
                <MenuItem value="INVENTÁRIO PÁTIO DE CARVÃO">
                  INVENTÁRIO PÁTIO DE CARVÃO
                </MenuItem>
                <MenuItem value="INVERSÃO DE PÁTIO">INVERSÃO DE PÁTIO</MenuItem>
                <MenuItem value="LIMPEZA DO SISTEMA">
                  LIMPEZA DO SISTEMA
                </MenuItem>
                <MenuItem value="MOVIMENTAÇÃO NO PORÃO">
                  MOVIMENTAÇÃO NO PORÃO
                </MenuItem>
                <MenuItem value="MUDANÇA DE PORÃO ">MUDANÇA DE PORÃO </MenuItem>
                <MenuItem value="OCIOSIDADE">OCIOSIDADE</MenuItem>
                <MenuItem value="MANUTENÇÃO EM OCIOSIDADE">
                  MANUTENÇÃO EM OCIOSIDADE
                </MenuItem>
                <MenuItem value="OUTROS">OUTROS</MenuItem>
                <MenuItem value="PARADA PARA RETOMA">
                  PARADA PARA RETOMA
                </MenuItem>
                <MenuItem value="PROCEDIMENTOS OPERACIONAIS">
                  PROCEDIMENTOS OPERACIONAIS
                </MenuItem>
                <MenuItem value="RETIRADA DE CONTAMINANTE">
                  RETIRADA DE CONTAMINANTE
                </MenuItem>
                <MenuItem value="RECHEGO">RECHEGO</MenuItem>
                <MenuItem value="SOBRECARGA">SOBRECARGA</MenuItem>
                <MenuItem value="SERVIÇO DE REVITALIZAÇÃO">
                  SERVIÇO DE REVITALIZAÇÃO
                </MenuItem>
                <MenuItem value="TROCA DE TURNO">TROCA DE TURNO</MenuItem>
              </TextField>
              <TextField
                required
                select
                margin="dense"
                name="tipo_desligamento"
                label="Tipo"
                fullWidth
                variant="outlined"
                value={form.tipo_desligamento}
                onChange={handleChange}
                sx={{ flex: 5 }}
              >
                <MenuItem value="PROGRAMADO">PROGRAMADO</MenuItem>
                <MenuItem value="NÃO PROGRAMADO">NÃO PROGRAMADO</MenuItem>
              </TextField>
            </Box>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                required
                select
                margin="dense"
                name="sistema"
                label="Sistema"
                fullWidth
                variant="outlined"
                value={form.sistema}
                onChange={handleChange}
                sx={{ flex: 6 }}
              >
                <MenuItem value="CSU">CSU</MenuItem>
                <MenuItem value="MHC">MHC</MenuItem>
                <MenuItem value="CSU/MHC">CSU/MHC</MenuItem>
                <MenuItem value="MOEGA">MOEGA</MenuItem>
                <MenuItem value="NAVIO">NAVIO</MenuItem>
                <MenuItem value="PORTO">PORTO</MenuItem>
                <MenuItem value="TCLD - GOVERNO">TCLD - GOVERNO</MenuItem>
                <MenuItem value="TCLD - TÉRMICAS">TCLD - TÉRMICAS</MenuItem>
                <MenuItem value="PÁTIO AMP">PÁTIO AMP</MenuItem>
                <MenuItem value="PÁTIO TÉRMICAS">PÁTIO TÉRMICAS</MenuItem>
                <MenuItem value="OCIOSIDADE">OCIOSIDADE</MenuItem>
              </TextField>

              <TextField
                required
                select
                margin="dense"
                name="subsistema"
                label="Subsistema"
                fullWidth
                variant="outlined"
                value={form.subsistema}
                onChange={handleChange}
                sx={{ flex: 6 }}
              >
                <MenuItem value="N/A">N/A</MenuItem>
                <MenuItem value="ALIMENTADOR HORIZONTAL">
                  ALIMENTADOR HORIZONTAL
                </MenuItem>
                <MenuItem value="SISTEMA HIDRÁULICO">
                  SISTEMA HIDRÁULICO
                </MenuItem>
                <MenuItem value="TRANSPORTADOR DA LANÇA">
                  TRANSPORTADOR DA LANÇA
                </MenuItem>
                <MenuItem value="MESA DE GIRO">MESA DE GIRO</MenuItem>
                <MenuItem value="EXTRATOR DE METAIS">
                  EXTRATOR DE METAIS
                </MenuItem>
                <MenuItem value="MOEGA">MOEGA</MenuItem>
                <MenuItem value="INLET FEEDER">INLET FEEDER</MenuItem>
                <MenuItem value="FUSO HORIZONTAL">FUSO HORIZONTAL</MenuItem>
                <MenuItem value="FUSO VERTICAL">FUSO VERTICAL</MenuItem>
                <MenuItem value="ENROLADOR CABO">ENROLADOR CABO</MenuItem>
                <MenuItem value="CONTROLE REMOTO">CONTROLE REMOTO</MenuItem>
                <MenuItem value="CHUTE">CHUTE</MenuItem>
                <MenuItem value="SILO">SILO</MenuItem>
                <MenuItem value="PÓRTICO">PÓRTICO</MenuItem>
                <MenuItem value="GANTURY">GANTURY</MenuItem>
                <MenuItem value="GRAB">GRAB</MenuItem>
                <MenuItem value="SALA DE CONTROLE">SALA DE CONTROLE</MenuItem>
                <MenuItem value="SALA ELÉTRICA 42">SALA ELÉTRICA 42</MenuItem>
                <MenuItem value="SALA ELÉTRICA 46">SALA ELÉTRICA 46</MenuItem>
                <MenuItem value="SALA ELÉTRICA CSU">SALA ELÉTRICA CSU</MenuItem>
                <MenuItem value="TC01">TC01</MenuItem>
                <MenuItem value="TC02">TC02</MenuItem>
                <MenuItem value="TC03">TC03</MenuItem>
                <MenuItem value="TC04">TC04</MenuItem>
                <MenuItem value="TC05">TC05</MenuItem>
                <MenuItem value="TC06">TC06</MenuItem>
                <MenuItem value="TC07">TC07</MenuItem>
                <MenuItem value="TT01">TT01</MenuItem>
                <MenuItem value="TT02">TT02</MenuItem>
                <MenuItem value="TT03">TT03</MenuItem>
                <MenuItem value="TT04">TT04</MenuItem>
                <MenuItem value="TT05">TT05</MenuItem>
                <MenuItem value="TT06">TT06</MenuItem>
                <MenuItem value="TT07">TT07</MenuItem>
                <MenuItem value="TT21">TT21</MenuItem>
                <MenuItem value="TT22">TT22</MenuItem>
                <MenuItem value="TT23">TT23</MenuItem>
                <MenuItem value="TT25">TT25</MenuItem>
                <MenuItem value="EAC13">EAC13</MenuItem>
                <MenuItem value="EAC31">EAC13</MenuItem>
                <MenuItem value="EAC33">EAC33</MenuItem>
                <MenuItem value="STACKER 1">STACKER 1</MenuItem>
                <MenuItem value="STACKER 2">STACKER 2</MenuItem>
                <MenuItem value="OUTROS - SUBSISTEMAS">
                  OUTROS - SUBSISTEMAS
                </MenuItem>
              </TextField>
            </Box>
            <Box display="flex" gap={2} mt={2} mb={2}>
              <TextField
                required
                select
                margin="dense"
                name="classificacao"
                label="Classificação"
                fullWidth
                variant="outlined"
                value={form.classificacao}
                onChange={handleChange}
                sx={{ flex: 6 }}
              >
                <MenuItem value="CONDIÇÃO CLIMÁTICA">
                  CONDIÇÃO CLIMÁTICA
                </MenuItem>
                <MenuItem value="DESCARREGANDO">DESCARREGANDO</MenuItem>
                <MenuItem value="MANUTENÇÃO CORRETIVA">
                  MANUTENÇÃO CORRETIVA
                </MenuItem>
                <MenuItem value="MANUTENÇÃO PREVENTIVA">
                  MANUTENÇÃO PREVENTIVA
                </MenuItem>
                <MenuItem value="OCIOSIDADE">OCIOSIDADE</MenuItem>
                <MenuItem value="PARADA ENGENHARIA">PARADA ENGENHARIA</MenuItem>
                <MenuItem value="PARADA OPERACIONAL">
                  PARADA OPERACIONAL
                </MenuItem>
              </TextField>

              <TextField
                required
                select
                margin="dense"
                name="especialidade"
                label="Especialidade"
                fullWidth
                variant="outlined"
                value={form.especialidade}
                onChange={handleChange}
                sx={{ flex: 6 }}
              >
                <MenuItem value="MAN MECÂNICA">MAN MECÂNICA</MenuItem>
                <MenuItem value="MAN ELÉTRICA">MAN ELÉTRICA</MenuItem>
                <MenuItem value="OPERAÇÃO">OPERAÇÃO</MenuItem>
              </TextField>
            </Box>
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
