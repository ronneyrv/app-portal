import React, { useEffect, useState } from "react";
import InputsProgramacao from "../../components/RetomaProg/inputsProgramacao";
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import "./retomaprog.css";

export default function ProgramacaoRetoma() {
  const [ano, setAno] = useState("");
  const [semana, setSemana] = useState("");
  const [dias, setDias] = useState([]);
  const [programado, setProgramado] = useState(null);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

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

  const pesquisarProg = (ano, semana) => {
    if (!semana || !ano) return;
    setProgramado(null);
    
    fetch(`${API_URL}/prog-retoma/${ano}/${semana}`, {
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
          setProgramado(data.data);
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  };

  useEffect(() => {
    definirSemana();
  }, []);

  useEffect(() => {
    definirDias();
    pesquisarProg(ano, semana);
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
        <PlagiarismIcon
          sx={{
            cursor: "pointer",
            fontSize: "30px",
          }}
          onClick={() => console.log(programado)}
        />
      </div>

      <InputsProgramacao dias={dias} semana={semana} ano={ano} programado={programado} />
    </div>
  );
}
