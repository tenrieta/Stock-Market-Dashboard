import React from "react";
import ReactDOM from "react-dom";

// Router
import { BrowserRouter } from "react-router-dom";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// Components
import App from "./App";

ReactDOM.render(
  <BrowserRouter
    basename={
      process.env.NODE_ENV === "production"
        ? process.env.PUBLIC_BASENAME_PATH
        : "/"
    }
  >
    <App />
  </BrowserRouter>,
  document.getElementById("app")
);
