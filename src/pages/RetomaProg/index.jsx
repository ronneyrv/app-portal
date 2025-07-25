import React, { useEffect, useState } from "react";
import InputsProgramacao from "../../components/RetomaProg/inputsProgramacao";
import "./retomaprog.css";

export default function ProgramacaoRetoma() {
  const [ano, setAno] = useState("");
  const [semana, setSemana] = useState("");
  const [dias, setDias] = useState([]);

  const definirSemana = () => {
    const hoje = new Date();
    const primeiroDiaDoAno = new Date(hoje.getFullYear(), 0, 1);
    const diaSemana = primeiroDiaDoAno.getDay();
    const ajustePrimeiroDia = diaSemana === 0 ? 6 : diaSemana - 1;
    const msPorDia = 24 * 60 * 60 * 1000;

    const diasDesdePrimeiro =
      Math.floor((hoje - primeiroDiaDoAno) / msPorDia) + ajustePrimeiroDia;

    const semanaAtual = Math.ceil(diasDesdePrimeiro / 7);

    setAno(hoje.getFullYear());
    setSemana(semanaAtual);
  };

  const definirDias = () => {
    if (!semana || !ano) return;

    const msPorDia = 24 * 60 * 60 * 1000;
    const primeiroDiaDoAno = new Date(ano, 0, 1);
    const diaSemana = primeiroDiaDoAno.getDay();
    const ajustePrimeiroDia = diaSemana === 0 ? 6 : diaSemana - 1;

    const diasDesdeInicio = (semana - 1) * 7 - ajustePrimeiroDia;
    const segundaFeira = new Date(
      primeiroDiaDoAno.getTime() + diasDesdeInicio * msPorDia
    );

    const dias = [];

    for (let i = 0; i < 7; i++) {
      const dia = new Date(segundaFeira.getTime() + i * msPorDia);
      const diaFormatado = dia.toLocaleDateString("pt-BR");
      dias.push(diaFormatado);
    }

    setDias(dias);
  };

  useEffect(() => {
    definirSemana();
  }, []);

  useEffect(() => {
    definirDias();
  }, [semana, ano]);

  return (
    <div className="main-retoma-prog">
      <h3>Programação de Retoma</h3>

      <div className="semana-container">
        <label>SEMANA</label>
        <input
          type="number"
          value={semana}
          onChange={(e) => setSemana(e.target.value)}
        />

        <label>ANO</label>
        <input
          type="number"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
        />
      </div>

      <InputsProgramacao dias={dias} semana={semana} />
    </div>
  );
}
