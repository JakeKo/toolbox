import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import BudgetManager from "./budget_manager/pages";

const root = document.getElementById("root") as HTMLElement;
const reactRoot = ReactDOM.createRoot(root);
reactRoot.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/budget-manager" element={<BudgetManager />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
