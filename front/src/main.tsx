import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import "./styles/globals.css";

const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
const isAboutRoute = normalizedPath === "/about";

createRoot(document.getElementById("root")!).render(
  isAboutRoute ? <AboutPage /> : <App />,
);
