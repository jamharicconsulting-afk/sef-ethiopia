import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { commodities, markets } from "../data/priceData";

const ADMIN_PASSWORD = "sef2024";

export default function AdminScreen() {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState("prices"); // "prices" | "subscribers"

  // Price submission state
  const [commodityId, setCommodityId] = useState("coffee_g2");
  const [marketId, setMarketId] = useState("addis");
  const [price, setPrice] = useState("");
  const [source, setSource] = useState("");
  const [submittedBy, setSubmittedBy] = useState("Yani");
  const [priceStatus, setPriceStatus] = useState(null);
  const [priceError, setPriceError] = useState("");

  // Subscriber management state
  const [subscribers, setSubscribers] = useState([]);
  const [subLoading, setSubLoading] = useState(false);
  const [subName, setSubName] = useState("");
  const [subPhone, setSubPhone] = useState("");
  const [subPlan, setSubPlan] = useState("monthly");
  const [subStatus, setSubStatus] = useState(null);
  const [subError, setSubError] = useState("");

  useEffect(() => {
    if (authed) loadSubscribers();
  }, [authed]);

  const loadSubscribers = async () => {
    setSubLoading(true);
    const { data } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    setSubscribers(data || []);
    setSubLoading(false);
  };

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 1200);
    }
  };

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setPriceError("Please enter a valid price.");
      setPriceStatus("error");
      return;
    }
    setPriceStatus("loading");
    setPriceError("");
    const { error } = await supabase.from("prices").insert({
      commodity_id: commodityId,
      market_id: marketId,
      price: Number(price),
      source: source || null,
      submitted_by: submittedBy || "Yani",
    });
    if (error) {
      setPriceError(error.message);
      setPriceStatus("error");
    } else {
      setPriceStatus("success");
      setPrice("");
      setSource("");
      setTimeout(() => setPriceStatus(null), 3000);
    }
  };

  const expiryDate = (plan) => {
    const d = new Date();
    plan === "yearly" ? d.setFullYear(d.getFullYear() + 1) : d.setMonth(d.getMonth() + 1);
    return d.toISOString();
  };

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    if (!subName.trim() || !subPhone.trim()) {
      setSubError("Name and phone are required.");
      setSubStatus("error");
      return;
    }
    setSubStatus("loading");
    setSubError("");
    const normalized = subPhone.trim().replace(/\s+/g, "").replace(/^0/, "+251");
    const { error } = await supabase.from("subscribers").insert({
      name: subName.trim(),
      phone: normalized,
      plan: subPlan,
      expires_at: expiryDate(subPlan),
      active: true,
    });
    if (error) {
      setSubError(error.message.includes("unique") ? "This phone number is already subscribed." : error.message);
      setSubStatus("error");
    } else {
      setSubStatus("success");
      setSubName("");
      setSubPhone("");
      setSubPlan("monthly");
      setTimeout(() => setSubStatus(null), 2000);
      loadSubscribers();
    }
  };

  const handleRenew = async (sub) => {
    const current = new Date(sub.expires_at) > new Date() ? new Date(sub.expires_at) : new Date();
    sub.plan === "yearly" ? current.setFullYear(current.getFullYear() + 1) : current.setMonth(current.getMonth() + 1);
    await supabase.from("subscribers").update({ expires_at: current.toISOString(), active: true }).eq("id", sub.id);
    loadSubscribers();
  };

  const handleToggleActive = async (sub) => {
    await supabase.from("subscribers").update({ active: !sub.active }).eq("id", sub.id);
    loadSubscribers();
  };

  const formatExpiry = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const isExpired = (d) => new Date(d) < new Date();

  if (!authed) {
    return (
      <div className="admin-shell">
        <div className="admin-login-card">
          <div className="admin-logo">ሴፍ</div>
          <h2 className="admin-login-title">Admin Access</h2>
          <p className="admin-login-sub">Enter the password to continue</p>
          <div style={{position:"relative"}}>
            <input
              className={`admin-input${passwordError ? " input-error" : ""}`}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              autoComplete="off"
              autoFocus
              style={{paddingRight:"44px"}}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              style={{position:"absolute",right:"10px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:"18px",color:"var(--hint)"}}
            >{showPassword ? "🙈" : "👁"}</button>
          </div>
          {passwordError && <p className="admin-error-msg">Incorrect password</p>}
          <button className="admin-submit-btn" onClick={handleLogin}>Enter</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin-card">
        <div className="admin-header">
          <div className="admin-logo">ሴፍ</div>
          <h1 className="admin-title">Admin Panel</h1>
        </div>

        {/* Tab switcher */}
        <div className="admin-tabs">
          <button className={`admin-tab${tab === "prices" ? " active" : ""}`} onClick={() => setTab("prices")}>
            Submit Price
          </button>
          <button className={`admin-tab${tab === "subscribers" ? " active" : ""}`} onClick={() => setTab("subscribers")}>
            Subscribers
          </button>
        </div>

        {/* ── Price submission tab ── */}
        {tab === "prices" && (
          <form className="admin-form" onSubmit={handlePriceSubmit}>
            <div className="admin-field">
              <label className="admin-label">Commodity</label>
              <select className="admin-select" value={commodityId} onChange={e => setCommodityId(e.target.value)}>
                {Object.values(commodities).map(c => (
                  <option key={c.id} value={c.id}>{c.nameEn}</option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Market</label>
              <select className="admin-select" value={marketId} onChange={e => setMarketId(e.target.value)}>
                {Object.values(markets).map(m => (
                  <option key={m.id} value={m.id}>{m.nameEn}</option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Price (ETB)</label>
              <div className="admin-input-wrap">
                <span className="admin-prefix">ETB</span>
                <input className="admin-input admin-input-price" type="number" inputMode="decimal"
                  placeholder="e.g. 9500" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Source <span className="admin-optional">(optional)</span></label>
              <input className="admin-input" type="text" placeholder="e.g. Mercato reporter"
                value={source} onChange={e => setSource(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Submitted by</label>
              <input className="admin-input" type="text" value={submittedBy} onChange={e => setSubmittedBy(e.target.value)} />
            </div>
            {priceStatus === "error" && <div className="admin-banner admin-banner-error">{priceError}</div>}
            {priceStatus === "success" && <div className="admin-banner admin-banner-success">✓ Price submitted!</div>}
            <button className="admin-submit-btn" type="submit" disabled={priceStatus === "loading"}>
              {priceStatus === "loading" ? "Submitting…" : "Submit Price"}
            </button>
          </form>
        )}

        {/* ── Subscribers tab ── */}
        {tab === "subscribers" && (
          <div>
            {/* Add subscriber form */}
            <form className="admin-form" onSubmit={handleAddSubscriber} style={{marginBottom:"24px"}}>
              <p style={{fontSize:"13px",fontWeight:"600",color:"var(--text)"}}>Add New Subscriber</p>
              <div className="admin-field">
                <label className="admin-label">Full Name</label>
                <input className="admin-input" type="text" placeholder="e.g. Abebe Girma"
                  value={subName} onChange={e => setSubName(e.target.value)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Phone</label>
                <input className="admin-input" type="tel" inputMode="tel" placeholder="09XX XXX XXXX or +251..."
                  value={subPhone} onChange={e => setSubPhone(e.target.value)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Plan</label>
                <div style={{display:"flex",gap:"8px"}}>
                  {["monthly","yearly"].map(p => (
                    <button key={p} type="button"
                      className={`af-btn${subPlan === p ? " active" : ""}`}
                      onClick={() => setSubPlan(p)}
                      style={{flex:1,textTransform:"capitalize"}}
                    >{p}</button>
                  ))}
                </div>
              </div>
              {subStatus === "error"   && <div className="admin-banner admin-banner-error">{subError}</div>}
              {subStatus === "success" && <div className="admin-banner admin-banner-success">✓ Subscriber added!</div>}
              <button className="admin-submit-btn" type="submit" disabled={subStatus === "loading"}>
                {subStatus === "loading" ? "Adding…" : "Add Subscriber"}
              </button>
            </form>

            {/* Subscriber list */}
            <p style={{fontSize:"13px",fontWeight:"600",color:"var(--text)",marginBottom:"10px"}}>
              Active Subscribers ({subscribers.filter(s => s.active && !isExpired(s.expires_at)).length})
            </p>
            {subLoading ? (
              <div style={{textAlign:"center",color:"var(--hint)",padding:"20px"}}>Loading…</div>
            ) : subscribers.length === 0 ? (
              <div style={{textAlign:"center",color:"var(--hint)",padding:"20px",fontSize:"13px"}}>No subscribers yet.</div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                {subscribers.map(sub => {
                  const expired = isExpired(sub.expires_at);
                  return (
                    <div key={sub.id} className={`sub-card${!sub.active ? " sub-inactive" : expired ? " sub-expired" : ""}`}>
                      <div className="sub-info">
                        <span className="sub-name">{sub.name}</span>
                        <span className="sub-phone">{sub.phone}</span>
                        <span className="sub-meta">
                          {sub.plan} · expires {formatExpiry(sub.expires_at)}
                          {expired && <span className="sub-tag sub-tag-expired"> EXPIRED</span>}
                          {!sub.active && <span className="sub-tag sub-tag-blocked"> BLOCKED</span>}
                        </span>
                      </div>
                      <div className="sub-actions">
                        <button className="sub-btn sub-btn-renew" onClick={() => handleRenew(sub)}>
                          Renew
                        </button>
                        <button
                          className={`sub-btn ${sub.active ? "sub-btn-block" : "sub-btn-unblock"}`}
                          onClick={() => handleToggleActive(sub)}
                        >
                          {sub.active ? "Block" : "Unblock"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
