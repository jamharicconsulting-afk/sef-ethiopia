import { useState, useEffect } from "react";
import HomeScreen from "./screens/HomeScreen";
import MarketScreen from "./screens/MarketScreen";
import AlertsScreen from "./screens/AlertsScreen";
import DetailScreen from "./screens/DetailScreen";
import GateScreen from "./screens/GateScreen";
import { commodities as staticCommodities, fetchPrices } from "./data/priceData";
import { supabase } from "./supabaseClient";
import { t } from "./i18n/strings";

export default function App() {
  const [lang, setLang] = useState("en");
  const [tab, setTab] = useState("home");
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [commodities, setCommodities] = useState(staticCommodities);
  const [alerts, setAlerts] = useState([]);
  const [watchlist, setWatchlist] = useState(["coffee_g2", "teff_white", "sesame", "chat_dd"]);
  const [loading, setLoading] = useState(true);

  // Subscriber gate
  const [subscriberName, setSubscriberName] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("sef_subscriber"))?.name || null; }
    catch { return null; }
  });

  useEffect(() => {
    fetchPrices().then(data => {
      setCommodities(data);
      setLoading(false);
    });

    supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setAlerts(data.map(row => ({
            id: row.id,
            commodity: row.commodity_id,
            market: row.market_id,
            type: row.type,
            threshold: row.threshold,
            via: row.via,
          })));
        }
      });
  }, []);

  const tr = (key) => t(key, lang);

  const openDetail = (commodityId) => setSelectedCommodity(commodityId);
  const closeDetail = () => setSelectedCommodity(null);

  const addAlert = async (alert) => {
    const { data, error } = await supabase
      .from("alerts")
      .insert({
        commodity_id: alert.commodity,
        market_id: alert.market,
        type: alert.type,
        threshold: alert.threshold,
        via: alert.via,
      })
      .select()
      .single();
    if (!error && data) {
      setAlerts(prev => [...prev, {
        id: data.id,
        commodity: data.commodity_id,
        market: data.market_id,
        type: data.type,
        threshold: data.threshold,
        via: data.via,
      }]);
    }
  };

  const removeAlert = async (id) => {
    await supabase.from("alerts").delete().eq("id", id);
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const toggleWatchlist = (id) => {
    setWatchlist(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Show gate if not authenticated
  if (!subscriberName) {
    return <GateScreen onAccess={setSubscriberName} />;
  }

  return (
    <div className="app-shell">
      <div className="lang-bar">
        <span className="app-brand">ሴፍ <span className="brand-en">Sef</span></span>
        <div className="lang-switcher">
          <button className={`lang-btn${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}>EN</button>
          <button className={`lang-btn${lang === "am" ? " active" : ""}`} onClick={() => setLang("am")}>አማ</button>
        </div>
      </div>

      {loading && <div className="loading-bar" />}

      <div className="screen-area">
        {selectedCommodity ? (
          <DetailScreen
            commodityId={selectedCommodity}
            commodities={commodities}
            onBack={closeDetail}
            onAddAlert={addAlert}
            inWatchlist={watchlist.includes(selectedCommodity)}
            onToggleWatchlist={() => toggleWatchlist(selectedCommodity)}
            lang={lang}
            tr={tr}
          />
        ) : tab === "home" ? (
          <HomeScreen
            commodities={commodities}
            watchlist={watchlist}
            onOpenDetail={openDetail}
            alertCount={alerts.length}
            lang={lang}
            tr={tr}
            subscriberName={subscriberName}
          />
        ) : tab === "markets" ? (
          <MarketScreen
            commodities={commodities}
            onOpenDetail={openDetail}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            lang={lang}
            tr={tr}
          />
        ) : (
          <AlertsScreen
            commodities={commodities}
            alerts={alerts}
            onRemove={removeAlert}
            lang={lang}
            tr={tr}
          />
        )}
      </div>

      {!selectedCommodity && (
        <nav className="bottom-nav">
          {[
            { id: "home",    icon: "🏠", labelEn: "Home",    labelAm: "ቤት" },
            { id: "markets", icon: "📊", labelEn: "Markets", labelAm: "ገበያ" },
            { id: "alerts",  icon: "🔔", labelEn: "Alerts",  labelAm: "ማንቂያ" },
          ].map(item => (
            <button
              key={item.id}
              className={`nav-item${tab === item.id ? " active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{lang === "am" ? item.labelAm : item.labelEn}</span>
              {item.id === "alerts" && alerts.length > 0 && (
                <span className="nav-badge">{alerts.length}</span>
              )}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
