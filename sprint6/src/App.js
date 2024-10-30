import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ItemsPage from './pages/ItemsPage/index.jsx';
import HomePage from './pages/HomePage/index.jsx';

function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path='/' element={<HomePage />} />
      <Route path='/items' element={<ItemsPage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
