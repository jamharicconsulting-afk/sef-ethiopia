import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
import AdminScreen from "./screens/AdminScreen";

const isAdmin = window.location.pathname === "/admin";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isAdmin ? <AdminScreen /> : <App />}
  </StrictMode>
);
