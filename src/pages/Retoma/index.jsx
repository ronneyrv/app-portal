import { useEffect, useState } from "react";
import { useUsuario } from "../../contexts/useUsuario";
import ModalEditarRetoma from "../../components/Retoma/ModalEditarRetoma";
import ModalAddRetoma from "../../components/Retoma/ModalAddRetoma";
import NotifyBar from "../../components/NotifyBar";
import TabelaStacker1 from "../../components/Retoma/TabelaStacker1";
import TabelaStacker2 from "../../components/Retoma/TabelaStacker2";
import TabelaEscavadeira from "../../components/Retoma/TabelaEscavadeira";
import TabelaEditaTaxa from "../../components/Retoma/TabelaEditaTaxa";
import ModalConfirm from "../../components/ModalConfirm";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import "./retoma.css";

export default function Retoma() {
  const [abrirModalRetoma, setAbrirModalRetoma] = useState(false);
  const [abrirModalEditarRetoma, setAbrirModalEditarRetoma] = useState(false);
  const [abrirModalConfirm, setAbrirModalConfirm] = useState(false);
  const [editar, setEditar] = useState(false);
  const [retomado, setRetomado] = useState([]);
  const [rowEdit, setRowEdit] = useState([]);
  const [valoresRetoma, setValoresRetoma] = useState([]);
  const [textConfirm, setTextConfirm] = useState("");
  const [deletID, setDeletID] = useState("");
  const { usuario } = useUsuario();
  const [formData, setFormData] = useState({
    data: "",
    turno: "",
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const confirmOK = () => {
    fetch(`${API_URL}/retoma/deletar/${deletID}`, {
      method: "DELETE",
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
          setAbrirModalConfirm(false);
          setDeletID("");
          fetchValores();
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

  const confirmNO = () => {
    setAbrirModalConfirm(false);
    setTextConfirm("");
    setDeletID("");
  };

  const addRow = (tipo) => {
    if (!formData.data || !formData.turno) {
      setNotify({
        open: true,
        message: "Informe a Data e o Turno",
        severity: "info",
      });
      return;
    }
    setAbrirModalRetoma(true);
    setFormData((prevData) => ({
      ...prevData,
      classificacao: tipo,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchValores = () => {
    if (!editar) return;

    fetch(`${API_URL}/retoma/listar`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setValoresRetoma(data.data);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  const fetchRetoma = () => {
    if (!formData.data || !formData.turno) return;

    fetch(`${API_URL}/retoma/listar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        data: formData.data,
        turno: formData.turno,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRetomado([]);
        if (data.type === "success") {
          setRetomado(data.data);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  useEffect(() => {
    fetchRetoma();
  }, [formData.data, formData.turno]);

  return (
    <div className="main-retoma">
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <ModalAddRetoma
        abrirModalRetoma={abrirModalRetoma}
        setAbrirModalRetoma={setAbrirModalRetoma}
        formData={formData}
        setFormData={setFormData}
        fetchRetoma={fetchRetoma}
      />
      <ModalEditarRetoma
        abrirModalEditarRetoma={abrirModalEditarRetoma}
        setAbrirModalEditarRetoma={setAbrirModalEditarRetoma}
        rowEdit={rowEdit}
        fetchValores={fetchValores}
      />
      <ModalConfirm
        abrirModalConfirm={abrirModalConfirm}
        setAbrirModalConfirm={setAbrirModalConfirm}
        textConfirm={textConfirm}
        confirmOK={confirmOK}
        confirmNO={confirmNO}
      />
      <Box display="flex" gap={1}>
        <TextField
          required
          margin="dense"
          id="data"
          name="data"
          label="Data"
          type="date"
          variant="outlined"
          value={formData.data}
          onChange={handleChange}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        <FormControl>
          <FormLabel id="turno" required>
            Turno
          </FormLabel>
          <RadioGroup
            required
            row
            name="turno"
            value={formData.turno}
            onChange={handleChange}
          >
            <FormControlLabel value="DIA" control={<Radio />} label="Dia" />
            <FormControlLabel value="NOITE" control={<Radio />} label="Noite" />
          </RadioGroup>
        </FormControl>
      </Box>
      <FormLabel>Adicionar</FormLabel>
      <Box display="flex" gap={1}>
        <Button
          autoFocus="false"
          variant="contained"
          size="small"
          sx={{
            margin: "4px",
          }}
          onClick={() => addRow("RETOMA")}
        >
          Retoma
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            margin: "4px",
          }}
          onClick={() => addRow("EMPILHA")}
        >
          Empilha
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            margin: "4px",
          }}
          onClick={() => addRow("MUDANÇA DE PILHA")}
        >
          Mudança de pilha
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            margin: "4px",
          }}
          onClick={() => addRow("DESL. AUTOMÁTICO")}
        >
          Desl. Automático
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            margin: "4px",
          }}
          onClick={() => addRow("MAN. CORRETIVA")}
        >
          Man. Corretiva
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            margin: "4px",
          }}
          onClick={() => addRow("MAN. PROGRAMADA")}
        >
          Man. Programada
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            margin: "4px",
          }}
          onClick={() => addRow("LIMPEZA")}
        >
          Limpeza
        </Button>
        {usuario.nivel <= 6 && (
          <Button
            variant="outlined"
            endIcon={editar ? <CancelPresentationIcon /> : <EditSquareIcon />}
            size="small"
            sx={{
              margin: "4px",
            }}
            onClick={() => setEditar((prevEditar) => !prevEditar)}
          >
            {editar ? "Fechar" : "Editar"}
          </Button>
        )}
      </Box>
      <Divider />
      {!editar && (
        <div className="main-tables-retoma">
          <div>
            <h3>STACKER 1</h3>
            <TabelaStacker1 retomado={retomado} />
          </div>
          <div>
            <h3>STACKER 2</h3>
            <TabelaStacker2 retomado={retomado} />
          </div>
          <div>
            <h3>ESCAVADEIRA</h3>
            <TabelaEscavadeira retomado={retomado} />
          </div>
        </div>
      )}
      {editar && (
        <div className="main-tables-retoma">
          <div>
            <h3>EDITAR TABELA TAXA</h3>
            <TabelaEditaTaxa
              editar={editar}
              setAbrirModalConfirm={setAbrirModalConfirm}
              setAbrirModalEditarRetoma={setAbrirModalEditarRetoma}
              setTextConfirm={setTextConfirm}
              setDeletID={setDeletID}
              setRowEdit={setRowEdit}
              valoresRetoma={valoresRetoma}
              fetchValores={fetchValores}
            />
          </div>
        </div>
      )}
    </div>
  );
}
