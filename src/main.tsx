import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppRouter } from "@app/AppRouter";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useUserStore } from "@app/store/user";

function RehydrateUser() {
  const setToken = useUserStore((s) => s.setToken);
  const setUser = useUserStore((s) => s.setUser);
  useEffect(() => {
    try {
      const t = localStorage.getItem("token");
      const u = localStorage.getItem("user");
      if (t) setToken(t);
      if (u) setUser(JSON.parse(u));
    } catch (e) {
      // ignore
    }
  }, [setToken, setUser]);
  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
   <RehydrateUser />
    <AppRouter />
    <ToastContainer />
  </React.StrictMode>
);
