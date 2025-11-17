import { useState, useEffect } from "react";
import { useUsuario } from "../../contexts/useUsuario";
import NotifyBar from "../NotifyBar";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import "./estoqueporpilha.css";

const calculoEstoqueDiaBase = (volume, cliente) => {
  let estoqueDia;
  if (cliente === "ENEVA") {
    estoqueDia = volume / 3255;
  } else {
    estoqueDia = volume / 6880;
  }

  return Math.floor(estoqueDia);
};

const calculoEstoqueDiaReduzida = (volume, cliente) => {
  let estoqueDia;
  if (cliente === "ENEVA") {
    estoqueDia = volume / 2200;
  } else {
    estoqueDia = volume / 4400;
  }

  return Math.floor(estoqueDia);
};

const columns = [
  { id: "cliente", label: "CLIENTE", minWidth: 200 },
  { id: "pilha", label: "PILHA", width: 80 },
  { id: "volume_total", label: "VOLUME", width: 80 },
  { id: "dia_base", label: "DIAS CARGA BASE", width: 100 },
  { id: "dia_reduzida", label: "DIAS CARGA REDUZIDA", width: 100 },
];

const createDados = (cliente, pilha, volume_total, dia_base, dia_reduzida) => {
  return {
    cliente,
    pilha,
    volume_total,
    dia_base,
    dia_reduzida,
  };
};

export default function EstoquePorpPlha({
  setAbrirModalEstoquePorPilha,
  setIdEdit,
  estoquePilhas,
  fetchVolumePilhaGeral,
}) {
  const [rows, setRows] = useState([]);
  const { usuario } = useUsuario();
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const abrirModal = (row) => {
    let id = row.pilha;
    if (row.volume_total === 0) {
      return setNotify({
        open: true,
        message: "Pilha vazia!",
        severity: "info",
      });
    }

    if (usuario.nivel > 6) {
      return setNotify({
        open: true,
        message: "Você não tem permissao para alterar!",
        severity: "info",
      });
    }

    setIdEdit(id);
    setAbrirModalEstoquePorPilha(true);
  };

  useEffect(() => {
    if (!estoquePilhas) return;
    const mappedRows = estoquePilhas.map((d) =>
      createDados(
        d.cliente,
        d.pilha,
        d.volume_total,
        calculoEstoqueDiaBase(d.volume_total, d.cliente),
        calculoEstoqueDiaReduzida(d.volume_total, d.cliente)
      )
    );
    setRows(mappedRows);
  }, [estoquePilhas]);

  useEffect(() => {
    fetchVolumePilhaGeral();
  }, []);

  return (
    <div className="main-pilhas-estoque">
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <h3>Estoque por Pilha</h3>
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
                      onClick={() => abrirModal(item)}
                      style={{
                        backgroundColor: "#f9f9f9",
                        padding: "0",
                        cursor: "pointer",
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
