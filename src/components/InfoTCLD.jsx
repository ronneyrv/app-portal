import { useEffect, useMemo, useState } from "react";
import Relogio from "../components/GraficRelogio";
import "../styles/infotcld.css";

export default function InfoTCLD({ setInfoTcldJson, rotJSON, deHoje }) {
  const [descarregamento, setDescarregamento] = useState({});

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

  const arqueacaoFormat = (valor) => {
    if (valor == null) return "";
    return Number(valor)
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const dados = useMemo(() => {
    if (deHoje) return descarregamento;
    return rotJSON?.info_tcld ?? descarregamento;
  }, [rotJSON, descarregamento, deHoje]);

  useEffect(() => {
    setInfoTcldJson(descarregamento);
  }, [descarregamento]);

  useEffect(() => {
    if (!rotJSON) {
      fetch("http://172.20.229.55:3000/descarregando", {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            console.error("HTTP status:", res.status);
          }
          return res.json();
        })
        .then((data) => {
          if (data.type === "success") {
            setDescarregamento(data.data[0]);
          } else {
            setDescarregamento({
              cliente: " - ",
              navio: "BERÇO OCIOSO",
              arqueacao_inicial: 0,
              atracacao1: null,
              inicio_op: null,
              saldo_a_bordo: 0,
              previsao_fim_op: null,
              meta: 4,
              dias: 0,
            });
          }
        })
        .catch((error) => {
          console.error("Erro de rede:", error);
        });
    }
  }, [rotJSON]);

  return (
    <div className="grid-tcld">
      <div className="info-navio">
        <div className="info-navio-row">
          <div>
            <label>Cliente:</label>
            <input
              type="text"
              style={{ width: "150px" }}
              defaultValue={dados.cliente}
              readOnly
            />
          </div>
          <div>
            <label>Navio:</label>
            <input
              type="text"
              style={{ width: "230px" }}
              defaultValue={dados.navio}
              readOnly
            />
          </div>
          <div>
            <label>Arqueação Inicial:</label>
            <input
              type="text"
              style={{ width: "120px" }}
              defaultValue={arqueacaoFormat(dados.arqueacao_inicial)}
              readOnly
            />
          </div>
        </div>
        <div className="info-navio-row">
          <div>
            <label>Atracação:</label>
            <input
              type="text"
              defaultValue={dataFormat(dados.atracacao1)}
              readOnly
            />
          </div>
          <div>
            <label>Início da operação:</label>
            <input
              type="text"
              defaultValue={dataFormat(dados.inicio_op)}
              readOnly
            />
          </div>
        </div>
        <div className="info-navio-row">
          <div>
            <label>Saldo à Bordo:</label>
            <input
              type="text"
              defaultValue={arqueacaoFormat(dados.saldo_a_bordo)}
              readOnly
            />
          </div>
          <div>
            <label>Previsão de Término:</label>
            <input
              type="text"
              defaultValue={dataFormat(dados.previsao_fim_op)}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="info-relogio">
        <Relogio plano={dados.meta || 4} real={dados.dias || 0} readOnly />
      </div>
    </div>
  );
}
