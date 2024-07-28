import React from "react";
import ReactDOM from "react-dom/client";
// import dotenv from "dotenv";
import App from "./App.tsx";
import "./index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// dotenv.config()
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <ToastContainer autoClose={2000}/>
  </React.StrictMode>
);
