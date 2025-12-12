import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import ModalConsolidado from "../../../../components/Descarregamento/ModalConsolidado";
import "./descarregamentoconsolidado.css";

export default function Consolidado() {
  const [dados, setDados] = useState([]);
  const [rowEdit3, setRowEdit3] = useState([]);
  const [rows, setRows] = useState([]);
  const [abrirModalConsolidado, setAbrirModalConsolidado] = useState(false);
  const [filter2, setFilter2] = useState({});

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClickOpen = (row) => {
    setAbrirModalConsolidado(true);
    const rowAjustada = {
      ...row,
    };
    setRowEdit3(rowAjustada);
  };

  const handleFilterChange2 = (columnId, value) => {
    setFilter2((prevFilter2) => ({
      ...prevFilter2,
      [columnId]: value,
    }));
  };

  const columns = [
    { id: "navio", label: "NAVIO", minWidth: 100 },
    { id: "cliente", label: "CLIENTE", minWidth: 80 },
    { id: "sistema", label: "SISTEMA", minWidth: 70 },
    { id: "nor", label: "NOR", minWidth: 130 },
    { id: "atracacao", label: "ATRACAÇÃO", minWidth: 130 },
    { id: "desatracacao", label: "DESATRACAÇÃO", minWidth: 130 },
    { id: "inicio_operacao", label: "INÍCIO OPE", minWidth: 130 },
    { id: "fim_operacao", label: "FINAL OPE", minWidth: 130 },
    { id: "dias_operando", label: "OPERANDO", minWidth: 60 },
    { id: "dias_atracado", label: "ATRACADO", minWidth: 60 },
    { id: "dias_base_75k", label: "BASE 75K", minWidth: 60 },
    { id: "meta", label: "META", minWidth: 60 },
    { id: "carga", label: "CARGA", minWidth: 80 },
    { id: "produtividade", label: "PRODUTIVIDADE", minWidth: 80 },
    { id: "carvao_tipo", label: "PRODUTO", minWidth: 80 },
    { id: "taxa_comercial", label: "TX COMERCIAL", minWidth: 100 },
    { id: "taxa_efetiva", label: "TX EFETIVA", minWidth: 100 },
    { id: "observacao", label: "OBSERVAÇÕES", minWidth: 200 },
    { id: "dias_de_demurrage", label: "DIAS DEMURRAGE", minWidth: 100 },
    {
      id: "valor_demurrage_USD",
      label: "VALOR DEMURRAGE (USD)",
      minWidth: 150,
    },
    {
      id: "demurrage_ou_despatch_aproximado",
      label: "DEMURRAGE OU DESPATCH (USD)",
      minWidth: 180,
    },
  ];

  const filteredRows = rows.filter((row) => {
    return columns.every((column) => {
      const filterValue = filter2[column.id] || "";
      const cellValue = String(row[column.id] || "").toLowerCase();
      return cellValue.includes(filterValue.toLowerCase());
    });
  });

  const dataFormat = (data) => {
    if (!data) return "-";
    const date = new Date(data);
    const pad = (num) => String(num).padStart(2, "0");

    const dia = pad(date.getUTCDate());
    const mes = pad(date.getUTCMonth() + 1);
    const ano = date.getUTCFullYear();
    const horas = pad(date.getUTCHours());
    const minutos = pad(date.getUTCMinutes());

    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  };

  const diasFormat = (data) => {
    const num = parseFloat(data);

    if (isNaN(num)) {
      return "-";
    }
    let numFormatado = num.toFixed(2);
    numFormatado = numFormatado.replace(".", ",");

    return `${numFormatado} d`;
  };

  const formatarDolar = (valor) => {
    const num = parseFloat(valor);

    if (isNaN(num)) {
      return "-";
    }

    return num.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const fetchTabelaConsolidado = () => {
    fetch(`${API_URL}/descarregamento/consolidado`, {
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
    navio,
    cliente,
    carvao_tipo,
    sistema,
    nor,
    atracacao,
    desatracacao,
    inicio_operacao,
    fim_operacao,
    dias_operando,
    dias_atracado,
    dias_base_75k,
    carga,
    produtividade,
    dias_de_demurrage,
    valor_demurrage_USD,
    demurrage_ou_despatch_aproximado,
    taxa_comercial,
    taxa_efetiva,
    meta,
    observacao
  ) {
    return {
      navio,
      cliente,
      carvao_tipo,
      sistema,
      nor,
      atracacao,
      desatracacao,
      inicio_operacao,
      fim_operacao,
      dias_operando,
      dias_atracado,
      dias_base_75k,
      carga,
      produtividade,
      dias_de_demurrage,
      valor_demurrage_USD,
      demurrage_ou_despatch_aproximado,
      taxa_comercial,
      taxa_efetiva,
      meta,
      observacao,
    };
  }

  useEffect(() => {
    const mappedRows = dados.map((d) =>
      createDados(
        d.navio,
        d.cliente,
        d.carvao_tipo,
        d.sistema,
        dataFormat(d.nor),
        dataFormat(d.atracacao),
        dataFormat(d.desatracacao),
        dataFormat(d.inicio_operacao),
        dataFormat(d.fim_operacao),
        diasFormat(d.dias_operando),
        diasFormat(d.dias_atracado),
        diasFormat(d.dias_base_75k),
        d.carga,
        d.produtividade,
        diasFormat(d.dias_de_demurrage),
        formatarDolar(d.valor_demurrage_USD),
        formatarDolar(d.demurrage_ou_despatch_aproximado),
        d.taxa_comercial,
        d.taxa_efetiva,
        diasFormat(d.meta),
        d.observacao
      )
    );
    setRows(mappedRows);
  }, [dados]);

  useEffect(() => {
    fetchTabelaConsolidado();
  }, []);

  return (
    <>
      <ModalConsolidado
        rowEdit3={rowEdit3}
        abrirModalConsolidado={abrirModalConsolidado}
        setAbrirModalConsolidado={setAbrirModalConsolidado}
      />
      <Button
        variant="contained"
        size="small"
        sx={{
          marginBottom: "10px",
        }}
        component={Link}
        to="/pptm/descarregamento/navios"
      >
        Voltar
      </Button>
      <div className="main-descarregamento-consolidado">
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 650 }}>
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
                            handleFilterChange2(column.id, e.target.value)
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
                {filteredRows.map((row) => (
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
        </Paper>
      </div>
    </>
  );
}
