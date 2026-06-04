const mktShort = {addis:"Addis",jimma:"Jimma",diredawa:"Dire Dawa",mekele:"Mek'ele",hawassa:"Hawassa"};
const viaIcon = {push:"🔔", sms:"💬", email:"📧"};

export default function AlertsScreen({ commodities, alerts, onRemove, lang, tr }) {
  return (
    <div className="screen">
      <div className="screen-header">
        <h1 className="screen-title">{tr("active_alerts")}</h1>
        <span className="alert-count-badge">{alerts.length}</span>
      </div>

      {alerts.length === 0 ? (
        <div className="empty-full">
          <div className="empty-icon">🔕</div>
          <div className="empty-title">{tr("no_alerts")}</div>
          <div className="empty-sub">{tr("no_alerts_sub")}</div>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map(alert => {
            const c = commodities[alert.commodity];
            if (!c) return null;
            const name = lang === "am" ? c.nameAm : c.nameEn;
            const typeLabel = alert.type === "above" ? "↑ above" : alert.type === "below" ? "↓ below" : "± by";
            const isTriggered = (alert.type === "above" && c.price > alert.threshold) ||
                                 (alert.type === "below" && c.price < alert.threshold);
            return (
              <div key={alert.id} className={`alert-card${isTriggered ? " triggered" : ""}`}>
                <div className="ac-left">
                  <div className="ac-dot" style={{background: c.color}} />
                  <div className="ac-info">
                    <div className="ac-name">{name}</div>
                    <div className="ac-sub">
                      {mktShort[alert.market]} · {typeLabel} ETB {Number(alert.threshold).toLocaleString()}
                    </div>
                    {isTriggered && (
                      <div className="ac-triggered">⚡ Triggered — current: ETB {c.price.toLocaleString()}</div>
                    )}
                  </div>
                </div>
                <div className="ac-right">
                  <span className="ac-via">{viaIcon[alert.via]}</span>
                  <button className="ac-remove" onClick={() => onRemove(alert.id)}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="alerts-tip">
        <span className="tip-icon">💡</span>
        <span>Open any commodity from the Markets tab to set a new alert.</span>
      </div>
    </div>
  );
}
