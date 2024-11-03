import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./components/App";
import ItemsPage from "./page/ItemsPage";
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";

function Main() {
  return (
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/">
            <Route index element={<HomePage />} />
          </Route>
          <Route path="/items">
            <Route index element={<ItemsPage />} />
          </Route>
          <Route path="/login">
            <Route index element={<LoginPage />} />
          </Route>
          <Route path="/registration">
            <Route index element={<RegisterPage />} />
          </Route>
        </Routes>
      </App>
    </BrowserRouter>
  );
}

export default Main;
