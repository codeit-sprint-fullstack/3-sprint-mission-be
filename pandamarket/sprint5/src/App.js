import LandingPage from "./components/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Items from "./Items";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>} ></Route>
          <Route path="/Items" element={<Items/>} ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;