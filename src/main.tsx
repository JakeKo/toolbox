import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import BudgetManager from "./budget_manager/pages";
import Hike1000 from "./hike-1000/pages";

const root = document.getElementById("root") as HTMLElement;
const reactRoot = ReactDOM.createRoot(root);
reactRoot.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/budget-manager" element={<BudgetManager />} />
        <Route path="/hike-1000" element={<Hike1000 />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
