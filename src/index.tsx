import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {Provider} from "react-redux";
import {store} from "./redux/configureStore";
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
// --- دیباگ موقت: هر خطای global رو مستقیم روی صفحه نشون بده ---
function showFatalError(source: string, message: string, stack?: string) {
  const el = document.createElement("div");
  el.style.cssText =
    "position:fixed;inset:0;background:#300;color:#fff;z-index:999999;padding:12px;overflow:auto;white-space:pre-wrap;direction:ltr;text-align:left;font-size:12px;font-family:monospace";
  el.textContent = `[${source}]\n${message}\n\n${stack || ""}`;
  document.body.appendChild(el);
}

window.addEventListener("error", (e) => {
  showFatalError("window.onerror", e.message, e.error?.stack);
});

window.addEventListener("unhandledrejection", (e) => {
  showFatalError("unhandledrejection", String(e.reason), e.reason?.stack);
});
// --- پایان بخش دیباگ ---
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </React.StrictMode>
);
