import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ItemsPage from './pages/ItemsPage/index.jsx';
import HomePage from './pages/HomePage/index.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import AddItemPage from './pages/AddItemPage/AddItemPage.jsx';

function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/items' element={<ItemsPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<AddItemPage />} />
        {/* <Route path='/community' element={<CommunityFeedPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
