import "../styles/valorestoque.css";

export default function ValorEstoque() {
  const estoque = [
    { client: "Energia Pecém", volume: 229253.48, dia: 35 },
    { client: "Eneva", volume: 140711.17, dia: 43 },
    { client: "Energia Pecém + Eneva", volume: 369964.64, dia: 38 },
  ];

  return (
    <div className="containe-stq">
      <div className="stq">
        <div className="content">
          <h4>Estoque</h4>
          <div className="colum">
            {estoque.map((item, index) => (
              <div key={index} className="client">
                <h5>{item.client}</h5>
                <span>{item.volume} toneladas</span>
                <span>{item.dia} dias</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
