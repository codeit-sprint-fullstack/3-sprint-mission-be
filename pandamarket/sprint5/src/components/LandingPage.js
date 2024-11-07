// src/components/LandingPage.js
import React from 'react';
import '../style/landing.css';
import logo from '../img/landing_header.png'
import pandaImg from '../img/panda.png'
import section2 from '../img/sec1_img.png'
import section3 from '../img/sec2_img.png'
import section4 from '../img/sec3_img.png'
import section5 from '../img/sec5_img.png'
import facebook from '../img/facebook.png'
import twitter from '../img/twitter.png'
import youtube from '../img/youtube.png'
import insta from '../img/insta.png'
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      <header>
        <div>
          <a href="/">
            <img
              src={logo}
              alt="판다마켓 로고"
              width="153"
              height="51"
            />
          </a>
        </div>
        <a href="/login.html" className="btn-font login-btn">로그인</a>
      </header>

      <main>
        <section className="section1">
          <div className="section1_block">
            <div className="section1_title_layer">
              <div className="section1_title">
                일상의 모든 물건을<br />
                거래해 보세요
              </div>
              <div className="show-btn">
                {/* <a href="/items.html" className="btn-font">구경하러 가기</a> */}
                <Link to='/items' className='btn-font'>구경하러 가기</Link>
              </div>
            </div>
            <div> 
              <img src={pandaImg} alt="panda img" className="section1_image" />
            </div>
          </div>  
        </section>

        <section className="section2">
          <div className="section2_block">
            <div>
              <img src={section2} alt="section2" className="section2_image" />
            </div>
            <div className="section2_title">
              <p className="section2_word1">Hot item</p>
              <p className="section2_word2">인기 상품을<br />확인해 보세요</p>
              <p className="section2_word3">가장 HOT한 중고거래 물품을<br />판다 마켓에서 확인해 보세요</p>
            </div>
          </div>
        </section>

        <section className="section2">
          <div className="section3_block">
            <div className="section3_title">
              <p className="section2_word1">Search</p>
              <p className="section2_word2">구매를 원하는<br />상품을 검색하세요</p>
              <p className="section2_word3">구매하고 싶은 물품은 검색해서<br />쉽게 찾아보세요</p>
            </div>
            <div>
              <img src={section3} alt="section3" className="section2_image" />
            </div>
          </div>
        </section>

        <section className="section2">
          <div className="section2_block">
            <div>
              <img src={section4} alt="section4" className="section2_image" />
            </div>
            <div className="section2_title">
              <p className="section2_word1">Register</p>
              <p className="section2_word2">판매를 원하는<br />상품을 등록하세요</p>
              <p className="section2_word3">어떤 물건이든 판매하고 싶은 상품을<br />쉽게 등록하세요</p>
            </div>
          </div>
        </section>

        <section className="section5">
          <div className="section5_block">
            <div className="section5_title_layer">
              <div className="section5_title">
                믿을 수 있는<br />판다 마켓 중고 거래
              </div>
            </div>
            <div>
              <img src={section5} alt="section5" className="section5_image" />
            </div>
          </div>
        </section>

        <footer>
          <div className="footer_block">
            <p className="footer_left">©codeit - 2024</p>
            <div className="footer_mid">
              <a href="/privacy.html" className="mid_font">Privacy Policy</a>
              <a href="faq.html" className="mid_font">FAQ</a>
            </div>
            <div className="sns">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                <img src={facebook} className="sns_font" alt="facebook image" />
              </a>
              <a href="https://x.com/?lang=ko" target="_blank" rel="noopener noreferrer">
                <img src={twitter} className="sns_font" alt="twitter image" />
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                <img src={youtube} className="sns_font" alt="youtube image" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                <img src={insta} className="sns_font" alt="instagram image" />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
