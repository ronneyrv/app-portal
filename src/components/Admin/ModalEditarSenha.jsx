import { useEffect, useState } from "react";
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
} from "@mui/material";

export default function ModalEditarSenha({
  openModal,
  setOpenModal,
  conta,
  handleLogout,
}) {
  const [loading, setLoading] = useState(false);
  const [formUser, setFormUser] = useState({
    usuario: "",
    email: "",
    senha: "",
    senha2: "",
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setOpenModal(false);
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

    if (formUser.senha === "" || formUser.senha2 === "") {
      setNotify({
        open: true,
        message: "Insira as senhas!",
        severity: "info",
      });
      return;
    }

    if (formUser.senha !== formUser.senha2) {
      setNotify({
        open: true,
        message: "As senhas não conferem!",
        severity: "error",
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
          setTimeout(() => {
            handleLogout();
          }, 3000);
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
    if (!conta || conta.length === 0) return;
    setLoading(false);
    setFormUser({
      usuario: conta.usuario,
      email: conta.email,
    });
  }, [conta]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog open={openModal} onClose={handleClose} disableRestoreFocus fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <DialogTitle>Alterar Senha</DialogTitle>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={1} alignItems="center">
              <TextField
                disabled
                fullWidth
                size="small"
                margin="dense"
                name="usuario"
                label="Usuário"
                variant="outlined"
                value={formUser.usuario}
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
              />
            </Box>
            <Box display="flex" gap={1} mt={2}>
              <TextField
                required
                fullWidth
                type="password"
                size="small"
                margin="dense"
                name="senha"
                label="Nova senha"
                variant="standard"
                value={formUser.senha}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                required
                fullWidth
                type="password"
                size="small"
                margin="dense"
                name="senha2"
                label="Repita a nova senha"
                variant="standard"
                value={formUser.senha2}
                onChange={handleChange}
              />
            </Box>
            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Cancelar
              </Button>
              <Box sx={{ m: 1, position: "relative" }}>
                <Button type="submit" variant="contained" disabled={loading}>
                  Salvar alteração
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
