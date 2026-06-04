import { useState } from "react";
import { supabase } from "../supabaseClient";

const COUNTRY_CODES = [
  { code: "+251", flag: "🇪🇹", name: "Ethiopia" },
  { code: "+1",   flag: "🇺🇸", name: "USA / Canada" },
  { code: "+44",  flag: "🇬🇧", name: "UK" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+255", flag: "🇹🇿", name: "Tanzania" },
  { code: "+256", flag: "🇺🇬", name: "Uganda" },
  { code: "+20",  flag: "🇪🇬", name: "Egypt" },
  { code: "+49",  flag: "🇩🇪", name: "Germany" },
  { code: "+46",  flag: "🇸🇪", name: "Sweden" },
  { code: "+61",  flag: "🇦🇺", name: "Australia" },
];

export default function GateScreen({ onAccess }) {
  const [countryCode, setCountryCode] = useState("+251");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const selected = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0];

  const fullPhone = () => {
    const digits = phone.trim().replace(/^0+/, "");
    return countryCode + digits;
  };

  const handleCheck = async () => {
    if (!phone.trim()) return;
    setStatus("checking");
    setShowDropdown(false);

    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .eq("phone", fullPhone())
      .single();

    if (error || !data) { setStatus("notfound"); return; }
    if (!data.active)   { setStatus("inactive");  return; }
    if (new Date(data.expires_at) < new Date()) { setStatus("expired"); return; }

    sessionStorage.setItem("sef_subscriber", JSON.stringify({ phone: fullPhone(), name: data.name }));
    onAccess(data.name);
  };

  return (
    <div className="gate-shell">
      <div className="gate-card">
        <div className="gate-logo">ሴፍ</div>
        <h1 className="gate-title">Ethiopia Market Prices</h1>
        <p className="gate-sub">Enter your phone number to access your subscription</p>

        <div className="gate-phone-row">
          {/* Country code picker */}
          <div className="gate-cc-wrap">
            <button
              className="gate-cc-btn"
              type="button"
              onClick={() => setShowDropdown(d => !d)}
            >
              <span>{selected.flag}</span>
              <span>{selected.code}</span>
              <span className="gate-cc-arrow">▾</span>
            </button>
            {showDropdown && (
              <div className="gate-cc-dropdown">
                {COUNTRY_CODES.map(c => (
                  <button
                    key={c.code}
                    className={`gate-cc-option${c.code === countryCode ? " active" : ""}`}
                    onClick={() => { setCountryCode(c.code); setShowDropdown(false); setStatus(null); }}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                    <span className="gate-cc-option-code">{c.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Number input */}
          <input
            className="gate-input"
            type="tel"
            inputMode="tel"
            placeholder="9X XXX XXXX"
            value={phone}
            onChange={e => { setPhone(e.target.value); setStatus(null); }}
            onKeyDown={e => e.key === "Enter" && handleCheck()}
            autoComplete="tel-national"
          />
        </div>

        {status === "notfound" && (
          <div className="gate-msg gate-msg-error">
            No subscription found for <strong>{fullPhone()}</strong>.<br />
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
          To subscribe contact: <strong>+251 911 123 456</strong>
        </p>
      </div>
    </div>
  );
}
