import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import NotifyBar from "../NotifyBar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  MenuItem,
} from "@mui/material";

export default function ModalEditarUsuario({
  abrirModalEditarUsuario,
  setAbrirModalEditarUsuario,
  rowUsuario,
  usuario,
  setRowUsuario,
  fetchUsuarios,
}) {
  const [loading, setLoading] = useState(false);
  const [formUser, setFormUser] = useState({
    id: "",
    usuario: "",
    email: "",
    nivel: "",
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;
  const nivelUsuarioLogado = usuario.nivel;

  const handleClose = () => {
    setAbrirModalEditarUsuario(false);
    setRowUsuario([]);
  };

  const handleDelete = () => {
    let id = formUser.id;

    fetch(`${API_URL}/usuario/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type == "success") {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
          fetchUsuarios();
          handleClose();
        } else {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let id = formUser.id;

    if (!id) {
      setNotify({
        open: true,
        message: "Usuário não localizado",
        severity: "info",
      });
      return;
    }

    if (!formUser.usuario || !formUser.email || !formUser.nivel) {
      setNotify({
        open: true,
        message: "Dados obrigatórios",
        severity: "info",
      });
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/usuario`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ dados: formUser }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type == "success") {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
          fetchUsuarios();
          handleClose();
        } else {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
        }
        setLoading(false);
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  useEffect(() => {
    if (!rowUsuario || rowUsuario.length === 0) return;
    setLoading(false);
    setFormUser({
      id: rowUsuario.id,
      usuario: rowUsuario.usuario,
      email: rowUsuario.email,
      permissao: rowUsuario.permissao,
      nivel: rowUsuario.nivel,
    });
  }, [rowUsuario]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog
        open={abrirModalEditarUsuario}
        onClose={handleClose}
        disableRestoreFocus
        fullWidth
      >
        <DialogContent sx={{ p: 3 }}>
          <DialogTitle>Editar Usuário</DialogTitle>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={1} alignItems="center" mt={1}>
              <TextField
                disabled
                fullWidth
                size="small"
                margin="dense"
                name="usuario"
                label="Usuário"
                variant="outlined"
                value={formUser.usuario}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                disabled
                fullWidth
                size="small"
                margin="dense"
                name="email"
                label="Email"
                variant="outlined"
                value={formUser.email}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                required
                fullWidth
                select
                size="small"
                margin="dense"
                name="nivel"
                label="Nível de Acesso"
                variant="outlined"
                value={formUser.nivel}
                onChange={handleChange}
              >
                <MenuItem
                  value="1"
                  disabled={nivelUsuarioLogado == "1" ? false : true}
                >
                  ADMIN
                </MenuItem>
                <MenuItem value="2">DEV</MenuItem>
                <MenuItem value="3">GERÊNCIA</MenuItem>
                <MenuItem value="5">ANÁLITICO</MenuItem>
                <MenuItem value="6">SUPERVISÃO</MenuItem>
                <MenuItem value="7">OPERAÇÃO</MenuItem>
                <MenuItem value="9">MANUTENÇÃO</MenuItem>
                <MenuItem value="10">VISITANTE</MenuItem>
              </TextField>
            </Box>
            <Button
              onClick={handleDelete}
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ mt: 3 }}
            >
              EXCLUIR USUÁRIO
            </Button>
            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Cancelar
              </Button>
              <Box sx={{ m: 1, position: "relative" }}>
                <Button type="submit" variant="contained" disabled={loading}>
                  Salvar
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
              </Box>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
