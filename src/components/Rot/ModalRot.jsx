import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import NotifyBar from "../NotifyBar";

export default function ModalRot({
  confirmData,
  setConfirmData,
  setRotJSON,
  setFuncaoPDF,
  setDeHoje,
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [turno, setTurno] = useState("");

  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    setConfirmData(false);
    setData("");
    setTurno("");
  };

  function verificarTurno(dataTurno, turno) {
    const [year, month, day] = dataTurno.split("-").map(Number);
    const agora = new Date();
    const dataBase = new Date(year, month - 1, day);
    let inicio, fim;

    if (turno.toUpperCase() === "DIA") {
      inicio = new Date(dataBase);
      inicio.setHours(7, 30, 0, 0);
      fim = new Date(dataBase);
      fim.setHours(19, 30, 0, 0);
    } else if (turno.toUpperCase() === "NOITE") {
      inicio = new Date(dataBase);
      inicio.setHours(19, 30, 0, 0);
      fim = new Date(dataBase);
      fim.setDate(fim.getDate() + 1);
      fim.setHours(7, 30, 0, 0);
    } else {
      return "invalido";
    }

    if (agora >= inicio && agora < fim) {
      return "atual";
    } else if (agora < inicio) {
      return "futuro";
    } else {
      return "passado";
    }
  }

  const buscarJSON = async () => {
    try {
      const res = await fetch("http://localhost:3001/arquivo/rot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          data: data,
          turno: turno,
        }),
      });
      const dados = await res.json();

      if (!res.ok || dados.type !== "success") {
        return { success: false, message: dados.message, severity: dados.type };
      }

      return { success: true, dados: dados };
    } catch (error) {
      console.error("Erro em buscar dados do ROT:", error);
      return {
        success: false,
        message: "Erro ao buscar os dados!",
        severity: "error",
      };
    }
  };

  const Confirme = async () => {
    const rot = verificarTurno(data, turno);
    handleClose();
    setDeHoje(false);

    if (rot === "atual") {
      setLoading(true);
      const busca = await buscarJSON();

      if (!busca.success) {
        setLoading(false);
        setNotify({
          open: true,
          message: busca.message,
          severity: busca.severity,
        });
        return;
      }
      setLoading(false);
      setDeHoje(true);
      return setRotJSON(busca.dados.data[0]);
    } else {
      setLoading(true);
      const busca = await buscarJSON();

      if (!busca.success) {
        setLoading(false);
        setNotify({
          open: true,
          message: busca.message,
          severity: busca.severity,
        });
        return;
      }
      setLoading(false);
      setRotJSON(busca.dados.data[0]);
      return setFuncaoPDF(true);
    }
  };

  return (
    <div>
      {loading ? <LoadingSpinner /> : null}
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog
        open={confirmData}
        onClose={handleClose}
        aria-labelledby="modal-rot-title"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="modal-rot-title">Buscar ROT</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            margin="normal"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            label="Turno"
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
          >
            <MenuItem value="">Selecione</MenuItem>
            <MenuItem value="DIA">07:30 às 19:30</MenuItem>
            <MenuItem value="NOITE">19:30 às 07:30</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={Confirme}
            variant="contained"
            disabled={!data || !turno}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
