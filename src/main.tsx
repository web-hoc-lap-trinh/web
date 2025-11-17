import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { App, ConfigProvider } from "antd";
import "@ant-design/v5-patch-for-react-19";
import enUS from "antd/es/locale/en_US";
import { appRoutes as routes } from "./routes/AppRoute";
import { Provider } from "react-redux";
import { store } from "./stores/store";

const router = createBrowserRouter(routes);

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <Provider store={store}>
    <App>
      <ConfigProvider locale={enUS}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </App>
  </Provider>
);