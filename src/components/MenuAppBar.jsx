import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import { Divider } from "@mui/material";

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [usuario, setUsuario] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    axios
      .get("http://localhost:3001/verificaLogin", { withCredentials: true })
      .then((response) => {
        if (response.data.loggedIn) {
          setUsuario(response.data.user.usuario);
        }
      })
      .catch((error) => {
        console.error("Erro ao verificar login:", error);
      });
  }, []);

  const handleLogout = () => {
    setLoading(true);
    axios
      .post("http://localhost:3001/logout", {}, { withCredentials: true })
      .then(() => {
        setUsuario("");
        navigate("/");
      })
      .catch((error) => {
        console.error("Erro ao realizar logout:", error);
      })
      .finally(() => {
        setLoading(false);
      });
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
          <div style={{marginRight: '5px'}}>{usuario}</div>
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
              fontWeight: "bold"
            }}
          >
            {usuario && <span>{usuario}</span>}
          </div>
          <Divider />
          <MenuItem onClick={handleClose}>Configuração</MenuItem>
          <MenuItem onClick={handleLogout}>Sair</MenuItem>
        </Menu>
      </div>
    </Toolbar>
  );
}
