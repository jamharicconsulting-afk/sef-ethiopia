import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function GateScreen({ onAccess }) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(null); // null | "checking" | "expired" | "inactive" | "notfound"

  const normalize = (p) => p.replace(/\s+/g, "").replace(/^0/, "+251");

  const handleCheck = async () => {
    const normalized = normalize(phone.trim());
    if (!normalized) return;
    setStatus("checking");

    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .eq("phone", normalized)
      .single();

    if (error || !data) {
      setStatus("notfound");
      return;
    }

    if (!data.active) {
      setStatus("inactive");
      return;
    }

    if (new Date(data.expires_at) < new Date()) {
      setStatus("expired");
      return;
    }

    // Store in sessionStorage so they don't re-enter on refresh within same session
    sessionStorage.setItem("sef_subscriber", JSON.stringify({ phone: normalized, name: data.name }));
    onAccess(data.name);
  };

  return (
    <div className="gate-shell">
      <div className="gate-card">
        <div className="gate-logo">ሴፍ</div>
        <h1 className="gate-title">Ethiopia Market Prices</h1>
        <p className="gate-sub">Enter your phone number to access your subscription</p>

        <div className="gate-input-wrap">
          <span className="gate-prefix">+251</span>
          <input
            className="gate-input"
            type="tel"
            inputMode="tel"
            placeholder="9X XXX XXXX"
            value={phone}
            onChange={e => { setPhone(e.target.value); setStatus(null); }}
            onKeyDown={e => e.key === "Enter" && handleCheck()}
            autoComplete="tel"
          />
        </div>

        {status === "notfound" && (
          <div className="gate-msg gate-msg-error">
            No subscription found for this number.<br />
            Contact us to subscribe.
          </div>
        )}
        {status === "expired" && (
          <div className="gate-msg gate-msg-error">
            Your subscription has expired.<br />
            Contact us to renew.
          </div>
        )}
        {status === "inactive" && (
          <div className="gate-msg gate-msg-error">
            Your account has been paused.<br />
            Contact us for help.
          </div>
        )}

        <button
          className="gate-btn"
          onClick={handleCheck}
          disabled={status === "checking" || !phone.trim()}
        >
          {status === "checking" ? "Checking…" : "Access Sef →"}
        </button>

        <p className="gate-contact">
          To subscribe: <strong>+251 9XX XXX XXXX</strong>
        </p>
      </div>
    </div>
  );
}
