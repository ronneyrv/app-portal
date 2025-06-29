import { useEffect, useMemo, useState } from "react";
import "../styles/progretoma.css";

export default function Prog({ setProgramacaoJson, rotJSON, deHoje }) {
  const [progRetoma, setprogRetoma] = useState([]);
  const [semana, setSemana] = useState(0);
  const [hovered, setHoveredIndex] = useState(false);
  const [hovered2, setHovered2Index] = useState(false);
  const [hovered3, setHovered3Index] = useState(false);
  const [hovered4, setHovered4Index] = useState(false);

  const dataFormatada = (d) => new Date(d).toLocaleDateString("pt-BR");

  const definirSemana = () => {
    const hoje = new Date();
    const primeiroDiaDoAno = new Date(hoje.getFullYear(), 0, 1);
    const diaSemana = primeiroDiaDoAno.getDay();
    const ajustePrimeiroDia = diaSemana === 0 ? 6 : diaSemana - 1; // Ajustar para começar a semana na segunda (segunda = 1, domingo = 7)
    const msPorDia = 24 * 60 * 60 * 1000;
    const diasDesdePrimeiro =
      Math.floor((hoje - primeiroDiaDoAno) / msPorDia) + ajustePrimeiroDia;
    const semanaAtual = Math.ceil(diasDesdePrimeiro / 7) + 1;
    setSemana(semanaAtual);
  };

  const dados = useMemo(() => {
    if (deHoje) return progRetoma;
    return rotJSON?.programacao ?? progRetoma;
  }, [rotJSON, progRetoma, deHoje]);

  useEffect(() => {
    if (!rotJSON) {
      definirSemana();
    }
  }, [rotJSON]);

  useEffect(() => {
    setProgramacaoJson(progRetoma);
  }, [progRetoma]);

  useEffect(() => {
    if (semana === 0) return;

    fetch(`http://172.20.229.55:3000/prog-retoma/${semana}`, {
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
          setprogRetoma(data.data);
        } else {
          setprogRetoma([]);
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
        setprogRetoma([]);
      });
  }, [semana]);

  return (
    <table className="prog-tabela">
      <thead>
        <tr>
          <th rowSpan="2" colSpan="2"></th>
          <th colSpan="2">Segunda</th>
          <th colSpan="2">Terça</th>
          <th colSpan="2">Quarta</th>
          <th colSpan="2">Quinta</th>
          <th colSpan="2">Sexta</th>
          <th colSpan="2">Sábado</th>
          <th colSpan="2">Domingo</th>
          <th rowSpan="2" className="col-fim">
            Observação
          </th>
        </tr>
        <tr>
          <th colSpan="2">
            {dados.length > 0 ? dataFormatada(dados[0].dia) : "?"}
          </th>
          <th colSpan="2">
            {dados.length > 0 ? dataFormatada(dados[1].dia) : "?"}
          </th>
          <th colSpan="2">
            {dados.length > 0 ? dataFormatada(dados[2].dia) : "?"}
          </th>
          <th colSpan="2">
            {dados.length > 0 ? dataFormatada(dados[3].dia) : "?"}
          </th>
          <th colSpan="2">
            {dados.length > 0 ? dataFormatada(dados[4].dia) : "?"}
          </th>
          <th colSpan="2">
            {dados.length > 0 ? dataFormatada(dados[5].dia) : "?"}
          </th>
          <th colSpan="2">
            {dados.length > 0 ? dataFormatada(dados[6].dia) : "?"}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          className={hovered === true ? "highlight-col ug-tr par" : "ug-tr par"}
          onMouseEnter={() => setHoveredIndex(true)}
          onMouseLeave={() => setHoveredIndex(false)}
        >
          <td rowSpan="2" className="col-1">
            UG1
          </td>
          <td rowSpan="2" className="col-2">
            Retoma
          </td>
          <td>{dados.length > 0 ? dados[0].pilha_ug1 : "?"}</td>
          <td>{dados.length > 0 ? dados[0].maquina_ug1 : "?"}</td>
          <td>{dados.length > 0 ? dados[1].pilha_ug1 : "?"}</td>
          <td>{dados.length > 0 ? dados[1].maquina_ug1 : "?"}</td>
          <td>{dados.length > 0 ? dados[2].pilha_ug1 : "?"}</td>
          <td>{dados.length > 0 ? dados[2].maquina_ug1 : "?"}</td>
          <td>{dados.length > 0 ? dados[3].pilha_ug1 : "?"}</td>
          <td>{dados.length > 0 ? dados[3].maquina_ug1 : "?"}</td>
          <td>{dados.length > 0 ? dados[4].pilha_ug1 : "?"}</td>
          <td>{dados.length > 0 ? dados[4].maquina_ug1 : "?"}</td>
          <td>{dados.length > 0 ? dados[5].pilha_ug1 : "?"}</td>
          <td>{dados.length > 0 ? dados[5].maquina_ug1 : "?"}</td>
          <td>{dados.length > 0 ? dados[6].pilha_ug1 : "?"}</td>
          <td>{dados.length > 0 ? dados[6].maquina_ug1 : "?"}</td>
          <td rowSpan="2" className="col-fix">
            {dados.length > 0
              ? dados[0].obs_ug1
              : `Programação Semana ${semana} não foi definida!`}
          </td>
        </tr>
        <tr
          className={hovered === true ? "highlight-col ug-tr par" : "ug-tr par"}
          onMouseEnter={() => setHoveredIndex(true)}
          onMouseLeave={() => setHoveredIndex(false)}
        >
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[0].navio_ug1 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[1].navio_ug1 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[2].navio_ug1 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[3].navio_ug1 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[4].navio_ug1 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[5].navio_ug1 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[6].navio_ug1 : "?"}
          </td>
        </tr>

        <tr
          className={
            hovered2 === true ? "highlight-col ug-tr impar" : "ug-tr impar"
          }
          onMouseEnter={() => setHovered2Index(true)}
          onMouseLeave={() => setHovered2Index(false)}
        >
          <td rowSpan="2" className="col-1">
            UG2
          </td>
          <td rowSpan="2" className="col-2">
            Retoma
          </td>
          <td>{dados.length > 0 ? dados[0].pilha_ug2 : "?"}</td>
          <td>{dados.length > 0 ? dados[0].maquina_ug2 : "?"}</td>
          <td>{dados.length > 0 ? dados[1].pilha_ug2 : "?"}</td>
          <td>{dados.length > 0 ? dados[1].maquina_ug2 : "?"}</td>
          <td>{dados.length > 0 ? dados[2].pilha_ug2 : "?"}</td>
          <td>{dados.length > 0 ? dados[2].maquina_ug2 : "?"}</td>
          <td>{dados.length > 0 ? dados[3].pilha_ug2 : "?"}</td>
          <td>{dados.length > 0 ? dados[3].maquina_ug2 : "?"}</td>
          <td>{dados.length > 0 ? dados[4].pilha_ug2 : "?"}</td>
          <td>{dados.length > 0 ? dados[4].maquina_ug2 : "?"}</td>
          <td>{dados.length > 0 ? dados[5].pilha_ug2 : "?"}</td>
          <td>{dados.length > 0 ? dados[5].maquina_ug2 : "?"}</td>
          <td>{dados.length > 0 ? dados[6].pilha_ug2 : "?"}</td>
          <td>{dados.length > 0 ? dados[6].maquina_ug2 : "?"}</td>
          <td rowSpan="2" className="col-fix">
            {dados.length > 0
              ? dados[0].obs_ug2
              : `Programação Semana ${semana} não foi definida!`}
          </td>
        </tr>
        <tr
          className={
            hovered2 === true ? "highlight-col ug-tr impar" : "ug-tr impar"
          }
          onMouseEnter={() => setHovered2Index(true)}
          onMouseLeave={() => setHovered2Index(false)}
        >
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[0].navio_ug2 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[1].navio_ug2 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[2].navio_ug2 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[3].navio_ug2 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[4].navio_ug2 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[5].navio_ug2 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[6].navio_ug2 : "?"}
          </td>
        </tr>

        <tr
          className={
            hovered3 === true ? "highlight-col ug-tr par" : "ug-tr par"
          }
          onMouseEnter={() => setHovered3Index(true)}
          onMouseLeave={() => setHovered3Index(false)}
        >
          <td rowSpan="2" className="col-1">
            UG3
          </td>
          <td rowSpan="2" className="col-2">
            Retoma
          </td>
          <td>{dados.length > 0 ? dados[0].pilha_ug3 : "?"}</td>
          <td>{dados.length > 0 ? dados[0].maquina_ug3 : "?"}</td>
          <td>{dados.length > 0 ? dados[1].pilha_ug3 : "?"}</td>
          <td>{dados.length > 0 ? dados[1].maquina_ug3 : "?"}</td>
          <td>{dados.length > 0 ? dados[2].pilha_ug3 : "?"}</td>
          <td>{dados.length > 0 ? dados[2].maquina_ug3 : "?"}</td>
          <td>{dados.length > 0 ? dados[3].pilha_ug3 : "?"}</td>
          <td>{dados.length > 0 ? dados[3].maquina_ug3 : "?"}</td>
          <td>{dados.length > 0 ? dados[4].pilha_ug3 : "?"}</td>
          <td>{dados.length > 0 ? dados[4].maquina_ug3 : "?"}</td>
          <td>{dados.length > 0 ? dados[5].pilha_ug3 : "?"}</td>
          <td>{dados.length > 0 ? dados[5].maquina_ug3 : "?"}</td>
          <td>{dados.length > 0 ? dados[6].pilha_ug3 : "?"}</td>
          <td>{dados.length > 0 ? dados[6].maquina_ug3 : "?"}</td>
          <td rowSpan="2" className="col-fix">
            {dados.length > 0
              ? dados[0].obs_ug3
              : `Programação Semana ${semana} não foi definida!`}
          </td>
        </tr>
        <tr
          className={
            hovered3 === true ? "highlight-col ug-tr par" : "ug-tr par"
          }
          onMouseEnter={() => setHovered3Index(true)}
          onMouseLeave={() => setHovered3Index(false)}
        >
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[0].navio_ug3 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[1].navio_ug3 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[2].navio_ug3 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[3].navio_ug3 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[4].navio_ug3 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[5].navio_ug3 : "?"}
          </td>
          <td colSpan="2" className="row-fix">
            {dados.length > 0 ? dados[6].navio_ug3 : "?"}
          </td>
        </tr>
        <tr
          className={
            hovered4 === true ? "highlight-col ug-tr impar" : "ug-tr impar"
          }
          onMouseEnter={() => setHovered4Index(true)}
          onMouseLeave={() => setHovered4Index(false)}
        >
          <td rowSpan="2" colSpan="2" className="col-3">
            Empilha
          </td>
          <td>{dados.length > 0 ? dados[0].pilha_empilha : "?"}</td>
          <td>{dados.length > 0 ? dados[0].maquina_empilha : "?"}</td>
          <td>{dados.length > 0 ? dados[1].pilha_empilha : "?"}</td>
          <td>{dados.length > 0 ? dados[0].maquina_empilha : "?"}</td>
          <td>{dados.length > 0 ? dados[2].pilha_empilha : "?"}</td>
          <td>{dados.length > 0 ? dados[0].maquina_empilha : "?"}</td>
          <td>{dados.length > 0 ? dados[3].pilha_empilha : "?"}</td>
          <td>{dados.length > 0 ? dados[0].maquina_empilha : "?"}</td>
          <td>{dados.length > 0 ? dados[4].pilha_empilha : "?"}</td>
          <td>{dados.length > 0 ? dados[0].maquina_empilha : "?"}</td>
          <td>{dados.length > 0 ? dados[5].pilha_empilha : "?"}</td>
          <td>{dados.length > 0 ? dados[0].maquina_empilha : "?"}</td>
          <td>{dados.length > 0 ? dados[6].pilha_empilha : "?"}</td>
          <td>{dados.length > 0 ? dados[0].maquina_empilha : "?"}</td>
          <td rowSpan="2" className="col-fix">
            {dados.length > 0
              ? dados[0].obs_empilha
              : `Programação Semana ${semana} não foi definida!`}
          </td>
        </tr>
        <tr
          className={
            hovered4 === true ? "highlight-col ug-tr impar" : "ug-tr impar"
          }
          onMouseEnter={() => setHovered4Index(true)}
          onMouseLeave={() => setHovered4Index(false)}
        >
          <td colSpan="2" className="row-fix2">
            {dados.length > 0 ? dados[0].navio_empilha : "?"}
          </td>
          <td colSpan="2" className="row-fix2">
            {dados.length > 0 ? dados[1].navio_empilha : "?"}
          </td>
          <td colSpan="2" className="row-fix2">
            {dados.length > 0 ? dados[2].navio_empilha : "?"}
          </td>
          <td colSpan="2" className="row-fix2">
            {dados.length > 0 ? dados[3].navio_empilha : "?"}
          </td>
          <td colSpan="2" className="row-fix2">
            {dados.length > 0 ? dados[4].navio_empilha : "?"}
          </td>
          <td colSpan="2" className="row-fix2">
            {dados.length > 0 ? dados[5].navio_empilha : "?"}
          </td>
          <td colSpan="2" className="row-fix2">
            {dados.length > 0 ? dados[6].navio_empilha : "?"}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
