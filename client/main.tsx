import { createRoot } from "react-dom/client";
import { App } from "./app";

const appElement = document.createElement("div");
document.body.innerHTML = "";
document.body.appendChild(appElement);

const root = createRoot(appElement);
root.render(<App />);
