import React, { useEffect, useState } from "react";
import axios from "axios";
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
import NotificationSnackbar from "../components/NotificationSnackbar";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import "../styles/admin.css";

export default function Admin() {
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:3001/usuarios", {
        withCredentials: true,
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  const handleEdit = (user) => {
    setUsuarioSelecionado(user);
    setOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/usuarios/${usuarioSelecionado.id}`,
        usuarioSelecionado
      );
      setSnackbar({
        open: true,
        message: "Usuário atualizado com sucesso!",
        severity: "success",
      });

      handleClose();
      fetchUsuarios();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      setSnackbar({
        open: true,
        message: "Erro ao atualizar usuário.",
        severity: "error",
      });
    }
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
      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="nivel-label">Nível</InputLabel>
                <Select
                  labelId="nivel-label"
                  value={usuarioSelecionado.nivel_permissao}
                  label="Nível"
                  onChange={(e) =>
                    setUsuarioSelecionado({
                      ...usuarioSelecionado,
                      nivel_permissao: e.target.value,
                    })
                  }
                >
                  <MenuItem value="visitante">Visitante</MenuItem>
                  <MenuItem value="manutencao">Manutenção</MenuItem>
                  <MenuItem value="operacao">Operação</MenuItem>
                  <MenuItem value="supervisao">Supervisão</MenuItem>
                  <MenuItem value="analistico">Analístico</MenuItem>
                  <MenuItem value="gerencia">Gerencia</MenuItem>
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
                  <TableCell>{item.nivel_permissao}</TableCell>
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
