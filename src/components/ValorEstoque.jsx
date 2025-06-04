import { useEffect, useState } from "react";
import "../styles/valorestoque.css";

export default function ValorEstoque() {
  const [estoque, setEstoque] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/estoque/diario", {
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
  }, []);

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
          <h4>Estoque</h4>
          <div className="colum">
            {estoque.map((item, index) => (
              <div key={index} className="client">
                <h5>Energia Pecém</h5>
                <span>{formatarVolume(item.volume_ep)} toneladas</span>
                <span>{item.dia_ep} dias</span>
              </div>
            ))}
            {estoque.map((item, index) => (
              <div key={index} className="client">
                <h5>Eneva</h5>
                <span>{formatarVolume(item.volume_eneva)} toneladas</span>
                <span>{item.dia_eneva} dias</span>
              </div>
            ))}
            {estoque.map((item, index) => (
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
