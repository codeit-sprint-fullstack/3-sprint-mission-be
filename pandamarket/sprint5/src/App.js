import LandingPage from "./components/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Items from "./Items";
import Registration from "./components/Registration";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>} ></Route>
          <Route path="/items" element={<Items/>} ></Route>
          <Route path="/registration" element={<Registration/>} ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;