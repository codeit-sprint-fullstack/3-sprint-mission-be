import "./HomePage.css";
import homeTopImg from "../imgs/Img_home_top.png";
import hotItemsImg from "../imgs/feature2-image.png";
import searchItemsImg from "../imgs/Img_home_03.png";
import registerItemsImg from "../imgs/feature2-image.png";
import homeBottomImg from "../imgs/bottom-banner-image.png";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      {/* <!-- 홈 구분 div --> */}
      <section class="home">
        {/* <!-- 컨텐츠들을 담을 div --> */}
        <div class="homeContentBox">
          {/* <!-- 왼쪽 컨텐츠 담을 div --> */}
          <div className="homeLeftContent">
            <div className="homeLeftInner">
              <div className="homeText">일상의 모든 물건을 거래해보세요</div>
              <Link to="/items">
                <a className="homeLeftContentBt" href="items.html">
                  구경하러 가기
                </a>
              </Link>
            </div>
          </div>
          <div className="homeRightContentBox">
            <img className="homeRightImg" src={homeTopImg} alt="topImg" />
          </div>
        </div>
      </section>
      {/* <!-- 인기상품 div --> */}
      <section className="popularItems">
        <div className="popularItemsBox">
          <div className="popItemLeftContentImgBox">
            <img
              className="popularItemsImg"
              src={hotItemsImg}
              alt="popularImg"
            />
          </div>
          <div className="popItemRightContentText">
            <div className="hotItem">Hot item </div>
            <div className="hotItemText1">
              인기상품을 <br />
              확인해 보세요
            </div>
            <div className="hotItemText2">
              가장 HOT한 중고거래 물품을
              <br />
              판다 마켓에서 확인해 보세요
            </div>
          </div>
        </div>
      </section>
      {/* <!-- 상품검색 div --> */}
      <section className="search">
        <div className="searchBox">
          <div className="searchLeftContentTextBox">
            <div className="searchText">Search </div>
            <div className="searchText1">
              구매를 원하는 <br />
              상품을 검색하세요
            </div>
            <div className="searchText2">
              구매하고 싶은 물품은 검색해서
              <br />
              쉽게 찾아보세요
            </div>
          </div>
          <div className="searchRightImgBox">
            <img className="searchImg" src={searchItemsImg} alt="searchImg" />
          </div>
        </div>
      </section>
      {/* <!-- 상품등록 div --> */}
      <section className="register">
        <div className="registerBox">
          <div className="registerLeftContentImgBox">
            <img
              className="registerImg"
              src={registerItemsImg}
              alt="registerImg"
            />
          </div>
          <div className="registerRightContentText">
            <div className="registerText">Register </div>
            <div className="registerText1">
              판매를 원하는 <br />
              상품을 등록하세요
            </div>
            <div className="registerText2">
              어떤 물건이든 판매하고 싶은 상품을
              <br />
              쉽게 등록하세요
            </div>
          </div>
        </div>
      </section>
      {/* <!-- 하단 배너 --> */}
      <section className="footerImg">
        <div className="footerContentBox">
          <div className="footerLeftContent">
            <h1>
              믿을수 있는 <br />
              판다마켓 중고거래
              <br />
            </h1>
          </div>
          <div className="footerRightContentBox">
            <img
              className="footerRightImg"
              src={homeBottomImg}
              alt="footerRightImg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
