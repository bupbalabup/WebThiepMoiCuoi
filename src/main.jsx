import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Core serif fonts with 100% full native Vietnamese diacritics
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/700-italic.css";

// Lining numeral font for countdown and dates
import "@fontsource/cormorant-upright/400.css";
import "@fontsource/cormorant-upright/600.css";

// Royal editorial serif
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/playfair-display/600-italic.css";

// Authentic calligraphy script with full native Vietnamese support
import "@fontsource/charm/400.css";
import "@fontsource/charm/700.css";

// Primary body and UI typography (built specifically for Vietnamese)
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";

import "./styles/index.css";
import "./styles/minimal.css";
import "./styles/animations.css";
import "./styles/luxury.css";
import "./styles/rsvp.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
