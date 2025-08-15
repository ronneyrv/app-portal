import { useState, useEffect } from "react";
import SignalWifiStatusbar4BarIcon from "@mui/icons-material/SignalWifiStatusbar4Bar";
import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";
import SignalWifiConnectedNoInternet4Icon from "@mui/icons-material/SignalWifiConnectedNoInternet4";
import Divider from "@mui/material/Divider";
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

import NotifyBar from "../NotifyBar";

import alturas from "../../assets/config/DataAlturas";

import "./patio.css";

export default function Patio({ setPatioJson, dadosJSON }) {
  const [canhoes, setCanhoes] = useState([]);
  const [canhaoSelecionado, setCanhaoSelecionado] = useState(null);
  const [modoSelecionado, setModoSelecionado] = useState(null);
  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;
  
  useEffect(() => {
    setPatioJson(canhoes);
  }, [canhoes]);
  
  useEffect(() => {
    let dadosParaSetar;
    if (dadosJSON) {
      try {
        dadosParaSetar = JSON.parse(dadosJSON.patio);
        setCanhoes(dadosParaSetar);
      } catch (error) {
        console.error("Erro ao fazer parse do JSON:", error);
      }
    } else {
      fetchCanhoes();
    }
  }, [dadosJSON]);

  const iconMap = {
    disponivel: (
      <SignalWifiStatusbar4BarIcon
        sx={{
          fontSize: 20,
          color: "#76ff03",
        }}
      />
    ),
    indisponivel: (
      <SignalWifiConnectedNoInternet4Icon
        sx={{
          fontSize: 20,
          color: "#FF0000",
        }}
      />
    ),
    desabilitado: (
      <SignalWifiOffIcon
        sx={{
          fontSize: 20,
          color: "#757575",
        }}
      />
    ),
  };

  const rotationMap = {
    cima: "0deg",
    baixo: "180deg",
  };

  const handleClose = () => setOpen(false);

  const configCanhao = (id, modo) => {
    setCanhaoSelecionado(id);
    setModoSelecionado(modo);
    setOpen(true);
  };

  const calcEstiloTopo = (id, altura) => {
    if (id.startsWith("2")) {
      const padding = 45 - altura * 2.1;
      const margin = altura * 2;
      return {
        padding: `${padding}px`,
        margin: `${margin}px`,
      };
    }

    const padding = 20 - altura * 1.8;
    const margin = altura * 1.8;
    return {
      padding: `${padding}px`,
      margin: `${margin}px`,
    };
  };

  const renderPilha = (id) => (
    <div className={`topo-${id}`} style={calcEstiloTopo(id, alturas[id])}>
      {id}
    </div>
  );

  const fetchCanhoes = () => {
    fetch(`${API_URL}/canhoes`, {
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
          setCanhoes(data.data);
        } else {
          console.error("Erro ao buscar canhoes");
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  };

  const handleUpdateCanhao = async (e) => {
    e.preventDefault();
    fetch(`${API_URL}/canhao`, {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ can: canhaoSelecionado, modo: modoSelecionado }),
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
          fetchCanhoes();
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
          message: "Erro ao atualizar usuário.",
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
            <form onSubmit={handleUpdateCanhao}>
              <div style={{ width: "100%", textAlign: "center" }}>
                <Typography variant="h4">{canhaoSelecionado}</Typography>
              </div>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={modoSelecionado}
                  label="Status"
                  onChange={(e) => setModoSelecionado(e.target.value)}
                >
                  <MenuItem value="disponivel">DISPONÍVEL</MenuItem>
                  <MenuItem value="indisponivel">INDISPONÍVEL</MenuItem>
                  <MenuItem value="desabilitado">DESABILITADO</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary">
                Salvar
              </Button>
            </form>
          }
        </Box>
      </Modal>

      <div className=" layout">
        <div className="patio">
          <div className="patio-3">
            <div className="can-linha-6">
              {[...canhoes.slice(45, 54).reverse()].map((item, index) => {
                const IconComponent = iconMap[item.modo];
                const rotation = rotationMap[item.posicao] || "0deg";
                return (
                  <div key={index} title={item.can}>
                    <span
                      style={{
                        display: "inline-block",
                        transform: `rotate(${rotation})`,
                        cursor: "pointer",
                      }}
                      onClick={() => configCanhao(item.can, item.modo)}
                    >
                      {IconComponent}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="pilhas">
              <div className="pilha-3B">{renderPilha("3B")}</div>
              <div className="pilha-3A">{renderPilha("3A")}</div>
            </div>
            <div className="can-linha-5">
              {[...canhoes.slice(36, 45).reverse()].map((item, index) => {
                const IconComponent = iconMap[item.modo];
                const rotation = rotationMap[item.posicao] || "0deg";
                return (
                  <div key={index} title={item.can}>
                    <span
                      style={{
                        display: "inline-block",
                        transform: `rotate(${rotation})`,
                        cursor: "pointer",
                      }}
                      onClick={() => configCanhao(item.can, item.modo)}
                    >
                      {IconComponent}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <Divider />
          <div className="patio-2">
            <div className="can-linha-4">
              {[...canhoes.slice(27, 36).reverse()].map((item, index) => {
                const IconComponent = iconMap[item.modo];
                const rotation = rotationMap[item.posicao] || "0deg";
                return (
                  <div key={index} title={item.can}>
                    <span
                      style={{
                        display: "inline-block",
                        transform: `rotate(${rotation})`,
                        cursor: "pointer",
                      }}
                      onClick={() => configCanhao(item.can, item.modo)}
                    >
                      {IconComponent}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="pilhas">
              <div className="pilha-2D">{renderPilha("2D")}</div>
              <div className="pilha-2C">{renderPilha("2C")}</div>
              <div className="pilha-2B">{renderPilha("2B")}</div>
              <div className="pilha-2A">{renderPilha("2A")}</div>
            </div>
            <div className="can-linha-3">
              {[...canhoes.slice(18, 27).reverse()].map((item, index) => {
                const IconComponent = iconMap[item.modo];
                const rotation = rotationMap[item.posicao] || "0deg";
                return (
                  <div key={index} title={item.can}>
                    <span
                      style={{
                        display: "inline-block",
                        transform: `rotate(${rotation})`,
                        cursor: "pointer",
                      }}
                      onClick={() => configCanhao(item.can, item.modo)}
                    >
                      {IconComponent}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <Divider />
          <div className="patio-1">
            <div className="can-linha-2">
              {[...canhoes.slice(9, 18).reverse()].map((item, index) => {
                const IconComponent = iconMap[item.modo];
                const rotation = rotationMap[item.posicao] || "0deg";
                return (
                  <div key={index} title={item.can}>
                    <span
                      style={{
                        display: "inline-block",
                        transform: `rotate(${rotation})`,
                        cursor: "pointer",
                      }}
                      onClick={() => configCanhao(item.can, item.modo)}
                    >
                      {IconComponent}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pilhas">
              <div className="pilha-1B">{renderPilha("1B")}</div>
              <div className="pilha-1A">{renderPilha("1A")}</div>
            </div>

            <div className="can-linha-1">
              {[...canhoes.slice(0, 9).reverse()].map((item, index) => {
                const IconComponent = iconMap[item.modo];
                const rotation = rotationMap[item.posicao] || "0deg";
                return (
                  <div key={index} title={item.can}>
                    <span
                      style={{
                        display: "inline-block",
                        transform: `rotate(${rotation})`,
                        cursor: "pointer",
                      }}
                      onClick={() => configCanhao(item.can, item.modo)}
                    >
                      {IconComponent}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
