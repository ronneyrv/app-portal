import "./estoque.css";
import PizzaEstoque from "../../components/Estoque/PizzaEstoque";
import LinhasEstoque from "../../components/Estoque/LinhasEstoque";
import TabelaEstoque from "../../components/Estoque/tabelaEstoque";

export default function Estoque() {
  return (
    <div className="main-estoque">
      <h3>Estoque de Carvão</h3>
      <div className="container">
        <PizzaEstoque />
        <div className="linhas-container">
          <LinhasEstoque />
        </div>
      </div>
      <TabelaEstoque />
    </div>
  );
}
