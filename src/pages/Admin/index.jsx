import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import NotifyBar from "../../components/NotifyBar";
import "./admin.css";

export default function Admin() {
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
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
    setUsuarioSelecionado(user);
    setOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    fetch(`${API_URL}/usuario`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario: usuarioSelecionado.usuario,
        email: usuarioSelecionado.email,
        permissao: usuarioSelecionado.permissao,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("HTTP status:", res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.type === "success") {
          setNotify({
            open: true,
            message: data.message,
            severity: "success",
          });
          handleClose();
          fetchUsuarios();
        } else {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
        }
      })
      .catch((err) => {
        console.error("Erro de rede ou algo muito grave:", err);
        setNotify({
          open: true,
          message: "Erro ao atualizar usuário.",
          severity: "error",
        });
      });
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {usuarioSelecionado && (
            <form onSubmit={handleUpdate}>
              <TextField
                fullWidth
                label="Usuário"
                value={usuarioSelecionado.usuario}
                onChange={(e) =>
                  setUsuarioSelecionado({
                    ...usuarioSelecionado,
                    usuario: e.target.value,
                  })
                }
                disabled
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                value={usuarioSelecionado.email}
                onChange={(e) =>
                  setUsuarioSelecionado({
                    ...usuarioSelecionado,
                    email: e.target.value,
                  })
                }
                disabled
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="nivel-label">Nível</InputLabel>
                <Select
                  labelId="nivel-label"
                  value={usuarioSelecionado.permissao}
                  label="Nível"
                  onChange={(e) =>
                    setUsuarioSelecionado({
                      ...usuarioSelecionado,
                      permissao: e.target.value,
                    })
                  }
                >
                  <MenuItem value="visitante">Visitante</MenuItem>
                  <MenuItem value="manutencao">Manutenção</MenuItem>
                  <MenuItem value="operacao">Operação</MenuItem>
                  <MenuItem value="supervisao">Supervisão</MenuItem>
                  <MenuItem value="analistico">Analístico</MenuItem>
                  <MenuItem value="gerencia">Gerencia</MenuItem>
                  <MenuItem value="desenvolvedor">Dev</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>

              <Button type="submit" variant="contained" color="primary">
                Atualizar
              </Button>
            </form>
          )}
        </Box>
      </Modal>

      <Paper className="container-admin" elevation={3}>
        <Typography variant="h5" gutterBottom>
          CONFIGURAÇÕES
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
