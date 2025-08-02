import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { useEffect, useMemo, useState } from "react";
import "./patiopolimero.css";

export default function PatioPolimero({
  setPolimeroJson,
  setPolimeroVolJson,
  rotJSON,
  deHoje,
}) {
  const [validade, setValidade] = useState([]);
  const [volume, setVolume] = useState([]);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const verificarPrazo = (dia) => {
    const dataItem = new Date(dia);
    const dataHoje = new Date();
    dataItem.setHours(0, 0, 0, 0);
    dataHoje.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(dataHoje - dataItem);
    const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDias > 20 ? "Reaplicar" : "No prazo";
  };

  const dadosValidade = useMemo(() => {
    return rotJSON?.patio_polimero ?? validade;
  }, [rotJSON, validade]);

  const dadosVolume = useMemo(() => {
    if (deHoje) return volume;
    return rotJSON?.patio_polimero_vol ?? volume;
  }, [rotJSON, volume, deHoje]);

  useEffect(() => {
    setPolimeroJson(validade);
    setPolimeroVolJson(volume);
  }, [validade, volume]);

  useEffect(() => {
    if (!rotJSON) {
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
    }
  }, [rotJSON]);

  return (
    <div className="polimero">
      <h3>Validade do Polímero</h3>
      {dadosValidade.map((item) => {
        const dataFormatada = new Date(item.data).toLocaleDateString("pt-BR");
        return (
          <div key={item.pilha} className="row-polimero">
            <WaterDropIcon
              style={{
                fontSize: 15,
                color:
                  verificarPrazo(item.data) === "No prazo"
                    ? "#76ff03"
                    : "#ff1744",
              }}
            />
            <span>
              {item.pilha} - {dataFormatada}: {verificarPrazo(item.data)};
            </span>
          </div>
        );
      })}
      <h3>Estoque de Polímero:</h3>
      <div className="stqPol">
        {dadosVolume.map((item, index) => (
          <div key={index}>
            {item.cliente}: {item.volume} litros
          </div>
        ))}
      </div>
    </div>
  );
}
