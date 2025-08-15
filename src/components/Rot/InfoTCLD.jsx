import { useEffect, useState } from "react";
import Relogio from "./GraficRelogio";
import "./infotcld.css";

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
}

export default function InfoTCLD({ dadosJSON, setInfoTcldJson }) {
  const [descarregamento, setDescarregamento] = useState({
    cliente: null,
    navio: null,
    arqueacao_inicial: null,
    atracacao: null,
    inicio_op: null,
    saldo: null,
    previsao_fim_op: null,
    meta: 4,
    dias: 0,
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const arqueacaoFormat = (value) => {
    return value
      ? value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0,00";
  };

  const dataFormat = (data) => {
    if (!data) return " -";
    const date = new Date(data);
    const pad = (num) => String(num).padStart(2, "0");
    const dia = pad(date.getDate());
    const mes = pad(date.getMonth() + 1);
    const ano = date.getFullYear();
    const horas = pad(date.getHours());
    const minutos = pad(date.getMinutes());
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  };

  useEffect(() => {
    let dadosParaSetar;
    if (dadosJSON) {
      try {
        dadosParaSetar = JSON.parse(dadosJSON.info_tcld);
        setDescarregamento(dadosParaSetar);
      } catch (error) {
        console.error("Erro ao fazer parse do JSON:", error);
      }
    } else {
      fetch(`${API_URL}/descarregamento/descarregando`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            console.error("HTTP status:", res.status);
            throw new Error(`Erro na requisição: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.type === "success") {
            const dadosApi = data.data[0];

            dadosParaSetar = {
              ...dadosApi,
              arqueacao_inicial: arqueacaoFormat(dadosApi.arqueacao_inicial),
              saldo: arqueacaoFormat(dadosApi.saldo),
              atracacao: dataFormat(dadosApi.atracacao),
              inicio_op: dataFormat(dadosApi.inicio_op),
              previsao_fim_op: PrevisaoReal(
                dadosApi.atracacao,
                dadosApi.saldo,
                dadosApi.taxa
              ),
            };
          } else {
            dadosParaSetar = {
              cliente: " - ",
              navio: "BERÇO OCIOSO",
              arqueacao_inicial: "0,00",
              atracacao: "-",
              inicio_op: "-",
              saldo: "0,00",
              meta: 4,
              dias: 0,
              previsao_fim_op: "-",
            };
          }
          setDescarregamento(dadosParaSetar);
          setInfoTcldJson(dadosParaSetar);
        })
        .catch((error) => {
          console.error("Erro de rede:", error);
        });
    }
  }, [dadosJSON, API_URL]);

  if (!descarregamento || descarregamento.cliente === null) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="grid-tcld">
      <div className="info-navio">
        <div className="info-navio-row">
          <div>
            <label htmlFor="cliente">Cliente:</label>
            <input
              id="cliente"
              type="text"
              style={{ width: "150px" }}
              value={descarregamento.cliente}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="navio">Navio:</label>
            <input
              id="navio"
              type="text"
              style={{ width: "230px" }}
              value={descarregamento.navio}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="arqueacao_inicial">Arqueação Inicial:</label>
            <input
              id="arqueacao_inicial"
              type="text"
              style={{ width: "120px" }}
              value={descarregamento.arqueacao_inicial}
              readOnly
            />
          </div>
        </div>
        <div className="info-navio-row">
          <div>
            <label htmlFor="atracacao">Atracação:</label>
            <input
              id="atracacao"
              type="text"
              value={descarregamento.atracacao}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="inicio_op">Início da operação:</label>
            <input
              id="inicio_op"
              type="text"
              value={descarregamento.inicio_op}
              readOnly
            />
          </div>
        </div>
        <div className="info-navio-row">
          <div>
            <label htmlFor="saldo">Saldo à Bordo:</label>
            <input
              id="saldo"
              type="text"
              value={descarregamento.saldo}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="previsao">Previsão de Término:</label>
            <input
              id="previsao"
              type="text"
              value={descarregamento.previsao_fim_op}
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="info-relogio">
        <Relogio
          plano={descarregamento.meta || 4}
          real={descarregamento.dias || 0}
          readOnly
        />
      </div>
    </div>
  );
}
