import LandingPage from "./components/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Items from "./Items";
import Registration from "./components/Registration";
import Tmp from "./components/Tmp";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>} ></Route>
          <Route path="/items" element={<Items/>} ></Route>
          <Route path="/registration" element={<Registration/>} ></Route>
          <Route path="/tmp" element={<Tmp/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;