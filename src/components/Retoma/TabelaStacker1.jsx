import { useState, useEffect, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "./tabelaStacker1.css";

const dataFormat = (data) => {
  if (!data) return null;
  const date = new Date(data);
  const pad = (num) => String(num).padStart(2, "0");
  const dia = pad(date.getUTCDate());
  const mes = pad(date.getUTCMonth() + 1);
  const ano = date.getUTCFullYear();
  const horas = pad(date.getUTCHours());
  const minutos = pad(date.getUTCMinutes());

  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
};

const columns = [
  { id: "classificacao", label: "OCORRÊNCIA", minWidth: 50 },
  { id: "ug", label: "UNIDADE", minWidth: 50 },
  { id: "pilha", label: "PILHA", minWidth: 50 },
  { id: "inicio", label: "INÍCIO", minWidth: 110 },
  { id: "fim", label: "FIM", minWidth: 110 },
  { id: "volume", label: "VOLUME", minWidth: 50 },
];

function createDados(classificacao, ug, pilha, inicio, fim, volume) {
  return {
    classificacao,
    ug,
    pilha,
    inicio,
    fim,
    volume,
  };
}

export default function TabelaStacker1({ retomado }) {
  const [rows, setRows] = useState([]);

  const filteredRetomado = useMemo(() => {
    if (!retomado || !Array.isArray(retomado)) {
      return [];
    }
    return retomado.filter((d) => d.maquina === "STACKER 1");
  }, [retomado]);

  useEffect(() => {
    if (!retomado) return;
    const mappedRows = filteredRetomado.map((d) =>
      createDados(
        d.classificacao,
        d.ug,
        d.pilha,
        dataFormat(d.inicio),
        dataFormat(d.fim),
        d.volume
      )
    );
    setRows(mappedRows);
  }, [filteredRetomado]);

  return (
    <div className="main-tabela-stacker1">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ height: 300 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: "#eaeaecff",
                      fontWeight: "bold",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((item, indexLinha) => (
                <TableRow key={indexLinha}>
                  {columns.map((column) => {
                    const value = item[column.id];
                    let displayValue = value;
                    if (
                      column.id === "volume" &&
                      value !== null &&
                      value !== undefined
                    ) {
                      displayValue = `${value} t`;
                    }
                    return (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        {displayValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
