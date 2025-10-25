import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ModalOcorrenciaCompletaGeral from "../../../components/Descarregamento/ModalOcorrenciaCompletaGeral";
import ModalFinalNavio from "../../../components/Descarregamento/ModalFinalNavio";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import "./descarregamentonavio.css";

export default function Navios() {
  const [dados, setDados] = useState([]);
  const [rowEdit, setRowEdit] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [abrirModalGeral, setAbrirModalGeral] = useState(false);
  const [abrirModalFinal, setAbrirModalFinal] = useState(false);
  const [filters, setFilters] = useState({});

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClickOpen = (row) => {
    setAbrirModalGeral(true);
    const rowAjustada = {
      ...row,
      inicio: formatarDataParaInput(row.inicio),
      fim: formatarDataParaInput(row.fim),
    };
    setRowEdit(rowAjustada);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilterChange = (columnId, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [columnId]: value,
    }));
    setPage(0);
  };

  const columns = [
    { id: "navio", label: "NAVIO", minWidth: 100 },
    { id: "cliente", label: "CLIENTE", minWidth: 80 },
    { id: "inicio", label: "HORA INÍCIO", minWidth: 130 },
    { id: "fim", label: "HORA FIM", minWidth: 130 },
    { id: "ocorrencia", label: "OCORRÊNCIA", minWidth: 300 },
    { id: "resumo", label: "RESUMO", minWidth: 80 },
    { id: "sistema", label: "SISTEMA", minWidth: 80 },
    { id: "subsistema", label: "SUBSISTEMA", minWidth: 120 },
    { id: "classificacao", label: "CLASSIFICAÇÃO", minWidth: 120 },
    { id: "especialidade", label: "ESPECIALIDADE", minWidth: 80 },
    { id: "tipo_desligamento", label: "TIPO", minWidth: 80 },
    { id: "tempo", label: "TEMPO", minWidth: 30 },
  ];

  const filteredRows = rows.filter((row) => {
    return columns.every((column) => {
      const filterValue = filters[column.id] || "";
      const cellValue = String(row[column.id] || "").toLowerCase();
      return cellValue.includes(filterValue.toLowerCase());
    });
  });

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

  const fetchTabelaGeral = () => {
    fetch(`${API_URL}/descarregamento/ocorrencias`, {
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
          setDados(data.data);
        } else {
          setDados([]);
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  };

  function formatarDataParaInput(dataString) {
    if (!dataString) {
      return null;
    }

    const [data, hora] = dataString.split(" ");
    const [dia, mes, ano] = data.split("/");
    const [horas, minutos] = hora.split(":");

    if (!dia || !mes || !ano || !horas || !minutos) {
      console.error("Formato de data inválido:", dataString);
      return null;
    }

    const mesFormatado = mes.padStart(2, "0");
    const diaFormatado = dia.padStart(2, "0");
    const horasFormatado = horas.padStart(2, "0");
    const minutosFormatado = minutos.padStart(2, "0");

    return `${ano}-${mesFormatado}-${diaFormatado}T${horasFormatado}:${minutosFormatado}`;
  }

  function createDados(
    id,
    navio,
    cliente,
    inicio,
    fim,
    ocorrencia,
    resumo,
    sistema,
    subsistema,
    classificacao,
    especialidade,
    tipo_desligamento,
    tempo
  ) {
    return {
      id,
      navio,
      cliente,
      inicio,
      fim,
      ocorrencia,
      resumo,
      sistema,
      subsistema,
      classificacao,
      especialidade,
      tipo_desligamento,
      tempo,
    };
  }

  useEffect(() => {
    const mappedRows = dados.map((d) =>
      createDados(
        d.id,
        d.navio,
        d.cliente,
        dataFormat(d.inicio),
        dataFormat(d.fim),
        d.ocorrencia,
        d.resumo,
        d.sistema,
        d.subsistema,
        d.classificacao,
        d.especialidade,
        d.tipo_desligamento,
        d.tempo
      )
    );
    setRows(mappedRows);
  }, [dados]);

  useEffect(() => {
    fetchTabelaGeral();
  }, []);

  return (
    <>
      <ModalOcorrenciaCompletaGeral
        rowEdit={rowEdit}
        fetchTabelaGeral={fetchTabelaGeral}
        abrirModalGeral={abrirModalGeral}
        setAbrirModalGeral={setAbrirModalGeral}
      />
      <ModalFinalNavio 
        abrirModalFinal={abrirModalFinal}
        setAbrirModalFinal={setAbrirModalFinal}
      />
      <Button
        variant="contained"
        size="small"
        sx={{
          marginBottom: "10px",
        }}
        component={Link}
        to="/pptm/descarregamento"
      >
        Voltar
      </Button>
      <Button
        variant="contained"
        size="small"
        sx={{
          marginBottom: "10px",
          marginLeft: "5px"
        }}
        onClick={() => setAbrirModalFinal(true)}
      >
        Finalizar navio
      </Button>
      <Button
        variant="contained"
        size="small"
        sx={{
          marginBottom: "10px",
          marginLeft: "5px"
        }}
        onClick={() => alert('Planos de descarga')}
      >
        Planos de descarga
      </Button>
      <Button
        variant="contained"
        size="small"
        sx={{
          marginBottom: "10px",
          marginLeft: "5px"
        }}
        component={Link}
        to="/pptm/descarregamento/navios/consolidado"
      >
        Navios consolidado
      </Button>

      <div className="main-descarregamento-navio">
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 550 }}>
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
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        {column.label}
                        <TextField
                          variant="outlined"
                          size="small"
                          placeholder={`Filtrar...`}
                          onChange={(e) =>
                            handleFilterChange(column.id, e.target.value)
                          }
                          sx={{
                            backgroundColor: "#fff",
                            borderRadius: "4px",
                            marginTop: "1px",
                            minWidth: column.minWidth,
                            "& .MuiInputBase-root": {
                              height: 25,
                              "& .MuiInputBase-input": {
                                paddingTop: "0px", 
                                paddingBottom: "0px", 
                                fontSize: "0.6rem",
                              },
                            },
                          }}
                        />
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      sx={{ cursor: "pointer" }}
                      key={row.id}
                      onClick={() => handleClickOpen(row)}
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
            rowsPerPageOptions={[100, 500, 1000]}
            component="div"
            count={filteredRows.length}
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
    </>
  );
}
