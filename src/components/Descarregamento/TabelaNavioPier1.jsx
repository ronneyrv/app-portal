import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUsuario } from "../../contexts/useUsuario";
import { Button } from "@mui/material";
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
import ModalAddNavio from "./ModalAddNavio";
import ModalAddPlano from "./ModalAddPlano";
import NotifyBar from "../NotifyBar";
import ModalAddArqueacao from "./ModalAddArqueacao";
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
  { id: "fim", label: "HORA FIM", minWidth: 100 },
  { id: "ocorrencia", label: "OCORRÊNCIA", minWidth: 80 },
  { id: "resumo", label: "RESUMO", minWidth: 80 },
  { id: "sistema", label: "SISTEMA", minWidth: 80 },
  { id: "subsistema", label: "SUBSISTEMA", minWidth: 170 },
  { id: "classificacao", label: "CLASSIFICAÇÃO", minWidth: 170 },
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

export default function TabelaNavioPier1({
  handlePrint,
  temPlano,
  setTemPlano,
  dados,
  fetchPier,
  dataHora,
  ocioso,
  setOcioso,
}) {
  const { usuario } = useUsuario();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [navioPier1, setNavioPier1] = useState([]);
  const [rows, setRows] = useState([]);
  const [rowNavio, setRowNavio] = useState([]);
  const [abrir, setAbrir] = useState(false);
  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModalAdd, setAbrirModalAdd] = useState(false);
  const [abrirModalPlano, setAbrirModalPlano] = useState(false);
  const [abrirModalArqueacao, setAbrirModalArqueacao] = useState(false);
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navio = dados.navio;
  const cliente = dados.cliente;

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClickOpen = (row) => {
    setRowNavio(row);
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
    setOcioso(false);
    if (!navio) return;

    fetch(`${API_URL}/descarregamento/ocorrencia/atracado/${navio}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setNavioPier1(data.data);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  const fetchOcioso = () => {
    setOcioso(true);
    fetch(`${API_URL}/descarregamento/ocioso`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setNavioPier1(data.data);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  const openPlan = () => {
    if (ocioso) {
      setNotify({
        open: true,
        message: "Não há navio atracado!",
        severity: "info",
      });
    } else {
      setAbrirModalPlano(true);
    }
  };

  useEffect(() => {
    if (!navio) return fetchOcioso();
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

  return (
    <div className="main-tabela-navio-pier1">
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <ModalOcorrenciaSimples
        row={rowNavio}
        abrir={abrir}
        setAbrir={setAbrir}
        fetchTabela={fetchTabela}
        fetchPier={fetchPier}
      />
      <ModalOcorrenciaCompleta
        navio={navio}
        cliente={cliente}
        ocioso={ocioso}
        abrirModal={abrirModal}
        setAbrirModal={setAbrirModal}
        fetchPier={fetchPier}
        fetchOcioso={fetchOcioso}
        fetchTabela={fetchTabela}
      />
      <ModalAddNavio
        abrirModalAdd={abrirModalAdd}
        setAbrirModalAdd={setAbrirModalAdd}
        fetchPier={fetchPier}
      />
      <ModalAddPlano
        abrirModalPlano={abrirModalPlano}
        setAbrirModalPlano={setAbrirModalPlano}
        fetchPier={fetchPier}
        setTemPlano={setTemPlano}
        dados={dados}
      />
      <ModalAddArqueacao
        abrirModalArqueacao={abrirModalArqueacao}
        setAbrirModalArqueacao={setAbrirModalArqueacao}
        fetchPier={fetchPier}
        dados={dados}
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
        disabled={temPlano ? false : true}
        sx={{
          margin: "4px",
        }}
        onClick={() => setAbrirModalArqueacao(true)}
      >
        add arqueação
      </Button>
      <Button
        variant="contained"
        size="small"
        disabled={ocioso ? false : true}
        sx={{
          margin: "4px",
        }}
        onClick={() => setAbrirModalAdd(true)}
      >
        Add Navio
      </Button>
      <Button
        variant="contained"
        size="small"
        disabled={temPlano ? true : false}
        sx={{
          margin: "4px",
        }}
        onClick={() => openPlan()}
      >
        Plano de Descarga
      </Button>
      <Button
        variant="contained"
        size="small"
        disabled={usuario.nivel <= 6 ? false : true}
        sx={{
          margin: "4px",
        }}
        component={Link}
        to="/pptm/descarregamento/navios"
      >
        Navios
      </Button>
      <Button
        variant="contained"
        size="small"
        sx={{
          margin: "4px",
        }}
        onClick={() => {
          dataHora();
          setTimeout(() => {
            handlePrint();
          }, 500);
        }}
      >
        Print
      </Button>
      <Button
        variant="contained"
        size="small"
        sx={{
          margin: "4px",
        }}
        onClick={() => {
          alert('Relatório final')
        }}
      >
        Relatório final
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
