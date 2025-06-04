import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { useEffect, useState } from "react";
import "../styles/patiopolimero.css";

export default function PatioPolimero() {
  const [validade, setValidade] = useState([]);
  const [volume, setVolume] = useState([]);

  const verificarPrazo = (dia) => {
    const dataItem = new Date(dia);
    const dataHoje = new Date();

    dataItem.setHours(0, 0, 0, 0);
    dataHoje.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(dataHoje - dataItem);
    const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDias > 20 ? "Reaplicar" : "No prazo";
  };

  useEffect(() => {
    fetch("http://localhost:3001/polimero", {
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

    fetch("http://localhost:3001/polimero/volume", {
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
  }, []);

  return (
    <div className="polimero">
      <h3>Validade do Polímero</h3>
      {validade.map((item) => {
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
      <label>Estoque de Polímero:</label>
      <div className="stqPol">
        {volume.map((item, index) => (
          <div key={index}>
            {item.cliente}: {item.volume} litros
          </div>
        ))}
      </div>
    </div>
  );
}
