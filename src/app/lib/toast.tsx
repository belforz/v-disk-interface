import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const base: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  style: {
    background: "#000",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    padding: "0.75rem 1rem",
  },
};

export const notify = {
  success: (msg: string, opts?: ToastOptions) =>
    toast.success(msg, { ...base, ...opts }),

  error: (msg: string, opts?: ToastOptions) =>
    toast.error(msg, { ...base, ...opts }),

  info: (msg: string, opts?: ToastOptions) =>
    toast.info(msg, { ...base, ...opts }),

  warning: (msg: string, opts?: ToastOptions) =>
    toast.warning(msg, { ...base, ...opts }),
};
