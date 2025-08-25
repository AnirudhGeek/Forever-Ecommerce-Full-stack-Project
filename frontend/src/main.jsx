import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ShopContextProvider>  {/* after adding this we get the support of the contextAPI in our project and we can use the context values in any component */}
      <App />
    </ShopContextProvider>
  </BrowserRouter>
);
