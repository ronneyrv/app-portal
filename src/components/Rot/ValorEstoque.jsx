import { useEffect, useMemo, useState } from "react";
import "./valorestoque.css";

export default function ValorEstoque({ setValorEstoqueJson, rotJSON, deHoje }) {
  const [estoque, setEstoque] = useState([]);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const dados = useMemo(() => {
    if (deHoje) return estoque;
    return rotJSON?.valor_estoque ?? estoque;
  }, [rotJSON, estoque, deHoje]);

  useEffect(() => {
    setValorEstoqueJson(estoque);
  }, [estoque]);

  useEffect(() => {
    if (!rotJSON) {
      fetch(`${API_URL}/estoque/diario`, {
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
            setEstoque(data.data);
          } else {
            console.error("Erro ao buscar estoque");
          }
        })
        .catch((error) => {
          console.error("Erro de rede:", error);
        });
    }
  }, [rotJSON]);

  const formatarVolume = (valor) => {
    return Number(valor)
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="containe-stq">
      <div className="stq">
        <div className="content">
          <div className="colum">
            {dados.map((item, index) => (
              <div key={index} className="client">
                <h5>Energia Pecém</h5>
                <span>{formatarVolume(item.volume_ep)} toneladas</span>
                <span>{item.dia_ep} dias</span>
              </div>
            ))}
            {dados.map((item, index) => (
              <div key={index} className="client">
                <h5>Eneva</h5>
                <span>{formatarVolume(item.volume_eneva)} toneladas</span>
                <span>{item.dia_eneva} dias</span>
              </div>
            ))}
            {dados.map((item, index) => (
              <div key={index} className="client">
                <h5>Energia Pecém + Eneva</h5>
                <span>{formatarVolume(item.volume_conjunto)} toneladas</span>
                <span>{item.dia_conjunto} dias</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
