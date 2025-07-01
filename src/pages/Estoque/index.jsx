import "./estoque.css";
import PizzaEstoque from "../../components/Estoque/PizzaEstoque";

export default function Estoque() {
  return (
    <div className="main-estoque">
      <h3>Estoque de Carvão</h3>
      <PizzaEstoque />
    </div>
  );
}
