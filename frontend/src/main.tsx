import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider } from "./context/AppContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <AppProvider>
      <GoogleOAuthProvider clientId="151600269273-4iv66c5ml3l4kcendiicsbh2h1bn4pn7.apps.googleusercontent.com">
        <App />{" "}
      </GoogleOAuthProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
