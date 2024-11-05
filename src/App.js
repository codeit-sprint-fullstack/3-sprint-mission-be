import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainHeader from './components/header'
import Items from './components/items';
import Footer from './components/footer';
import ProductRegistration from './components/productRegistration';
import LandingPage from './components/landingpage'



function App() {
  return (
    <Router>
    <div className="app-container">
      <MainHeader />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/items" element={<Items />} />
        <Route path="/registration" element={<ProductRegistration />} /> 
      </Routes>
      <Footer />
    </div>
    </Router>
  );
}



export default App;
