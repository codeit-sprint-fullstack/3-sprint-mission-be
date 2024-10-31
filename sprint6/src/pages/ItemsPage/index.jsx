import { useState, useEffect } from "react";
import './index.css';
// images
import arrowImg from "../../img/icons/menu.png";
import leftArrow from "../../img/icons/left.png";
import rightArrow from "../../img/icons/right.png";
// 
import Header from '../../components/Header/index.jsx';
import Footer from '../../components/Footer/index.jsx';
import getProducts from "../../api/api.js";
import BestProds from "./component/BestProds/index.jsx";
import Prods from "./component/Prods/index.jsx";
import EmptyBox from "./component/EmptyBox/index.jsx";

const BEST_PRODS_LIST = 'page=1&pageSize=4&orderBy=favorite';
const LIKE_PRODS_LIST = 'page=1&pageSize=10&orderBy=favorite';
const PRODS_LIST = 'page=1&pageSize=10&orderBy=recent';

function ItemsPage() {
  // Use State
  const [bestProds, setBestProds] = useState([]); // 베스트 상품
  const [prodsList, setProdsList] = useState([]); // 판매 중인 상품
  const [filter, setFilter] = useState(false); // 필터 메뉴 Hide
  const [prodsListState, setProdsListState] = useState(false); // 필터 종류에 따라 버튼의 기능이 변함
  const [searchProdInput, setSearchProdInput] = useState(); // 상품 검색시 검색한 텍스트가 담김
  const [emptyBox, setEmptyBox] = useState(false); // 상품 검색 목록이 없을 때 나오는 메시지
  const [filterSort, setFilterSort] = useState('최신순')

  // 화면이 켜지자마자 렌더링
  const loadHandle = async () => {
    const bestProducts = await getProducts(BEST_PRODS_LIST);
    const products = await getProducts(PRODS_LIST);
    setBestProds(bestProducts.list);
    setProdsList(products.list);
  }

  useEffect(() => {
    loadHandle()
  }, [])

  // 판매 중인 상품 렌더링
  const ProductSort = ({ sort }) => {
    return (
      sort.map((prod) => {
        return <Prods key={prod.id} price={prod.price} images={prod.images} name={prod.name} favoriteCount={prod.favoriteCount} />
      })
    )
  }

  // 최근순 렌더링
  const recentSortHandle = async () => {
    const products = await getProducts(PRODS_LIST);
    setProdsList(products.list)
  }

  const recentFilterHandle = () => {
    setProdsListState(false); // 필터 종류에 따라 버튼 기능 변화
    filterHideHandle(); // 필터 메뉴 Hide 이벤트
    recentSortHandle(); // 최근순 렌더링 작동
    setEmptyBox(false); // EmptyBox(상품 없을 때) 사라지게 함.
    setFilterSort('최신순') // 필터 메뉴 텍스트 바뀜.
  }

  // 좋아요순 렌더링
  const favoriteSortHandle = async () => {
    const favoriteProducts = await getProducts(LIKE_PRODS_LIST);
    setProdsList(favoriteProducts.list)
  };

  const likeFilterHandle = async () => {
    setProdsListState(true); // 필터 종류에 따라 버튼 기능 변화
    filterHideHandle(); // 필터 메뉴 Hide 이벤트
    favoriteSortHandle() // 좋아요순 렌더링 작동
    setEmptyBox(false); // EmptyBox(상품 없을 때) 사라지게 함.
    setFilterSort('좋아요순') // 필터 메뉴 텍스트 바뀜.
  }

  // 상품 검색
  const searchProdHandle = async (e) => {
    const query = `keyword=${searchProdInput}`
    const searchedProd = await getProducts(query)
    if (e) {
      if (searchedProd.list.length === 0) {
        setEmptyBox(true)
        return setProdsList(searchedProd.list);
      }
      setEmptyBox(false)
      return setProdsList(searchedProd.list)
    }
  }

  const searchprodInput = (e) => {
    setSearchProdInput(e.target.value)
    searchProdHandle(e.key)
  }

  // 필터 종류에 따른 페이지 버튼 핸들러
  const PageButtonRenderHandle = () => {
    if (prodsListState) {
      return <PageButtonlike />
    } else {
      return <PageButtonRecent />
    }
  }

  // 페이지네이션 버튼 RECENT
  const PageButtonRecent = () => {

    const pageNationHndle = async (e) => {
      const query = `page=${e.target.textContent}&pageSize=10`

      const prodsList = await getProducts(query)
      setProdsList(prodsList.list)
    }
    const button = [];

    for (let i = 1; i <= 5; i++) {
      button.push(
        <button key={i} onClick={pageNationHndle}>{i}</button>
      )
    }
    return button
  }

  // 페이지네이션 버튼 LIKE
  const PageButtonlike = () => {

    const pageNationHndle = async (e) => {
      const query = `page=${e.target.textContent}&pageSize=10&orderBy=favorite`

      const favoriteProdsList = await getProducts(query)
      setProdsList(favoriteProdsList.list)
    }

    const button = [];

    for (let i = 1; i <= 5; i++) {
      button.push(
        <button key={i} onClick={pageNationHndle}>{i}</button>
      )
    }
    return button
  }

  // 필터 메뉴에 hide 이벤트
  const filterHideHandle = () => {
    setFilter(!filter)
  }

  return (
    <>
      <Header />
      <main>
        <div id='mainContent'>
          <h1>베스트 상품</h1>
          <section id='bestProdsList'>
            {
              bestProds.map((prod) => {
                return <BestProds key={prod.id} price={prod.price} images={prod.images} name={prod.name} favoriteCount={prod.favoriteCount} />
              })
            }
          </section>

          <section id='prodsList'>
            <div id='prodsListHead'>
              <h1 id='title'>판매 중인 상품</h1>
              <div id='filterMenuBox' className={filter ? '' : 'none'}>
                <button onClick={recentFilterHandle} id='filterMenuRecent' className='filterMenu'>최신순</button>
                <button onClick={likeFilterHandle} id='filterMenuLike' className='filterMenu'>좋아요순</button>
              </div>
              <div id='formContain'>
                <input id='serchInput' type='text' placeholder='검색할 상품을 입력해주세요' onKeyDown={searchprodInput}></input>
                <button id='addProdButton'>상품 등록하기</button>
                <button onClick={filterHideHandle} className='filterMenu'>{filterSort}
                  <img src={arrowImg} id='arrowImg' alt="arrow" />
                </button>
              </div>
            </div>
            <div id='componentBox'>
              <ProductSort sort={prodsList} />
              <EmptyBox run={emptyBox} />
            </div>
            <div id='pageNumBox'>
              <button>
                <img src={leftArrow} alt="left arrow" />
              </button>
              <PageButtonRenderHandle />
              <button style={{ marginRight: '0' }}>
                <img src={rightArrow} style={{ left: '0.1rem' }} alt="right arrow" />
              </button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ItemsPage;