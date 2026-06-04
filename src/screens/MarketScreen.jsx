import { useState } from "react";
import { categories } from "../data/priceData";
import { CommodityRow } from "./HomeScreen";

export default function MarketScreen({ commodities, onOpenDetail, watchlist, onToggleWatchlist, lang, tr }) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filtered = Object.values(commodities).filter(c => {
    const matchCat = category === "all" || c.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      c.nameEn.toLowerCase().includes(q) ||
      c.nameAm.includes(q);
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "price") return b.price - a.price;
    if (sortBy === "change") return b.change - a.change;
    return (lang === "am" ? a.nameAm : a.nameEn).localeCompare(lang === "am" ? b.nameAm : b.nameEn);
  });

  return (
    <div className="screen">
      <div className="screen-header">
        <h1 className="screen-title">{tr("all_markets")}</h1>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          placeholder={tr("search")}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button className="search-clear" onClick={() => setSearch("")}>✕</button>}
      </div>

      <div className="chip-row">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`chip${category === cat.id ? " active" : ""}`}
            onClick={() => setCategory(cat.id)}
          >
            {lang === "am" ? cat.labelAm : cat.labelEn}
          </button>
        ))}
      </div>

      <div className="sort-row">
        <span className="sort-label">Sort:</span>
        {["name","price","change"].map(s => (
          <button
            key={s}
            className={`sort-btn${sortBy === s ? " active" : ""}`}
            onClick={() => setSortBy(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <section className="list-section" style={{marginTop: "4px"}}>
        {filtered.length === 0 ? (
          <div className="empty-state">No results found.</div>
        ) : filtered.map(c => (
          <div key={c.id} style={{position:"relative"}}>
            <CommodityRow c={c} lang={lang} onOpen={() => onOpenDetail(c.id)} />
            <button
              className={`watchlist-pin${watchlist.includes(c.id) ? " pinned" : ""}`}
              onClick={e => { e.stopPropagation(); onToggleWatchlist(c.id); }}
              title={watchlist.includes(c.id) ? "Remove from watchlist" : "Add to watchlist"}
            >
              {watchlist.includes(c.id) ? "★" : "☆"}
            </button>
          </div>
        ))}
      </section>

      <div style={{height:"16px"}} />
    </div>
  );
}
