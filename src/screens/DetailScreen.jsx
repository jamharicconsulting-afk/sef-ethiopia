import { useState, useEffect } from "react";
import { fetchHistory } from "../data/priceData";

const mktNames = {addis:"Mercato · Addis Ababa",jimma:"Jimma Market",diredawa:"Dire Dawa Market",mekele:"Mek'ele Market",hawassa:"Hawassa Market"};

export default function DetailScreen({ commodityId, commodities, onBack, onAddAlert, inWatchlist, onToggleWatchlist, lang, tr }) {
  const c = commodities[commodityId];
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("above");
  const [threshold, setThreshold] = useState(c ? Math.round(c.price * 1.05) : 0);
  const [via, setVia] = useState("push");
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState(c?.history ?? []);

  useEffect(() => {
    if (!c) return;
    fetchHistory(c.id, c.market).then(setHistory);
  }, [commodityId]);

  if (!c) return null;

  const name = lang === "am" ? c.nameAm : c.nameEn;
  const maxH = Math.max(...history);
  const minH = Math.min(...history);
  const range = maxH - minH || 1;

  const handleSaveAlert = () => {
    onAddAlert({ commodity: c.id, market: c.market, type: alertType, threshold: Number(threshold), via });
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowAlert(false); }, 1400);
  };

  return (
    <div className="screen">
      <div className="detail-topbar">
        <button className="back-btn" onClick={onBack}>
          ‹ {tr("back")}
        </button>
        <button
          className={`watchlist-btn${inWatchlist ? " active" : ""}`}
          onClick={onToggleWatchlist}
        >
          {inWatchlist ? "★" : "☆"}
        </button>
      </div>

      <div className="detail-hero">
        <div className="market-tag">{mktNames[c.market] || c.market}</div>
        <h1 className="detail-name">{name}</h1>
        <div className="detail-price">ETB {c.price.toLocaleString()}</div>
        <div className={`detail-change ${c.change >= 0 ? "up" : "dn"}`}>
          {c.change >= 0 ? "▲" : "▼"} {Math.abs(c.change)}% today
          <span className="detail-unit"> · {tr("per")} {lang === "am" ? c.unitAm : c.unit}</span>
        </div>
      </div>

      {/* Sparkline chart */}
      <div className="chart-card">
        <div className="chart-label-row">
          <span className="chart-label">30-day history</span>
          <span className="chart-label" style={{color: c.trend30 >= 0 ? "var(--green)" : "var(--red)"}}>
            {c.trend30 >= 0 ? "▲" : "▼"} {Math.abs(c.trend30)}% {tr("trend30").replace("30-day ","").replace("30-ቀን ","")}
          </span>
        </div>
        <div className="sparkline">
          {history.map((val, i) => {
            const pct = ((val - minH) / range) * 100;
            const isLast = i === history.length - 1;
            return (
              <div key={i} className="spark-bar-wrap">
                <div
                  className="spark-bar"
                  style={{
                    height: `${Math.max(pct, 8)}%`,
                    background: isLast ? c.color : "var(--bar-bg)",
                    opacity: isLast ? 1 : 0.5 + (i / history.length) * 0.5,
                  }}
                />
                {isLast && (
                  <div className="spark-tip" style={{background: c.color}}>
                    {c.price.toLocaleString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="chart-footer">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <div className="stat-cell">
          <span className="sc-label">{tr("day7_high")}</span>
          <span className="sc-val">ETB {c.high7.toLocaleString()}</span>
        </div>
        <div className="stat-cell">
          <span className="sc-label">{tr("day7_low")}</span>
          <span className="sc-val">ETB {c.low7.toLocaleString()}</span>
        </div>
        <div className="stat-cell">
          <span className="sc-label">{tr("trend30")}</span>
          <span className={`sc-val ${c.trend30 >= 0 ? "up" : "dn"}`}>
            {c.trend30 >= 0 ? "+" : ""}{c.trend30}%
          </span>
        </div>
        <div className="stat-cell">
          <span className="sc-label">{tr("data_source")}</span>
          <span className="sc-val" style={{fontSize:"12px"}}>{c.source}</span>
        </div>
      </div>

      {!showAlert ? (
        <button className="cta-btn" style={{background: c.color}} onClick={() => setShowAlert(true)}>
          🔔 {tr("set_alert")}
        </button>
      ) : (
        <div className="alert-form">
          <div className="af-title">{tr("price_alert")} — {name}</div>

          <div className="af-field">
            <label className="af-label">{tr("current_price")}</label>
            <div className="af-current">ETB {c.price.toLocaleString()}</div>
          </div>

          <div className="af-field">
            <label className="af-label">{tr("alert_when")}</label>
            <div className="af-btn-group">
              {[
                {id:"above", label: tr("goes_above")},
                {id:"below", label: tr("goes_below")},
                {id:"pct",   label: tr("moves_by")},
              ].map(opt => (
                <button
                  key={opt.id}
                  className={`af-btn${alertType === opt.id ? " active" : ""}`}
                  onClick={() => setAlertType(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="af-field">
            <label className="af-label">{tr("threshold")}</label>
            <div className="af-input-wrap">
              <span className="af-prefix">{alertType === "pct" ? "%" : "ETB"}</span>
              <input
                type="number"
                className="af-input"
                value={threshold}
                onChange={e => setThreshold(e.target.value)}
              />
            </div>
          </div>

          <div className="af-field">
            <label className="af-label">{tr("notify_via")}</label>
            <div className="af-btn-group">
              {[
                {id:"push", label: "🔔 " + tr("push")},
                {id:"sms",  label: "💬 " + tr("sms")},
                {id:"email",label: "📧 " + tr("email")},
              ].map(opt => (
                <button
                  key={opt.id}
                  className={`af-btn${via === opt.id ? " active" : ""}`}
                  onClick={() => setVia(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{display:"flex",gap:"8px",marginTop:"12px"}}>
            <button className="af-cancel" onClick={() => setShowAlert(false)}>Cancel</button>
            <button
              className="cta-btn"
              style={{flex:1, background: saved ? "#1D9E75" : c.color, margin:0}}
              onClick={handleSaveAlert}
            >
              {saved ? "✓ Saved!" : tr("save_alert")}
            </button>
          </div>
        </div>
      )}

      <div style={{height:"24px"}} />
    </div>
  );
}
