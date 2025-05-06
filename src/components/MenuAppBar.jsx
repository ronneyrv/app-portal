import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LoadingSpinner from "./LoadingSpinner";

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [usuario, setUsuario] = useState({ nome: "", nivel: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const admin = () => {
    navigate("/pptm/admin");
    setAnchorEl(null);
    0;
  };

  useEffect(() => {
    fetch("http://localhost:3001/verificaLogin", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          console.error("HTTP status:", res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.loggedIn) {
          setUsuario({
            nome: data.user.usuario,
            nivel: data.user.nivel,
          });
        }
      })
      .catch((err) => {
        console.error("Erro ao verificar login:", err);
      });
  }, []);

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
          setUsuario("");
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

  return (
    <Toolbar
      sx={{ display: "flex", justifyContent: "space-between", width: "100vw" }}
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
          {usuario.nivel === "admin" && (
            <MenuItem onClick={admin}>Administrador</MenuItem>
          )}
          <MenuItem onClick={handleClose}>Configuração</MenuItem>
          <MenuItem onClick={handleLogout}>Sair</MenuItem>
        </Menu>
      </div>
    </Toolbar>
  );
}
