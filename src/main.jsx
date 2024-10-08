
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import { AuthProvider } from "./context/AuthProvider";

import "../public/css/tailwind.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <MaterialTailwindControllerProvider>
    <ToastContainer />
          <App />
          </MaterialTailwindControllerProvider>
          </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);


// TODO
//  1. get space rent interest histories and display 
// 2. wallet interest
//  3. spacepoint