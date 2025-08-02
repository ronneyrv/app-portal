import { Paper, Grid } from "@mui/material";
import "./pier1.css";

const arqueacaoFormat = (valor) => {
  if (valor == null) return null;
  return Number(valor)
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const dataFormat = (data) => {
  if (!data) return null;
  const date = new Date(data);
  const pad = (num) => String(num).padStart(2, "0");
  const dia = pad(date.getDate());
  const mes = pad(date.getMonth() + 1);
  const ano = date.getFullYear();
  const horas = pad(date.getHours());
  const minutos = pad(date.getMinutes());
  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
};

function PrevisaoTermino(atracacao, meta) {
  if (!atracacao || !meta) return null;

  const dataAtracacao = new Date(atracacao);
  const dias = Math.floor(meta);
  const horas = (meta - dias) * 24;

  dataAtracacao.setDate(dataAtracacao.getDate() + dias);
  dataAtracacao.setHours(dataAtracacao.getHours() + horas);

  const dia = String(dataAtracacao.getDate()).padStart(2, "0");
  const mes = String(dataAtracacao.getMonth() + 1).padStart(2, "0");
  const ano = dataAtracacao.getFullYear();
  const hora = String(dataAtracacao.getHours()).padStart(2, "0");
  const minuto = String(dataAtracacao.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

function PrevisaoReal(atracacao, saldo, taxa) {
  if (!atracacao || saldo == null || !taxa) return null;

  const dataAtracacao = new Date(atracacao);
  const agora = new Date();

  let diferenca = agora - dataAtracacao;
  if (diferenca < 0) diferenca = 0;

  const diasCorridos = diferenca / (1000 * 60 * 60 * 24);
  const diasRestantes = saldo / (taxa * 24);
  const totalDias = diasCorridos + diasRestantes;
  const previsao = new Date(dataAtracacao);
  const diasInt = Math.floor(totalDias);
  const horasDecimais = totalDias - diasInt;
  const horas = Math.round(horasDecimais * 24);

  previsao.setDate(previsao.getDate() + diasInt);
  previsao.setHours(previsao.getHours() + horas);

  const dia = String(previsao.getDate()).padStart(2, "0");
  const mes = String(previsao.getMonth() + 1).padStart(2, "0");
  const ano = previsao.getFullYear();
  const hora = String(previsao.getHours()).padStart(2, "0");
  const minuto = String(previsao.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
};

export default function Pier1Carvao({ dados }) {
  const infor = dados;

  return (
    <div className="main-pier1">
      <Grid container spacing={2} className="grid">
        <Grid size={6}>
          <span>Navio:</span>
          <Paper className="item">{infor.navio || "BERÇO OCIOSO"}</Paper>
        </Grid>

        <Grid size={3}>
          <span>Cliente:</span>
          <Paper className="item">{infor.cliente || "-"}</Paper>
        </Grid>

        <Grid size={3}>
          <span>Arqueação Inicial:</span>
          <Paper className="item">
            {arqueacaoFormat(infor.arqueacao_inicial) || "-"}
          </Paper>
        </Grid>

        <Grid size={5}>
          <span>Atracação:</span>
          <Paper className="item">{dataFormat(infor.atracacao) || "-"}</Paper>
        </Grid>

        <Grid size={5}>
          <span>Início da Operação:</span>
          <Paper className="item">{dataFormat(infor.inicio_op) || "-"}</Paper>
        </Grid>

        <Grid size={2}>
          <span>Meta (dias):</span>
          <Paper className="item">{infor.meta || "-"}</Paper>
        </Grid>

        <Grid size={6}>
          <span>Previsão de Término pela Meta:</span>
          <Paper className="item">
            {PrevisaoTermino(infor.atracacao, infor.meta) || "-"}
          </Paper>
        </Grid>

        <Grid size={6}>
          <span>Previsão de Término Real:</span>
          <Paper className="item">
            {PrevisaoReal(
              infor.atracacao,
              infor.saldo,
              infor.taxa
            ) || "-"}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
