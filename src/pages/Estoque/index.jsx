import { useState, useEffect } from "react";
import PizzaEstoque from "../../components/Estoque/PizzaEstoque";
import TabelaEstoque from "../../components/Estoque/tabelaEstoque";
import EstoquePorpPlha from "../../components/Estoque/EstoquePorPilha";
import ModalEditarEstoquePorPilha from "../../components/Estoque/ModalEditarEstoquePorPilha";
import ModalAddConsumo from "../../components/Estoque/ModalAddConsumo";
import ModalEditarConsumo from "../../components/Estoque/ModalEditarConsumo";
import ModalConfigConsumo from "../../components/Estoque/ModalConfigConsumo";
import ConfigConsumo from "../../components/Estoque/configConsumo";
import NotifyBar from "../../components/NotifyBar";
import "./estoque.css";

export default function Estoque() {
  const [abrirModalEstoquePorPilha, setAbrirModalEstoquePorPilha] =
    useState(false);
  const [abrirModalAddConsumo, setAbrirModalAddConsumo] = useState(false);
  const [abrirModalEditarConsumo, setAbrirModalEditarConsumo] = useState(false);
  const [abrirModalConfigConsumo, setAbrirModalConfigConsumo] = useState(false);
  const [config, setConfig] = useState([]);
  const [estoquePilhas, setEstoquePilhas] = useState([]);
  const [estoqueGeralDias, setEstoqueGeralDias] = useState([]);
  const [pilha, setPilha] = useState([]);
  const [rowConsumo, setRowConsumo] = useState("");
  const [idEdit, setIdEdit] = useState("");
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const fetchConsumo = () => {
    fetch(`${API_URL}/config/consumo`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setConfig(data.data);
        } else {
          console.error("Erro ao buscar Configuração");
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  const fetchEstoque = () => {
    fetch(`${API_URL}/estoque`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setEstoqueGeralDias(data.data);
        } else {
          console.error("Erro ao buscar estoque");
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  const fetchVolumePilhaGeral = () => {
    fetch(`${API_URL}/estoque/por/pilha`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setEstoquePilhas(data.data);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  const fetchVolumePilha = (id) => {
    if (!id) return;
    fetch(`${API_URL}/estoque/navio/pilha/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setPilha(data.data);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  useEffect(() => {
    fetchEstoque();
  }, []);

  useEffect(() => {
    if (!idEdit) return;
    fetchVolumePilha(idEdit);
  }, [idEdit]);

  return (
    <div className="main-estoque">
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <ModalEditarEstoquePorPilha
        abrirModalEstoquePorPilha={abrirModalEstoquePorPilha}
        setAbrirModalEstoquePorPilha={setAbrirModalEstoquePorPilha}
        fetchVolumePilhaGeral={fetchVolumePilhaGeral}
        pilha={pilha}
        idEdit={idEdit}
      />
      <ModalAddConsumo
        abrirModalAddConsumo={abrirModalAddConsumo}
        setAbrirModalAddConsumo={setAbrirModalAddConsumo}
        fetchEstoque={fetchEstoque}
      />
      <ModalEditarConsumo
        abrirModalEditarConsumo={abrirModalEditarConsumo}
        setAbrirModalEditarConsumo={setAbrirModalEditarConsumo}
        fetchEstoque={fetchEstoque}
        fetchVolumePilhaGeral={fetchVolumePilhaGeral}
        rowConsumo={rowConsumo}
      />
      <ModalConfigConsumo
        abrirModalConfigConsumo={abrirModalConfigConsumo}
        setAbrirModalConfigConsumo={setAbrirModalConfigConsumo}
        fetchConsumo={fetchConsumo}
        config={config}
      />
      <div className="container">
        <PizzaEstoque estoqueGeralDias={estoqueGeralDias} />
        <div className="pilhas-container">
          <EstoquePorpPlha
            setAbrirModalEstoquePorPilha={setAbrirModalEstoquePorPilha}
            setIdEdit={setIdEdit}
            estoquePilhas={estoquePilhas}
            fetchVolumePilhaGeral={fetchVolumePilhaGeral}
          />
          <ConfigConsumo
            setAbrirModalAddConsumo={setAbrirModalAddConsumo}
            setAbrirModalConfigConsumo={setAbrirModalConfigConsumo}
          />
        </div>
      </div>
      <TabelaEstoque
        estoqueGeralDias={estoqueGeralDias}
        setAbrirModalEditarConsumo={setAbrirModalEditarConsumo}
        setRowConsumo={setRowConsumo}
        fetchEstoque={fetchEstoque}
      />
    </div>
  );
}
