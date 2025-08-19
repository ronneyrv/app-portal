import { useState, useEffect } from "react";
import { CircularProgress, Box, Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ModalOcorrenciaSimples from "./ModalOcorrenciaSimples";
import ModalOcorrenciaCompleta from "./ModalOcorrenciaCompleta";
import "./tabelanaviopier1.css";

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
  { id: "fim", label: "HORA FIM", minWidth: 80 },
  { id: "ocorrencia", label: "OCORRÊNCIA", minWidth: 80 },
  { id: "resumo", label: "RESUMO", minWidth: 80 },
  { id: "sistema", label: "SISTEMA", minWidth: 80 },
  { id: "subsistema", label: "SUBSISTEMA", minWidth: 80 },
  { id: "classificacao", label: "CLASSIFICAÇÃO", minWidth: 80 },
  { id: "especialidade", label: "ESPECIALIDADE", minWidth: 80 },
  { id: "tipo_desligamento", label: "TIPO", minWidth: 80 },
];

function createDados(
  id,
  fim,
  ocorrencia,
  resumo,
  sistema,
  subsistema,
  classificacao,
  especialidade,
  tipo_desligamento
) {
  return {
    id,
    fim,
    ocorrencia,
    resumo,
    sistema,
    subsistema,
    classificacao,
    especialidade,
    tipo_desligamento,
  };
}

export default function TabelaNavioPier1({ dados, fetchPier }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [navioPier1, setNavioPier1] = useState([]);
  const [rows, setRows] = useState([]);
  const [abrir, setAbrir] = useState(false);
  const [idNavio, setIdNavio] = useState(false);
  const [abrirModal, setAbrirModal] = useState(false);
  const navio = dados.navio;
  const cliente = dados.cliente;

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClickOpen = (id) => {
    setIdNavio(id);
    setAbrir(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchTabela = () => {
    fetch(`${API_URL}/descarregamento/${navio}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setNavioPier1(data.data);
        } else {
          console.error("Erro ao buscar navio atracado");
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  useEffect(() => {
    if (!navio) return;
    fetchTabela();
  }, [dados]);

  useEffect(() => {
    const mappedRows = navioPier1.map((d) =>
      createDados(
        d.id,
        dataFormat(d.fim),
        d.ocorrencia,
        d.resumo,
        d.sistema,
        d.subsistema,
        d.classificacao,
        d.especialidade,
        d.tipo_desligamento
      )
    );
    setRows(mappedRows);
  }, [navioPier1]);

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
    <div className="main-tabela-navio-pier1">
      <ModalOcorrenciaSimples
        id={idNavio}
        abrir={abrir}
        setAbrir={setAbrir}
        fetchTabela={fetchTabela}
        fetchPier={fetchPier}
      />
      <ModalOcorrenciaCompleta
        navio={navio}
        abrirModal={abrirModal}
        setAbrirModal={setAbrirModal}
        fetchPier={fetchPier}
      />
      <Button
        variant="contained"
        size="small"
        sx={{
          margin: "4px",
        }}
        onClick={() => setAbrirModal(true)}
      >
        add ocorrência
      </Button>
      <Button
        variant="contained"
        size="small"
        disabled
        sx={{
          margin: "4px",
        }}
        onClick={() => console.log("navios")}
      >
        Navios
      </Button>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: "#1976d2",
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
                    onClick={() => handleClickOpen(row.id)}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align="center">
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 50, 100]}
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
