import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { useEffect, useState } from "react";
import "./patiopolimero.css";

export default function PatioPolimero({
  setPolimeroJson,
  setPolimeroVolJson,
  dadosJSON,
}) {
  const [validade, setValidade] = useState([]);
  const [volume, setVolume] = useState([]);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  function adicionarDias(dataInicial) {
    const data = new Date(dataInicial);
    data.setDate(data.getDate() + 21);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;

    if (data > hoje) {
      return `${dataFormatada} - No prazo`;
    } else {
      return `${dataFormatada} - Reaplicar`;
    }
  }

  function formatarNumero(numero) {
    return new Intl.NumberFormat("pt-BR").format(numero);
  }

  useEffect(() => {
    setPolimeroJson(validade);
    setPolimeroVolJson(volume);
  }, [validade, volume]);

  useEffect(() => {
    let dadosParaSetarValidade;
    let dadosParaSetarVolume;
    if (dadosJSON) {
      try {
        dadosParaSetarValidade = JSON.parse(dadosJSON.patio_polimero);
        dadosParaSetarVolume = JSON.parse(dadosJSON.patio_polimero_vol);

        setValidade(dadosParaSetarValidade);
        setVolume(dadosParaSetarVolume);
      } catch (error) {
        console.error("Erro ao fazer parse do JSON:", error);
      }
    } else {
      fetchValidade();
      fetchVolume();
    }
  }, [dadosJSON]);

  const fetchValidade = () => {
    fetch(`${API_URL}/polimero`, {
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
          setValidade(data.data);
        } else {
          console.error("Erro ao buscar status polímero");
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  };

  const fetchVolume = () => {
    fetch(`${API_URL}/polimero/volume`, {
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
          setVolume(data.data);
        } else {
          console.error("Erro ao buscar volume de polímero");
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  };

  return (
    <div className="polimero">
      <h3>Validade do Polímero</h3>
      {validade.map((item) => {
        return (
          <div key={item.pilha} className="row-polimero">
            <WaterDropIcon
              style={{
                fontSize: 15,
                color: adicionarDias(item.data).includes("No prazo")
                  ? "#76ff03"
                  : "#ff1744",
              }}
            />
            <span>
              {item.pilha} : {adicionarDias(item.data)};
            </span>
          </div>
        );
      })}
      <h3>Estoque de Polímero:</h3>
      <div className="stqPol">
        {volume.map((item, index) => (
          <div key={index}>
            {item.cliente}: {formatarNumero(item.volume)} litros
          </div>
        ))}
      </div>
    </div>
  );
}
