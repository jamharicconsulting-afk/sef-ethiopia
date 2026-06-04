import { lastUpdated } from "../data/priceData";

export default function HomeScreen({ commodities, watchlist, onOpenDetail, alertCount, lang, tr }) {
  const watchedItems = watchlist
    .map(id => commodities[id])
    .filter(Boolean);

  const topMovers = Object.values(commodities)
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 3);

  return (
    <div className="screen">
      <div className="home-hero">
        <div className="hero-top">
          <div>
            <p className="greeting">{tr("greeting")}, James 👋</p>
            <h1 className="hero-title">{tr("todays_prices")}</h1>
          </div>
          <div className="update-pill">
            <span className="update-dot" />
            {lastUpdated}
          </div>
        </div>
        <div className="stat-row">
          <div className="stat-card">
            <span className="stat-label">{tr("markets_live")}</span>
            <span className="stat-value">5</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">{tr("updated")}</span>
            <span className="stat-value">6:30<span style={{fontSize:"11px",fontWeight:400}}> EAT</span></span>
          </div>
          <div className="stat-card">
            <span className="stat-label">{tr("your_alerts")}</span>
            <span className="stat-value">{alertCount}</span>
          </div>
        </div>
      </div>

      <div className="ticker-strip">
        {Object.values(commodities).slice(0,5).map(c => (
          <div key={c.id} className="tick-item" onClick={() => onOpenDetail(c.id)}>
            <span className="tick-name" style={{color: c.color}}>{lang === "am" ? c.shortAm : c.shortEn}</span>
            <span className="tick-price">ETB {c.price.toLocaleString()}</span>
            <span className={`tick-change ${c.change >= 0 ? "up" : "dn"}`}>
              {c.change >= 0 ? "▲" : "▼"}{Math.abs(c.change)}%
            </span>
          </div>
        ))}
      </div>

      <section className="list-section">
        <div className="section-head">
          <span className="section-title">{tr("watchlist")}</span>
        </div>
        {watchedItems.length === 0 ? (
          <div className="empty-state">No commodities in watchlist yet.</div>
        ) : (
          watchedItems.map(c => (
            <CommodityRow key={c.id} c={c} lang={lang} onOpen={() => onOpenDetail(c.id)} />
          ))
        )}
      </section>

      <section className="list-section">
        <div className="section-head">
          <span className="section-title">Top movers</span>
        </div>
        {topMovers.map(c => (
          <CommodityRow key={c.id} c={c} lang={lang} onOpen={() => onOpenDetail(c.id)} />
        ))}
      </section>

      <div style={{height: "16px"}} />
    </div>
  );
}

export function CommodityRow({ c, lang, onOpen }) {
  const mkt = {addis:"Addis",jimma:"Jimma",diredawa:"Dire Dawa",mekele:"Mek'ele",hawassa:"Hawassa"};
  return (
    <div className="commodity-row" onClick={onOpen}>
      <div className="com-dot" style={{background: c.color}} />
      <div className="com-info">
        <span className="com-name">{lang === "am" ? c.nameAm : c.nameEn}</span>
        <span className="com-sub">{mkt[c.market] || c.market}</span>
      </div>
      <div className="com-price-col">
        <span className="com-price">ETB {c.price.toLocaleString()}</span>
        <span className={`com-change ${c.change >= 0 ? "up" : "dn"}`}>
          {c.change >= 0 ? "▲" : "▼"} {Math.abs(c.change)}%
        </span>
      </div>
      <span className="row-arrow">›</span>
    </div>
  );
}
