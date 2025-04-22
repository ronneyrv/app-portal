import { useState } from "react";
import "../styles/progretoma.css";

export default function Prog({ dados }) {
  const [hovered, setHoveredIndex] = useState(false);
  const [hovered2, setHovered2Index] = useState(false);
  const [hovered3, setHovered3Index] = useState(false);
  const [hovered4, setHovered4Index] = useState(false);
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
          <th colSpan="2">{dados[1].dia}</th>
          <th colSpan="2">{dados[5].dia}</th>
          <th colSpan="2">{dados[9].dia}</th>
          <th colSpan="2">{dados[13].dia}</th>
          <th colSpan="2">{dados[17].dia}</th>
          <th colSpan="2">{dados[21].dia}</th>
          <th colSpan="2">{dados[25].dia}</th>
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
          <td>{dados[1].pilha}</td>
          <td>Stacker {dados[1].stacker}</td>
          <td>{dados[5].pilha}</td>
          <td>Stacker {dados[5].stacker}</td>
          <td>{dados[9].pilha}</td>
          <td>Stacker {dados[9].stacker}</td>
          <td>{dados[13].pilha}</td>
          <td>Stacker {dados[13].stacker}</td>
          <td>{dados[17].pilha}</td>
          <td>Stacker {dados[17].stacker}</td>
          <td>{dados[21].pilha}</td>
          <td>Stacker {dados[21].stacker}</td>
          <td>{dados[25].pilha}</td>
          <td>Stacker {dados[25].stacker}</td>
          <td rowSpan="2">{dados[1].obs}</td>
        </tr>
        <tr
          className={hovered === true ? "highlight-col ug-tr par" : "ug-tr par"}
          onMouseEnter={() => setHoveredIndex(true)}
          onMouseLeave={() => setHoveredIndex(false)}
        >
          <td colSpan="2">{dados[1].navio}</td>
          <td colSpan="2">{dados[5].navio}</td>
          <td colSpan="2">{dados[9].navio}</td>
          <td colSpan="2">{dados[13].navio}</td>
          <td colSpan="2">{dados[17].navio}</td>
          <td colSpan="2">{dados[21].navio}</td>
          <td colSpan="2">{dados[25].navio}</td>
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
          <td>{dados[2].pilha}</td>
          <td>Stacker {dados[2].stacker}</td>
          <td>{dados[6].pilha}</td>
          <td>Stacker {dados[6].stacker}</td>
          <td>{dados[10].pilha}</td>
          <td>Stacker {dados[10].stacker}</td>
          <td>{dados[14].pilha}</td>
          <td>Stacker {dados[14].stacker}</td>
          <td>{dados[18].pilha}</td>
          <td>Stacker {dados[18].stacker}</td>
          <td>{dados[22].pilha}</td>
          <td>Stacker {dados[22].stacker}</td>
          <td>{dados[26].pilha}</td>
          <td>Stacker {dados[26].stacker}</td>
          <td rowSpan="2">{dados[2].obs}</td>
        </tr>
        <tr          className={
            hovered2 === true ? "highlight-col ug-tr impar" : "ug-tr impar"
          }
          onMouseEnter={() => setHovered2Index(true)}
          onMouseLeave={() => setHovered2Index(false)}
>
          <td colSpan="2">{dados[2].navio}</td>
          <td colSpan="2">{dados[6].navio}</td>
          <td colSpan="2">{dados[10].navio}</td>
          <td colSpan="2">{dados[14].navio}</td>
          <td colSpan="2">{dados[18].navio}</td>
          <td colSpan="2">{dados[22].navio}</td>
          <td colSpan="2">{dados[26].navio}</td>
        </tr>

        <tr
          className={hovered3 === true ? "highlight-col ug-tr par" : "ug-tr par"}
          onMouseEnter={() => setHovered3Index(true)}
          onMouseLeave={() => setHovered3Index(false)}
        >

          <td rowSpan="2" className="col-1">
            UG3
          </td>
          <td rowSpan="2" className="col-2">
            Retoma
          </td>
          <td>{dados[3].pilha}</td>
          <td>Stacker {dados[3].stacker}</td>
          <td>{dados[7].pilha}</td>
          <td>Stacker {dados[7].stacker}</td>
          <td>{dados[11].pilha}</td>
          <td>Stacker {dados[11].stacker}</td>
          <td>{dados[15].pilha}</td>
          <td>Stacker {dados[15].stacker}</td>
          <td>{dados[19].pilha}</td>
          <td>Stacker {dados[19].stacker}</td>
          <td>{dados[23].pilha}</td>
          <td>Stacker {dados[23].stacker}</td>
          <td>{dados[27].pilha}</td>
          <td>Stacker {dados[27].stacker}</td>
          <td rowSpan="2">{dados[3].obs}</td>
        </tr>
        <tr
          className={hovered3 === true ? "highlight-col ug-tr par" : "ug-tr par"}
          onMouseEnter={() => setHovered3Index(true)}
          onMouseLeave={() => setHovered3Index(false)}
        >

          <td colSpan="2">{dados[3].navio}</td>
          <td colSpan="2">{dados[7].navio}</td>
          <td colSpan="2">{dados[11].navio}</td>
          <td colSpan="2">{dados[15].navio}</td>
          <td colSpan="2">{dados[19].navio}</td>
          <td colSpan="2">{dados[23].navio}</td>
          <td colSpan="2">{dados[27].navio}</td>
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
          <td>{dados[0].pilha}</td>
          <td>Stacker {dados[0].stacker}</td>
          <td>{dados[4].pilha}</td>
          <td>Stacker {dados[4].stacker}</td>
          <td>{dados[8].pilha}</td>
          <td>Stacker {dados[8].stacker}</td>
          <td>{dados[12].pilha}</td>
          <td>Stacker {dados[12].stacker}</td>
          <td>{dados[16].pilha}</td>
          <td>Stacker {dados[16].stacker}</td>
          <td>{dados[20].pilha}</td>
          <td>Stacker {dados[20].stacker}</td>
          <td>{dados[24].pilha}</td>
          <td>Stacker {dados[24].stacker}</td>
          <td rowSpan="2">{dados[0].obs}</td>
        </tr>
        <tr
          className={
            hovered4 === true ? "highlight-col ug-tr impar" : "ug-tr impar"
          }
          onMouseEnter={() => setHovered4Index(true)}
          onMouseLeave={() => setHovered4Index(false)}
        >

          <td colSpan="2">{dados[0].navio}</td>
          <td colSpan="2">{dados[4].navio}</td>
          <td colSpan="2">{dados[8].navio}</td>
          <td colSpan="2">{dados[12].navio}</td>
          <td colSpan="2">{dados[16].navio}</td>
          <td colSpan="2">{dados[20].navio}</td>
          <td colSpan="2">{dados[24].navio}</td>
        </tr>
      </tbody>
    </table>
  );
}
