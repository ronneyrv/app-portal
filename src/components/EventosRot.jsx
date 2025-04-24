import "../styles/eventosrot.css";

export default function EventosRot() {
  function autoResize(e) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }

  return (
    <div className="evento-main">
      <div className="evento-container">
        <div className="evento-header">
          <div className="evento-header-a">
            <label>Equipamento</label>
          </div>
          <div className="evento-header-b">
            <label> Resumo dos eventos (Últimas 12h)</label>
          </div>
        </div>

        <div className="rows">
          {[
            "CSU/MHC",
            "TCLD",
            "Stacker Reclaimer 01",
            "Stacker Reclaimer 02",
            "Trippers",
            "Pátio de carvão",
            "TMUT",
            "Empréstimo de carvão",
            "Autocombustão de pilha",
            "Ocorrência em andamento",
          ].map((item, index) => {
            const id = `evento-${index}`;
            return (
              <div className="evento-row" key={index}>
                <div className="evento-title">
                  <label htmlFor={id}>{item}</label>
                </div>
                <div className="evento-content">
                  <textarea id={id} rows="2" onInput={autoResize} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
