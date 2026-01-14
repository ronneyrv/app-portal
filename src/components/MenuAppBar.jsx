import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUsuario } from "../contexts/useUsuario";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";
import NotifyBar from "../components/NotifyBar";
import ModalEditarSenha from "./Admin/ModalEditarSenha";

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { usuario } = useUsuario();
  const [openModal, setOpenModal] = useState(false);
  const [conta, setConta] = useState({
    usuario: "",
    email: "",
  });
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    fetchConta();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenModal(false);
  };

  const fetchConta = () => {
    fetch(`${API_URL}/verificaLogin`, {
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
        } else {
          setAnchorEl(null);
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
    fetch(`${API_URL}/logout`, {
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
  };

  return (
    <>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <ModalEditarSenha
        openModal={openModal}
        setOpenModal={setOpenModal}
        conta={conta}
        handleLogout={handleLogout}
      />
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
              vertical: "bottom",
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
            {usuario.nivel !== null && usuario.nivel < 4 && (
              <MenuItem onClick={admin}>Administrador</MenuItem>
            )}
            <MenuItem onClick={() => { setOpenModal(true); setAnchorEl(null); }}>
              Alterar Senha
            </MenuItem>
            <MenuItem onClick={handleLogout}>Sair</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </>
  );
}
