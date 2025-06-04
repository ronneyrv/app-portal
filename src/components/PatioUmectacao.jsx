import { useEffect, useState } from "react";
import GppGoodIcon from "@mui/icons-material/GppGood";
import GppBadIcon from "@mui/icons-material/GppBad";
import SignalWifiStatusbar4BarIcon from "@mui/icons-material/SignalWifiStatusbar4Bar";
import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";
import SignalWifiConnectedNoInternet4Icon from "@mui/icons-material/SignalWifiConnectedNoInternet4";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import NotifyBar from "../components/NotifyBar";

import "../styles/patioumectacao.css";

export default function PatioUmectacao() {
  const [disponivel, setDisponivel] = useState(0);
  const [statusSelecionado, setStatusSelecionado] = useState(null);
  const [open, setOpen] = useState(false);

  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchUmectacao();
  }, []);

  const handleStatus = (st) => {
    setStatusSelecionado(st);
    setOpen(true);
  };

  const fetchUmectacao = () => {
    fetch("http://localhost:3001/canhao/sistema", {
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
          setDisponivel(data.data[0].disponivel);
        } else {
          console.error("Erro ao buscar canhoes");
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/canhao/sistema`, {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ disponivel: statusSelecionado }),
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
          fetchUmectacao();
        } else {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
        }
      })
      .catch((err) => {
        console.error("Erro na base de dados:", err);
        setNotify({
          open: true,
          message: "Erro ao atualizar o status.",
          severity: "error",
        });
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: "12px",
            border: "none",
            boxShadow: 24,
            p: 2,
          }}
        >
          {
            <form onSubmit={handleUpdateStatus}>
              <div style={{ width: "100%", textAlign: "center" }}>
                <Typography variant="h4">Sistema de Umectação</Typography>
              </div>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={statusSelecionado}
                  label="Status"
                  onChange={(e) => setStatusSelecionado(e.target.value)}
                >
                  <MenuItem value="1">DISPONÍVEL</MenuItem>
                  <MenuItem value="0">INDISPONÍVEL</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary">
                Salvar
              </Button>
            </form>
          }
        </Box>
      </Modal>

      <div className="umectacao">
        <h3>Sistema de Umectação</h3>
        <div>
          <div
            className="umectacao-status"
            onClick={() => handleStatus(disponivel)}
          >
            {disponivel === 1 ? (
              <>
                <GppGoodIcon style={{ fontSize: 20, color: "#76ff03" }} />
                <h4>Sistema Disponível</h4>
              </>
            ) : (
              <>
                <GppBadIcon style={{ fontSize: 20, color: "#ff1744" }} />
                <h4>Sistema Indisponível</h4>
              </>
            )}
          </div>
          <div className="umectacao-legenda">
            <label>Legenda:</label>
            <div className="legenda">
              <div>
                <SignalWifiStatusbar4BarIcon
                  style={{ fontSize: 15, color: "#76ff03" }}
                />
                <span>DISPONÍVEL</span>
              </div>
              <div>
                <SignalWifiOffIcon style={{ fontSize: 15, color: "#757575" }} />
                <span>DESABILITADO</span>
              </div>
              <div>
                <SignalWifiConnectedNoInternet4Icon
                  style={{ fontSize: 15, color: "#FF0000" }}
                />
                <span>INDISPONÍVEL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
