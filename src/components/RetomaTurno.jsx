import '../styles/retomaturno.css';

export default function RetomaTurno({dados}) {
    return(
        <div className="tabela-container">
        <table className="tabela-retomado">
          <thead>
            <tr>
              <th>Unidade</th>
              <th>Equipamento</th>
              <th>Pilha</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item, index) => (
              <tr key={index}>
                <td>{item.unidade}</td>
                <td>{item.equipamento}</td>
                <td>{item.pilha}</td>
                <td>{item.inicio}</td>
                <td>{item.fim}</td>
                <td>{item.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
}