import { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "./tabelatopope.css";

const columns = [
  { id: "tempo", label: "TEMPO", minWidth: 70 },
  { id: "ocorrencia", label: "OCORRÊNCIA", minWidth: 350 },
];

function createDados(tempo, ocorrencia) {
  return {
    tempo,
    ocorrencia,
  };
}

export default function TabelaTopOpe({ dados }) {
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const [topOpe, setTopOpe] = useState([]);
  const [rows, setRows] = useState([]);
  const navio = dados.navio;

  const fetchTopOpe = () => {
    if (!navio) return;

    fetch(`${API_URL}/descarregamento/ocorrencia/top10/ope/${navio}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setTopOpe(data.data);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  useEffect(() => {
    if (!navio) return;
    fetchTopOpe();
  }, [dados]);

  useEffect(() => {
    const mappedRows = topOpe.map((d) => createDados(d.tempo, d.ocorrencia));
    setRows(mappedRows);
  }, [topOpe]);

  return (
    <div className="main-tabela-top10-ope">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <h3>Top10 Operação</h3>
        <TableContainer sx={{ maxHeight: 300 }}>
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
                      column.id === "tempo" &&
                      value !== null &&
                      value !== undefined
                    ) {
                      displayValue = `${value} h`;
                    }
                    return (
                      <TableCell
                        key={column.id}
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
