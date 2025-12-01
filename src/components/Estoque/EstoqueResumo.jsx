import { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import "./estoqueporpilha.css";

const columns = [
  { id: "cliente", label: "CLIENTE", minWidth: 150 },
  { id: "pilha", label: "PILHA", width: 80 },
  { id: "volume_total", label: "VOLUME", width: 80 },
];

const createDados = (cliente, pilha, volume_total) => {
  return {
    cliente,
    pilha,
    volume_total,
  };
};

export default function EstoqueResumo() {
  const [valores, setValores] = useState([]);
  const [rows, setRows] = useState([]);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  useEffect(() => {
    if (!valores) return;
    const mappedRows = valores.map((d) =>
      createDados(d.cliente, d.pilha, d.volume_total)
    );
    setRows(mappedRows);
  }, [valores]);

  useEffect(() => {
    fetch(`${API_URL}/estoque/por/pilha`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setValores(data.data);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  }, []);

  return (
    <div className="main-pilhas-estoque-resumo">
      <h2>Estoque por Pilha</h2>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column.id}
                  align="center"
                  style={{
                    minWidth: column.minWidth,
                    width: column.width,
                    backgroundColor: "#eaeaecff",
                    fontWeight: "bold",
                    padding: "0px",
                    fontSize: "14px",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((item, indexLinha) => (
              <TableRow key={indexLinha} title={item.pilha}>
                {columns.map((column) => {
                  const value = item[column.id];
                  return (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{
                        backgroundColor: "#f9f9f9",
                        padding: "0",
                        marginRight: 1,
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
    </div>
  );
}
