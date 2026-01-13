import { useEffect, useState } from "react";
import ModalEditarMedicao from "../../../components/Contrato/ModalEditarMedicao";
import ModalStatusMedicao from "../../../components/Contrato/ModalStatusMedicao";
import NavbarContrato from "../../../components/Contrato/NavbarContrato";
import NotifyBar from "../../../components/NotifyBar";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SearchIcon from "@mui/icons-material/Search";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

const columns = [
  { id: "mes", label: "MÊS", width: 100 },
  { id: "medicao", label: "MEDIÇÃO", width: 100 },
  { id: "pedido", label: "PEDIDO", width: 100 },
  { id: "contrato", label: "CONTRATO", width: 120 },
  { id: "fornecedor", label: "FORNECEDOR", minWidth: 200 },
  { id: "descricao", label: "DESCRICAO", minWidth: 200 },
  { id: "valor", label: "VALOR", width: 120 },
  { id: "centro_custo", label: "CT CUSTO", width: 100 },
  { id: "status_medicao", label: "STATUS", width: 190 },
];

const createDados = (
  id,
  mes,
  medicao,
  pedido,
  contrato,
  fornecedor,
  descricao,
  valor,
  centro_custo,
  plano_orcamentario,
  status_medicao
) => {
  return {
    id,
    mes,
    medicao,
    pedido,
    contrato,
    fornecedor,
    descricao,
    valor,
    centro_custo,
    plano_orcamentario,
    status_medicao,
  };
};

const formatarReal = (valor) => {
  const num = parseFloat(valor);

  if (isNaN(num)) {
    return "-";
  }

  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const formatarMes = (mes) => {
  if (!mes) return "";

  const meses = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];
  const indice = Number(mes) - 1;

  return meses[indice] || mes;
};

export default function Medicoes() {
  const [rows, setRows] = useState([]);
  const [medicoes, setMedicoes] = useState([]);
  const [anoMedicao, setAnoMedicao] = useState(new Date().getFullYear());
  const [rowMedicao, setRowMedicao] = useState([]);
  const [busca, setBusca] = useState("");
  const [abrirModalEditarMedicao, setAbrirModalEditarMedicao] = useState(false);
  const [abrirModalStatusMedicao, setAbrirModalStatusMedicao] = useState(false);
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const anoChange = (event) => {
    const novoAno = event.target.value;

    if (novoAno.length <= 4) {
      setAnoMedicao(novoAno);
    }
  };

  const fetchMedicoes = () => {
    fetch(`${API_URL}/contratos/medicao/${anoMedicao}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setMedicoes(data.data);
        } else {
          setMedicoes([]);
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  useEffect(() => {
    if (!medicoes) return;
    const mappedRows = medicoes.map((d) =>
      createDados(
        d.id,
        formatarMes(d.mes),
        d.medicao,
        d.pedido,
        d.contrato,
        d.fornecedor,
        d.descricao,
        formatarReal(d.valor),
        d.centro_custo,
        d.plano_orcamentario,
        d.status_medicao
      )
    );
    setRows(mappedRows);
  }, [medicoes]);

  useEffect(() => {
    const anoString = String(anoMedicao);
    if (anoString.length === 4) {
      fetchMedicoes();
    }
  }, [anoMedicao]);

  const rowsFiltradas = rows.filter((row) => {
    if (!busca) return true;
    const termo = busca.toLowerCase();
    return (
      row.mes?.toString().toLowerCase().includes(termo) ||
      row.medicao?.toString().toLowerCase().includes(termo) ||
      row.pedido?.toString().toLowerCase().includes(termo) ||
      row.contrato?.toString().toLowerCase().includes(termo) ||
      row.fornecedor?.toString().toLowerCase().includes(termo) ||
      row.status_medicao?.toString().toLowerCase().includes(termo)
    );
  });

  return (
    <div>
      <NavbarContrato />
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <ModalEditarMedicao
        abrirModalEditarMedicao={abrirModalEditarMedicao}
        setAbrirModalEditarMedicao={setAbrirModalEditarMedicao}
        rowMedicao={rowMedicao}
        setRowMedicao={setRowMedicao}
        fetchMedicoes={fetchMedicoes}
      />
      <ModalStatusMedicao
        abrirModalStatusMedicao={abrirModalStatusMedicao}
        setAbrirModalStatusMedicao={setAbrirModalStatusMedicao}
        rowMedicao={rowMedicao}
        setRowMedicao={setRowMedicao}
        fetchMedicoes={fetchMedicoes}
      />
      <TextField
        required
        size="small"
        margin="dense"
        name="ano"
        label="Ano da Medição"
        variant="outlined"
        value={anoMedicao}
        onChange={anoChange}
        type="number"
        sx={{
          width: "177px",
          "& .MuiInputBase-input": {
            padding: "4px 14px",
            fontSize: "1rem",
          },
        }}
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <ButtonGroup size="small" aria-label="Small button group">
          <Button
            startIcon={<ModeEditIcon />}
            onClick={() => {
              if (rowMedicao.length === 0) {
                setNotify({
                  open: true,
                  message: "Selecione uma medição para editar.",
                  severity: "info",
                });
              } else {
                setAbrirModalEditarMedicao(true);
              }
            }}
          >
            Editar
          </Button>
          <Button
            startIcon={<ReportGmailerrorredIcon />}
            onClick={() => {
              if (rowMedicao.length === 0) {
                setNotify({
                  open: true,
                  message: "Selecione uma medição para alterar o status.",
                  severity: "info",
                });
              } else {
                setAbrirModalStatusMedicao(true);
              }
            }}
          >
            Status
          </Button>
        </ButtonGroup>
        <Paper
          component="form"
          size="small"
          sx={{
            p: "2px 0px",
            display: "flex",
            alignItems: "center",
            width: 300,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Pesquisar Medição"
            inputProps={{ "aria-label": "pesquisar contrato" }}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <IconButton
            type="button"
            sx={{ p: "2px", mr: 1 }}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
      <div className="main-tabela-contratos" style={{ marginTop: 20 }}>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ height: 420 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{
                        minWidth: column.minWidth,
                        width: column.width,
                        backgroundColor: "#eaeaecff",
                        fontWeight: "bold",
                        padding: "2px",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsFiltradas.map((item) => {
                  const isSelected = rowMedicao === item;
                  return (
                    <TableRow
                      key={item.id}
                      hover
                      selected={isSelected}
                      onClick={() => setRowMedicao(item)}
                      sx={{
                        cursor: "pointer",
                        "&.Mui-selected": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                        "&.Mui-selected:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.12)",
                        },
                      }}
                    >
                      {columns.map((column) => {
                        const value = item[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align="center"
                            sx={{ padding: "2px 6px" }}
                          >
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
}
