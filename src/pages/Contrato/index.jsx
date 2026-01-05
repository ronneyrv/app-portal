import { useEffect, useState } from "react";
import NavbarContrato from "../../components/Contrato/NavbarContrato";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import StraightenIcon from "@mui/icons-material/Straighten";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import SearchIcon from "@mui/icons-material/Search";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ModalAddContrato from "../../components/Contrato/ModalAddContrato";
import ModalEditarContrato from "../../components/Contrato/ModalEditarContrato";
import ModalEncerrarContrato from "../../components/Contrato/ModalEncerrarContrato";
import ModalMedirContrato from "../../components/Contrato/ModalMedirContrato";
import ModalReajusteContrato from "../../components/Contrato/ModalReajusteContrato";
import ModalOrcarContrato from "../../components/Contrato/ModalOrcarContrato";
import ModalCustoAnual from "../../components/Contrato/ModalCustoAnual";
import NotifyBar from "../../components/NotifyBar";
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
} from "@mui/material";
import "./contrato.css";

const columns = [
  { id: "contrato", label: "Nº CONTRATO", width: 200 },
  { id: "fornecedor", label: "FORNECEDOR", minWidth: 150 },
  { id: "valor_contrato", label: "VALOR", width: 180 },
  { id: "vigencia", label: "VIGÊNCIA", width: 120 },
  { id: "reajuste", label: "REAJUSTE", width: 120 },
  { id: "tarifa", label: "TARIFA", width: 180 },
  { id: "status_vigencia", label: "STATUS VIGÊNCIA", width: 180 },
  { id: "status_reajuste", label: "STATUS REAJUSTE", width: 180 },
];

const createDados = (
  id,
  contrato,
  fornecedor,
  tipo,
  inicio,
  vigencia,
  reajuste,
  tarifa,
  valor_contrato,
  status_reajuste,
  status_vigencia
) => {
  return {
    id,
    contrato,
    fornecedor,
    tipo,
    inicio,
    vigencia,
    reajuste,
    tarifa,
    valor_contrato,
    status_reajuste,
    status_vigencia,
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

const formatarDate = (dateString) => {
  if (!dateString) return "SEM REAJUSTE";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

const StatusCor = (status) => {
  switch (status) {
    case "OK":
      return "#4caf50";
    case "ATENÇÃO":
      return "#ffeb3b";
    case "CRÍTICO":
      return "#ff9800";
    case "VENCIDO":
      return "#f44336";
    default:
      return "#f9f9f9";
  }
};

export default function Contrato() {
  const [rows, setRows] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [rowContrato, setRowContrato] = useState([]);
  const [busca, setBusca] = useState("");
  const [abrirModalAddContrato, setAbrirModalAddContrato] = useState(false);
  const [abrirModalEditarContrato, setAbrirModalEditarContrato] =
    useState(false);
  const [abrirModalMedirContrato, setAbrirModalMedirContrato] = useState(false);
  const [abrirModalEncerrarContrato, setAbrirModalEncerrarContrato] =
    useState(false);
  const [abrirModalReajusteContrato, setAbrirModalReajusteContrato] =
    useState(false);
  const [abrirModalOrcarContrato, setAbrirModalOrcarContrato] = useState(false);
  const [abrirModalCustoAnual, setAbrirModalCustoAnual] = useState(false);
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const fetchContratos = () => {
    fetch(`${API_URL}/contratos`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setContratos(data.data);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  useEffect(() => {
    if (!contratos) return;
    const mappedRows = contratos.map((d) =>
      createDados(
        d.id,
        d.contrato,
        d.fornecedor,
        d.tipo,
        formatarDate(d.inicio),
        formatarDate(d.vigencia),
        formatarDate(d.reajuste),
        d.tarifa,
        formatarReal(d.valor_contrato),
        d.status_reajuste,
        d.status_vigencia
      )
    );
    setRows(mappedRows);
  }, [contratos]);

  useEffect(() => {
    fetchContratos();
  }, []);

  const rowsFiltradas = rows.filter((row) => {
    if (!busca) return true;
    const termo = busca.toLowerCase();
    return (
      row.contrato?.toString().toLowerCase().includes(termo) ||
      row.fornecedor?.toString().toLowerCase().includes(termo)
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
      <ModalAddContrato
        abrirModalAddContrato={abrirModalAddContrato}
        setAbrirModalAddContrato={setAbrirModalAddContrato}
        fetchContratos={fetchContratos}
      />
      <ModalEditarContrato
        abrirModalEditarContrato={abrirModalEditarContrato}
        setAbrirModalEditarContrato={setAbrirModalEditarContrato}
        rowContrato={rowContrato}
        setRowContrato={setRowContrato}
        fetchContratos={fetchContratos}
      />
      <ModalMedirContrato
        abrirModalMedirContrato={abrirModalMedirContrato}
        setAbrirModalMedirContrato={setAbrirModalMedirContrato}
        rowContrato={rowContrato}
        setRowContrato={setRowContrato}
        fetchContratos={fetchContratos}
      />
      <ModalOrcarContrato
        abrirModalOrcarContrato={abrirModalOrcarContrato}
        setAbrirModalOrcarContrato={setAbrirModalOrcarContrato}
        rowContrato={rowContrato}
        setRowContrato={setRowContrato}
        fetchContratos={fetchContratos}
      />
      <ModalReajusteContrato
        abrirModalReajusteContrato={abrirModalReajusteContrato}
        setAbrirModalReajusteContrato={setAbrirModalReajusteContrato}
        rowContrato={rowContrato}
        setRowContrato={setRowContrato}
        fetchContratos={fetchContratos}
      />
      <ModalCustoAnual
        abrirModalCustoAnual={abrirModalCustoAnual}
        setAbrirModalCustoAnual={setAbrirModalCustoAnual}
      />
      <ModalEncerrarContrato
        abrirModalEncerrarContrato={abrirModalEncerrarContrato}
        setAbrirModalEncerrarContrato={setAbrirModalEncerrarContrato}
        rowContrato={rowContrato}
        setRowContrato={setRowContrato}
        fetchContratos={fetchContratos}
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <ButtonGroup size="small" aria-label="Small button group">
          <Button
            startIcon={<AddIcon />}
            onClick={() => setAbrirModalAddContrato(true)}
          >
            Adicionar
          </Button>
          <Button
            startIcon={<ModeEditIcon />}
            onClick={() => {
              if (rowContrato.length === 0) {
                setNotify({
                  open: true,
                  message: "Selecione um contrato para editar.",
                  severity: "info",
                });
              } else {
                setAbrirModalEditarContrato(true);
              }
            }}
          >
            Editar
          </Button>
          <Button
            startIcon={<StraightenIcon />}
            onClick={() => {
              if (rowContrato.length === 0) {
                setNotify({
                  open: true,
                  message: "Selecione um contrato para medir.",
                  severity: "info",
                });
              } else {
                setAbrirModalMedirContrato(true);
              }
            }}
          >
            Medir
          </Button>
          <Button
            startIcon={<HourglassTopIcon />}
            onClick={() => {
              if (rowContrato.length === 0) {
                setNotify({
                  open: true,
                  message: "Selecione um contrato para reajustar.",
                  severity: "info",
                });
              } else {
                setAbrirModalReajusteContrato(true);
              }
            }}
          >
            Reajustar
          </Button>
          <Button
            startIcon={<CurrencyExchangeIcon />}
            onClick={() => {
              if (rowContrato.length === 0) {
                setNotify({
                  open: true,
                  message: "Selecione um contrato para orçar.",
                  severity: "info",
                });
              } else {
                setAbrirModalOrcarContrato(true);
              }
            }}
          >
            Orçar
          </Button>
          <Button
            startIcon={<AttachMoneyIcon />}
            onClick={() => {
              setAbrirModalCustoAnual(true);
            }}
          >
            CUSTO ANUAL
          </Button>
          <Button
            color="error"
            startIcon={<HighlightOffIcon />}
            onClick={() => {
              if (rowContrato.length === 0) {
                setNotify({
                  open: true,
                  message: "Selecione um contrato para encerrar.",
                  severity: "info",
                });
              } else {
                setAbrirModalEncerrarContrato(true);
              }
            }}
          >
            Encerrar
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
            placeholder="Pesquisar Contrato"
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
          <TableContainer sx={{ height: 450 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns
                    .filter((column) => column.label !== "TARIFA")
                    .map((column) => (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{
                          minWidth: column.minWidth,
                          width: column.width,
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
                {rowsFiltradas.map((item, indexLinha) => {
                  const isSelected = rowContrato === item;
                  return (
                    <TableRow
                      key={indexLinha}
                      hover
                      selected={isSelected}
                      onClick={() => {
                        setRowContrato(item);
                      }}
                      sx={{ cursor: "pointer" }}
                    >
                      {columns
                        .filter((column) => column.label !== "TARIFA")
                        .map((column) => {
                          const value = item[column.id];
                          const isStatusColumn = [
                            "status_vigencia",
                            "status_reajuste",
                          ].includes(column.id);
                          const cellBackground = isStatusColumn
                            ? StatusCor(value)
                            : "inherit";
                          const textColor =
                            isStatusColumn && value !== "ATENÇÃO"
                              ? "#ffffff"
                              : "inherit";
                          return (
                            <TableCell
                              key={column.id}
                              align="center"
                              style={{
                                backgroundColor: cellBackground,
                                color: textColor,
                                padding: "0",
                                fontWeight: isStatusColumn ? "bold" : "normal",
                              }}
                            >
                              {value}
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
