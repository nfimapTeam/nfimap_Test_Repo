import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from 'recoil';
import theme from "./util/theme";
import { HelmetProvider } from 'react-helmet-async';
import './i18n';

const container = document.getElementById("root") as HTMLElement;

if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(
    container,
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <RecoilRoot>
          <HelmetProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </HelmetProvider>
        </RecoilRoot>
      </ChakraProvider>
    </React.StrictMode>
  );
} else {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <RecoilRoot>
          <HelmetProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </HelmetProvider>
        </RecoilRoot>
      </ChakraProvider>
    </React.StrictMode>
  );
}

reportWebVitals();
