import { useEffect, useState } from "react";
import { useUsuario } from "../../contexts/useUsuario";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ModalEditarUsuario from "../../components/Admin/ModalEditarUsuario";
import NotifyBar from "../../components/NotifyBar";
import "./admin.css";

export default function Admin() {
  const [abrirModalEditarUsuario, setAbrirModalEditarUsuario] = useState(false);
  const [rowUsuario, setRowUsuario] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const { usuario } = useUsuario();
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    fetch(`${API_URL}/usuarios`, {
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
          setUsuarios(data.data);
        } else {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar usuários:", err);
        setNotify({
          open: true,
          message: "Erro ao buscar usuários",
          severity: "error",
        });
      });
  };

  const handleEdit = (user) => {
    setRowUsuario(user);
    setAbrirModalEditarUsuario(true);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    borderRadius: "12px",
    border: "none",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <ModalEditarUsuario
        abrirModalEditarUsuario={abrirModalEditarUsuario}
        setAbrirModalEditarUsuario={setAbrirModalEditarUsuario}
        rowUsuario={rowUsuario}
        usuario={usuario}
        setRowUsuario={setRowUsuario}
        fetchUsuarios={fetchUsuarios}
      />
      <Paper className="container-admin" elevation={3}>
        <Typography variant="h5" gutterBottom>
          CONFIGURAÇÃO DE USUÁRIO
        </Typography>
        <div className="tabela-scroll">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Usuário</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Nível</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.usuario}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.permissao}</TableCell>
                  <TableCell>
                    <Button
                      disabled={item.permissao === "ADMIN" ? true : false}
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(item)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </div>
  );
}
