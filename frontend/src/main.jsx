import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SharedContextProvider } from "./context/SharedContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SharedContextProvider>
        <App />
      </SharedContextProvider>
    </AuthProvider>
  </StrictMode>
);