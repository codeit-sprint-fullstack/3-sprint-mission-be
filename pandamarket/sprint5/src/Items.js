import Header from "./components/Header";
import ProductList from "./components/ProductList";

import { useEffect, useState } from "react";
import getProduct from './Api';
import './style/main.css';
import './style/app.css'
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";

function Items() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [sort, setSort] = useState('recent');
  const [sortedItems, setSortedItems] = useState([]);
  const [sortedPageSize, setSortedPageSize] = useState(10);
  const [favoritePageSize, setFavoritePageSize] = useState(4);
  const [searchItem, setSearchItem] = useState('');


  const loadFavorite = async () => {
    let pageSize;

    if(screenWidth >= 1200) pageSize = 4;
    else if(screenWidth >= 744 && screenWidth < 1200) pageSize = 2;
    else pageSize = 1;

    setFavoritePageSize(pageSize);

    const response = await getProduct(1, favoritePageSize, 'favorite');
    setFavoriteItems(response.list);
  }

  const loadSorted = async () => {
    let pageSize;

    if(screenWidth >= 1200) pageSize = 10;
    else if(screenWidth >= 744 && screenWidth < 1200) pageSize = 6;
    else pageSize = 4;

    setSortedPageSize(pageSize);

    const response = await getProduct(1, sortedPageSize, sort, searchItem);
    setSortedItems(response.list);
  }

  const handleSearch = (e) => {
    setSearchItem(e.target.value);
  }

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    
    loadFavorite();
    loadSorted();

  }, [screenWidth, sort, searchItem]);

  return (
    <div className="app__container">
      <Header/>
      <main className="main__container">
        <ProductList items={favoriteItems} label='베스트 상품' />
        <ProductList items={sortedItems} label='판매 중인 상품' setSort={setSort} onSearch={handleSearch} />
      </main>
      <Footer/>
    </div> 
  );
}

export default Items;
