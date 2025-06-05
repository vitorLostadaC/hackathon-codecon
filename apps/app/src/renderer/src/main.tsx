import "./assets/main.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Pet } from "./windows/pet/pet";

createRoot(document?.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Pet />
  </StrictMode>
);
