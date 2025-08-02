// TabelaEstoque.jsx

import * as React from "react";
import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { CircularProgress, Box } from "@mui/material";
import "./tabelaestoque.css";

function formatTon(value) {
  return value
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDia(isoDate) {
  const [year, month, day] = isoDate.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}

const columns = [
  { id: "data", label: "DATA", minWidth: 80 },
  { id: "consUg1", label: "CONSUMO UG1", minWidth: 80 },
  { id: "consUg2", label: "CONSUMO UG2", minWidth: 80 },
  { id: "tcldEp", label: "TCLD EP", minWidth: 80 },
  { id: "tmutEp", label: "TMUT EP", minWidth: 80 },
  { id: "ajusteEp", label: "AJUSTE EP", minWidth: 80 },
  { id: "emprestimoEP", label: "EMPRÉSTIMO EP", minWidth: 80 },
  { id: "consUg3", label: "CONSUMO UG3", minWidth: 80 },
  { id: "tcldEneva", label: "TCLD ENEVA", minWidth: 80 },
  { id: "tmutEneva", label: "TMUT ENEVA", minWidth: 80 },
  { id: "ajusteEneva", label: "AJUSTE ENEVA", minWidth: 80 },
  { id: "emprestimoEneva", label: "EMPRÉSTIMO ENEVA", minWidth: 80 },
  { id: "comentario", label: "OBSERVAÇÃO", minWidth: 300 },
];

function createDados(
  id,
  data,
  consUg1,
  consUg2,
  consUg3,
  tcldEp,
  tmutEp,
  ajusteEp,
  emprestimoEP,
  tcldEneva,
  tmutEneva,
  ajusteEneva,
  emprestimoEneva,
  comentario
) {
  return {
    id,
    data,
    consUg1,
    consUg2,
    consUg3,
    tcldEp,
    tmutEp,
    ajusteEp,
    emprestimoEP,
    tcldEneva,
    tmutEneva,
    ajusteEneva,
    emprestimoEneva,
    comentario,
  };
}

export default function TabelaEstoque() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [estoqueGeralDias, setEstoqueGeralDias] = useState([]);
  const [rows, setRows] = useState([]);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_URL}/estoque`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setEstoqueGeralDias(data.data);
        } else {
          console.error("Erro ao buscar estoque");
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  }, []);

  useEffect(() => {
    const mappedRows = estoqueGeralDias.map((d) =>
      createDados(
        d.id,
        formatDia(d.dia),
        d.consumo_ug1,
        d.consumo_ug2,
        d.consumo_ug3,
        d.tcld_ep,
        d.rodoviario_ep,
        d.ajuste_ep,
        d.emprestimo_ep,
        d.tcld_eneva,
        d.rodoviario_eneva,
        d.ajuste_eneva,
        d.emprestimo_eneva,
        d.comentario
      )
    );
    setRows(mappedRows);
  }, [estoqueGeralDias]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (!rows.length) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 350,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="main-tabela-estoque">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 350 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: index < 7 ? "#00bcd4" : "#ff6d00",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    hover
                    sx={{ cursor: "pointer" }}
                    key={row.id}
                    onClick={() => console.log("ID:", row.id)}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align="center">
                          {typeof value === "number" ? formatTon(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[50, 125, 500]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count}`
          }
        />
      </Paper>
    </div>
  );
}
