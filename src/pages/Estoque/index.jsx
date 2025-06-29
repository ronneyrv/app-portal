import { useEffect, useState } from "react";
import "./estoque.css";
import PizzaEstoque from "../../components/Estoque/PizzaEstoque";

export default function Estoque() {
  const [estoque, setEstoque] = useState({});

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
          setEstoque(data.data[0]);
        } else {
          console.error("Erro ao buscar estoque");
        }
      })
      .catch((error) => {
        console.error("Erro de rede:", error);
      });
  }, []);
  //console.log(estoque);
  return (
    <div className="main">
      <h3>Estoque de Carvão</h3>
      <PizzaEstoque estoque={estoque} />
    </div>
  );
}
