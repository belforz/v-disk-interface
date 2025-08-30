import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppRouter } from "@app/AppRouter";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    
    <AppRouter />
    <ToastContainer />
  </React.StrictMode>
);
