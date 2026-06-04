import { useState } from "react";
import { supabase } from "../supabaseClient";
import { commodities, markets } from "../data/priceData";

const ADMIN_PASSWORD = "sef2024";

export default function AdminScreen() {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [commodityId, setCommodityId] = useState("coffee_g2");
  const [marketId, setMarketId] = useState("addis");
  const [price, setPrice] = useState("");
  const [source, setSource] = useState("");
  const [submittedBy, setSubmittedBy] = useState("Yani");

  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 1200);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setErrorMsg("Please enter a valid price.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.from("prices").insert({
      commodity_id: commodityId,
      market_id: marketId,
      price: Number(price),
      source: source || null,
      submitted_by: submittedBy || "Yani",
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStatus("success");
      setPrice("");
      setSource("");
      setTimeout(() => setStatus(null), 3000);
    }
  };

  if (!authed) {
    return (
      <div className="admin-shell">
        <div className="admin-login-card">
          <div className="admin-logo">ሴፍ</div>
          <h2 className="admin-login-title">Admin Access</h2>
          <p className="admin-login-sub">Enter the password to submit prices</p>
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
          />
          {passwordError && <p className="admin-error-msg">Incorrect password</p>}
          <button className="admin-submit-btn" onClick={handleLogin}>
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin-card">
        <div className="admin-header">
          <div className="admin-logo">ሴፍ</div>
          <h1 className="admin-title">Submit Price</h1>
          <p className="admin-sub">Add a new price reading to the database</p>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label className="admin-label">Commodity</label>
            <select
              className="admin-select"
              value={commodityId}
              onChange={e => setCommodityId(e.target.value)}
            >
              {Object.values(commodities).map(c => (
                <option key={c.id} value={c.id}>{c.nameEn}</option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label className="admin-label">Market</label>
            <select
              className="admin-select"
              value={marketId}
              onChange={e => setMarketId(e.target.value)}
            >
              {Object.values(markets).map(m => (
                <option key={m.id} value={m.id}>{m.nameEn}</option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label className="admin-label">Price (ETB)</label>
            <div className="admin-input-wrap">
              <span className="admin-prefix">ETB</span>
              <input
                className="admin-input admin-input-price"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 9500"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Source <span className="admin-optional">(optional)</span></label>
            <input
              className="admin-input"
              type="text"
              placeholder="e.g. Mercato reporter"
              value={source}
              onChange={e => setSource(e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">Submitted by</label>
            <input
              className="admin-input"
              type="text"
              value={submittedBy}
              onChange={e => setSubmittedBy(e.target.value)}
            />
          </div>

          {status === "error" && (
            <div className="admin-banner admin-banner-error">{errorMsg || "Submission failed."}</div>
          )}
          {status === "success" && (
            <div className="admin-banner admin-banner-success">✓ Price submitted successfully!</div>
          )}

          <button
            className="admin-submit-btn"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Submitting…" : "Submit Price"}
          </button>
        </form>
      </div>
    </div>
  );
}
