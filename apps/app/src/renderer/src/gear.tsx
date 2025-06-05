import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/main.css";
import { GearIcon } from "./windows/gear/gear-icon";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <GearIcon />
  </StrictMode>
);
