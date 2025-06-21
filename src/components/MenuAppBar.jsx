import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Divider, InputLabel } from "@mui/material";
import { TextField } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import { useUsuario } from "../contexts/useUsuario";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import NotifyBar from "../components/NotifyBar";

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { usuario } = useUsuario();
  const [open, setOpen] = useState(false);
  const [dadoInicial, setDadoInicial] = useState({});
  const navigate = useNavigate();

  const [conta, setConta] = useState({
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

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleModal = () => {
    setAnchorEl(null);

    fetch("http://localhost:3001/verificaLogin", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.loggedIn && data.usuario) {
          setConta({
            usuario: data.usuario.usuario,
            email: data.usuario.email,
          });
          setOpen(true);
        } else {
          setNotify({
            open: true,
            message: "Usuário não localizado no log!",
            severity: "error",
          });
          return;
        }
      });
  };

  const admin = () => {
    navigate("/pptm/admin");
    setAnchorEl(null);
    0;
  };

  const handleLogout = () => {
    setLoading(true);
    fetch("http://localhost:3001/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
          navigate("/");
        } else {
          return;
        }
      })
      .catch((err) => {
        console.error("Erro ao realizar logout:", err);
      });
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setDadoInicial({
      usuario: conta.usuario,
      email: conta.email,
    });

    if (conta.usuario === dadoInicial.usuario && !conta.senha) {
      setNotify({
        open: true,
        message: "Nada foi alterado!",
        severity: "info",
      });
      return;
    }

    if (conta.senha !== conta.senha2) {
      setNotify({
        open: true,
        message: "As seenhas não conferem!",
        severity: "error",
      });
      return;
    }

    fetch("http://localhost:3001/usuario", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario: conta.usuario,
        email: conta.email,
        senha: conta.senha,
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
          setTimeout(() => {
            setNotify({
              open: true,
              message: "Necessário fazer login novamente!",
              severity: "info",
            });
            setTimeout(() => {
              handleLogout();
            }, 2000);
          }, 3000);
          handleClose();
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
    <>
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
          {conta && (
            <form onSubmit={handleUpdate}>
              <TextField
                fullWidth
                label="Usuário *"
                value={conta.usuario}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    usuario: e.target.value,
                  })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                value={conta.email}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    email: e.target.value,
                  })
                }
                disabled
                margin="normal"
              />
              <InputLabel sx={{ marginTop: 2 }}>Alterar senha</InputLabel>
              <TextField
                fullWidth
                size="small"
                type="password"
                label="Nova senha"
                value={conta.senha}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    senha: e.target.value,
                  })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                size="small"
                type="password"
                label="Confirmação da nova senha"
                value={conta.senha2}
                onChange={(e) =>
                  setConta({
                    ...conta,
                    senha2: e.target.value,
                  })
                }
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                size="small"
                color="primary"
                sx={{ marginTop: 2 }}
              >
                Salvar alteração
              </Button>
              <Button
                onClick={handleClose}
                variant="contained"
                size="small"
                color="error"
                sx={{ marginTop: 2, marginLeft: 2 }}
              >
                Cancelar
              </Button>
            </form>
          )}
        </Box>
      </Modal>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100vw",
        }}
      >
        {loading ? <LoadingSpinner /> : null}
        <Link to="/pptm" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography variant="h6" component="div" sx={{ cursor: "pointer" }}>
            Portal PPTM
          </Typography>
        </Link>
        <div>
          <IconButton
            size="small"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <div style={{ marginRight: "5px" }}>{usuario.nome}</div>
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              {usuario && <span>{usuario.nome}</span>}
            </div>
            <Divider />
            {usuario.nivel !== null && usuario.nivel < 2 && (
              <MenuItem onClick={admin}>Administrador</MenuItem>
            )}
            <MenuItem onClick={handleModal}>Config. conta</MenuItem>
            <MenuItem onClick={handleLogout}>Sair</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </>
  );
}
