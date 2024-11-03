// import { BestProducts } from "../components/BestProducts";
import { OnSaleProducts } from "../components/OnSaleProducts";
import { OnSaleBanner } from "../components/OnSaleBanner";
import { getProductsByOrder } from "../apis/productService";
// import {getProductByLike} from "../apis/productService";
import { PagiNation } from "../components/PagiNation";
import { useState, useEffect } from "react";
import "./ItemsPage.css";

function ItemsPage() {
  // 정렬 state
  const options = ["최신순", "좋아요순"];
  const [order, setOrder] = useState(options[0]);

  // 페이지 state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);

  // // 베스트 상품 state
  // const [bestProducts, setBestProducts] = useState([]);

  // 판매 중인 상품 state
  const [onSaleProducts, setOnSaleProducts] = useState([]);

  // //좋아요 순으로 정렬된 리스트 4개 가져와서 setState
  // useEffect(() => {
  //   async function getProducts() {
  //     const response = await getProductByLike();
  //     setBestProducts(response.list);
  //   }
  //   getProducts();
  // }, []);

  //드롭다운으로 정렬 종류 받아서 10개 가져오기
  useEffect(() => {
    async function getOnSaleProducts() {
      //order 가 최신순이면 recent 좋아요순이면 favorite 값 넘김
      const response = await getProductsByOrder(
        order === "최신순" ? "recent" : "favorite",
        currentPage
      );
      // 리스트 객체배열 할당
      setOnSaleProducts(response.list);
      // 총 페이지 계산
      setTotalPages(Math.ceil(response.totalCount / 10));
    }
    getOnSaleProducts();
  }, [order, currentPage]);

  // 정렬 클릭 함수 setOrder
  const handleOrderClick = (selectedOrder) => setOrder(selectedOrder);
  // 페이지 변경 함수
  const handlePageClick = (page) => setCurrentPage(page);

  const handlePrevGroup = () => {
    const prevGroup = pageGroup - 1;
    if (prevGroup >= 0) setPageGroup(prevGroup);
  };

  const handleNextGroup = () => {
    const nextGroup = pageGroup + 1;
    if (nextGroup * 5 < totalPages) setPageGroup(nextGroup);
  };
  return (
    <section className="contentsBody">
      {/* <div className="bestProducts">
        <div>
          <div className="textBold">베스트 상품</div>
          <BestProducts items={bestProducts} imgSize="bigImg" />
        </div>
      </div> */}
      <div className="onSaleProducts">
        <div className="onSaleCon">
          <OnSaleBanner
            options={options}
            order={order}
            orderChange={handleOrderClick}
          />
          <div className="productGrid">
            <OnSaleProducts items={onSaleProducts} imgSize="onSaleProductImg" />
          </div>
        </div>
      </div>
      <PagiNation
        currentPage={currentPage}
        totalPages={totalPages}
        pageGroup={pageGroup}
        onPageChange={handlePageClick}
        onPrevGroup={handlePrevGroup}
        onNextGroup={handleNextGroup}
      />
    </section>
  );
}
export default ItemsPage;
