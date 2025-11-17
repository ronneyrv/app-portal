import { useEffect, useState } from "react";
import ModalAddPolimero from "../../components/Polimero/ModalAddPolimero";
import ModalEditarPolimero from "../../components/Polimero/ModalEditarPolimero";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import NotifyBar from "../../components/NotifyBar";
import {
  Box,
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "./polimero.css";
import PolimeroEstoque from "../../components/Polimero/PolimeroEstoque";

const formatarData = (dataISO) => {
  if (!dataISO) return "";
  const data = new Date(dataISO);
  const dia = String(data.getUTCDate()).padStart(2, "0");
  const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
  const ano = data.getUTCFullYear();

  return `${dia}/${mes}/${ano}`;
};

const columns = [
  { id: "data", label: "DATA", minWidth: 80 },
  { id: "tipo", label: "TIPO", minWidth: 50 },
  { id: "volume", label: "VOLUME", minWidth: 50 },
  { id: "pilha", label: "PILHA", minWidth: 50 },
  { id: "responsavel", label: "RESPONSÁVEL", minWidth: 70 },
  { id: "observacao", label: "OBSERVAÇÃO", minWidth: 100 },
  { id: "editar", label: "EDIÇÃO", minWidth: 50 },
];

const createDados = (
  id,
  data,
  tipo,
  volume,
  pilha,
  responsavel,
  observacao
) => {
  return {
    id,
    data,
    tipo,
    volume,
    pilha,
    responsavel,
    observacao,
  };
};

export default function Polimero() {
  const [abrirModalEditarPolimero, setAbrirModalEditarPolimero] =
    useState(false);
  const [abrirModalAddPolimero, setAbrirModalAddPolimero] = useState(false);
  const [estoquePolimero, setEstoquePolimero] = useState([]);
  const [polimero, setPolimero] = useState([]);
  const [rowEdit, setRowEdit] = useState([]);
  const [rows, setRows] = useState([]);
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleEdit = (row) => {
    setRowEdit(row);
    setAbrirModalEditarPolimero(true);
  };

  const fetchPolimero = () => {
    fetch(`${API_URL}/polimero/aplicacao`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setPolimero(data.data);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  const fetchEstoquePolimero = () => {
    fetch(`${API_URL}/polimero/volume`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setEstoquePolimero(data.data);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  useEffect(() => {
    if (!polimero) return;
    const mappedRows = polimero.map((d) =>
      createDados(
        d.id_aplicacao,
        formatarData(d.data),
        d.tipo,
        d.volume,
        d.pilha,
        d.responsavel,
        d.observacao
      )
    );
    setRows(mappedRows);
  }, [polimero]);

  useEffect(() => {
    fetchPolimero();
    fetchEstoquePolimero();
  }, []);

  return (
    <div className="main-polimero">
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <ModalEditarPolimero
        abrirModalEditarPolimero={abrirModalEditarPolimero}
        setAbrirModalEditarPolimero={setAbrirModalEditarPolimero}
        fetchEstoquePolimero={fetchEstoquePolimero}
        rowEdit={rowEdit}
        fetchPolimero={fetchPolimero}
      />
      <ModalAddPolimero
        abrirModalAddPolimero={abrirModalAddPolimero}
        setAbrirModalAddPolimero={setAbrirModalAddPolimero}
        fetchEstoquePolimero={fetchEstoquePolimero}
        fetchPolimero={fetchPolimero}
      />
      <PolimeroEstoque estoquePolimero={estoquePolimero} />
      <Box display="flex" gap={1}>
        <Button
          variant="contained"
          size="small"
          sx={{
            margin: "4px",
          }}
          onClick={() => setAbrirModalAddPolimero(true)}
        >
          Adicionar
        </Button>
      </Box>
      <Divider />
      <div className="main-table-polimero">
        <h3>CONTROLE DE POLÍMERO</h3>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ height: 400 }}>
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
                              padding: "0"
                            }}
                          >
                            <EditSquareIcon
                              sx={{ cursor: "pointer", marginRight: 1 }}
                              onClick={() => handleEdit(item)}
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
                            padding: "0"
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
    </div>
  );
}
