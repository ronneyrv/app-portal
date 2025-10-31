import { useState, useEffect } from "react";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "./tabelaEditaTaxa.css";

const formatData = (dataISO) => {
  if (!dataISO) return "";

  const data = new Date(dataISO);

  if (isNaN(data.getTime())) {
    return "Data Inválida";
  }

  const opcoes = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return data.toLocaleString("pt-BR", opcoes).replace(",", "");
};

const columns = [
  { id: "inicio", label: "INÍCIO", minWidth: 110 },
  { id: "fim", label: "FIM", minWidth: 110 },
  { id: "classificacao", label: "OCORRÊNCIA", minWidth: 70 },
  { id: "especialidade", label: "ESPECIALIDADE", minWidth: 70 },
  { id: "maquina", label: "EQUIPAMENTO", minWidth: 80 },
  { id: "ug", label: "UNIDADE", minWidth: 50 },
  { id: "pilha", label: "PILHA", minWidth: 50 },
  { id: "volume", label: "VOLUME", minWidth: 50 },
  { id: "observacao", label: "OBSERVAÇÃO", minWidth: 150 },
  { id: "editar", label: "EDIÇÃO", minWidth: 50 },
];

const createDados = (
  id,
  inicio,
  fim,
  classificacao,
  especialidade,
  maquina,
  ug,
  pilha,
  volume,
  observacao
) => {
  return {
    id,
    inicio,
    fim,
    classificacao,
    especialidade,
    maquina,
    ug,
    pilha,
    volume,
    observacao,
  };
};

export default function TabelaEditaTaxa({
  editar,
  setAbrirModalConfirm,
  setAbrirModalEditarRetoma,
  setTextConfirm,
  setRowEdit,
  setDeletID,
  valoresRetoma,
  fetchValores,
}) {
  const [rows, setRows] = useState([]);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleEdit = (row) => {
    setRowEdit(row);
    setAbrirModalEditarRetoma(true);
  };

  const handleDelet = (row) => {
    setTextConfirm(`Deletar o ${row.classificacao} de ${row.inicio}?`);
    setDeletID(row.id);
    setAbrirModalConfirm(true);
  };

  useEffect(() => {
    if (!valoresRetoma) return;
    const mappedRows = valoresRetoma.map((d) =>
      createDados(
        d.id,
        formatData(d.inicio),
        formatData(d.fim),
        d.classificacao,
        d.especialidade,
        d.maquina,
        d.ug,
        d.pilha,
        d.volume,
        d.observacao
      )
    );
    setRows(mappedRows);
  }, [valoresRetoma]);

  useEffect(() => {
    if (!editar) return;
    fetchValores();
  }, [editar]);

  return (
    <div className="main-tabela-edita-taxa">
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
                    if (column.id === "editar") {
                      return (
                        <TableCell
                          key={column.id}
                          align="center"
                          style={{
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          <EditSquareIcon
                            sx={{ cursor: "pointer", marginRight: 1 }}
                            onClick={() => handleEdit(item)}
                          />
                          <DeleteSweepIcon
                            sx={{ cursor: "pointer", color: "red" }}
                            onClick={() => handleDelet(item)}
                          />
                        </TableCell>
                      );
                    }
                    const value = item[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{
                          backgroundColor: "#f9f9f9",
                        }}
                      >
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
  );
}
