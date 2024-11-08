import React from 'react';
import './landingpage.css'; 
import HomeTopimg from './img/Img_home_top.png'
import HomeImg02 from './img/Img_home_01.png'
import HomeImg03 from './img/Img_home_02.png'
import HomeImg04 from './img/Img_home_03.png'
import HomeImg05 from './img/Img_home_bottom.png'
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-text">
          <h1>일상의 모든 물건을<br/>
           거래해 보세요</h1>
           <Link to="/items" className="no-underline">
          <button className="homebutton">구경하러 가기</button>
          </Link>
        </div>
        <img src={HomeTopimg} alt="메인 팬더 이미지" className="main-image" />
      </header>

      <section className="sectionpopular">
        <img src={HomeImg02} alt="인기상품확인 className=section1img" />
        <div className="text-content">
        <span className="subtitle">Hot item</span>        
        <h2>인기 상품을<br/> 확인해 보세요</h2>
        <p>가장 HOT한 중고거래 물품을 <br/>판다 마켓에서 확인해 보세요</p>
        </div>
      </section>

      <section className="sectionpopular reverse">
        <img src={HomeImg03} alt="구매검색" />
        <div className="tex-content text-content-right">
        <span className="subtitle">Search</span>
        <h2>구매를 원하는<br/> 상품을 검색하세요</h2>
        <p>구매하고 싶은 물품은 검색해서<br/>쉽게 찾아보세요</p>
        </div>
      </section>


      <section className="sectionpopular">
        <img src={HomeImg04} alt="인기상품확인 className=section1img" />
        <div className="text-content">
        <span className="subtitle">Register</span>        
        <h2>판매를 원하는<br/> 상품을 등록하세요</h2>
        <p>어떤 물건이든 판매하고 싶은 상품을 <br/>쉽게 등록하세요</p>
        </div>
      </section>



      <section className="sectionbottom">
        <div className="bottom-text">
        <h2>믿을 수 있는<br/>판다마켓 중고거래</h2>
        </div>
        <img src={HomeImg05} alt="바텀이미지" />

      </section>
    </div>
  );
}

export default LandingPage;
