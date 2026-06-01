import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "./theme/AppProvider.tsx";
import { App } from "./App.tsx";

const rootElement = document.getElementById("root");
if (rootElement === null) throw new Error("Root element not found");
createRoot(rootElement).render(
    <StrictMode>
        <AppProvider>
            <App />
        </AppProvider>
    </StrictMode>
);
