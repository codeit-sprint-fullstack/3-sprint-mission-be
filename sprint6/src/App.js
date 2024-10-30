import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ItemsPage from './pages/ItemsPage/index.js';

function App() {
  return (
    <BrowserRouter >
    <Routes>
      <Route path='/items' element={<ItemsPage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
