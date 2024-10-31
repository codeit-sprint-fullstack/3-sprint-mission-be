import React from "react";
import './index.css';
import Header from '../../components/Header/index.jsx';
import Footer from '../../components/Footer/index.jsx';
import Ximg from '../../img/icons/ic_X.png';

function AddItemPage() {
  return (
    <>
      <Header textBlue='items' />
        <div id='mainContent'>
          <div id='registerBox' className='mainWidth'>
            <h1>상품 등록하기</h1>
            <button>등록</button>
          </div>

          <div id='prodNmaeBox' className='mainWidth'>
            <h1>상품명</h1>
            <input type='text' placeholder='상품명을 입력해주세요' />
          </div>

          <div id='prodIntroBox' className='mainWidth'>
            <h1>상품 소개</h1>
            <input type='text' placeholder='상품 소개를 입력해주세요' />
          </div>

          <div id='prodPriceBox' className='mainWidth'>
            <h1>판매가격</h1>
            <input type='text' placeholder='판매 가격을 입력해주세요' />
          </div>

          <div id='prodTagsBox' className='mainWidth'>
            <h1>태그</h1>
            <input type='text' placeholder='태그를 입력해주세요' />
            <div id='tagBox'>
              <div className='tag' style={{ marginLeft: '0' }}>
                <span>#태그</span>
                <img src={Ximg} alt='Ximg' />
              </div>
              <div className='tag'>
                <span>#태그</span>
                <img src={Ximg} alt='Ximg' />
              </div>
            </div>
          </div>

        </div>
      <Footer />
    </>
  )
}

export default AddItemPage;