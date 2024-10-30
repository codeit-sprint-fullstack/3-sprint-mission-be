import '../style/header.css';
import Header from './Header';
import '../style/registration.css'
import Footer from './Footer';

function Registration() {
  return (
    <div className='registration__container'>
      <Header/>
      <form>
        <div className='form__head'>
          <h2>상품 등록하기</h2>
          <button>등록</button>
        </div>
        <label>상품명</label>
        <input type='text' value="" placeholder='상품명을 입력해주세요' />
        <label>상품 소개</label>
        <textarea name='description' placeholder='상품 소개를 입력해주세요'className='form__description'/>
        <label>판매가격</label>
        <input type='text' value="" placeholder='판매 가격을 입력해주세요' />
        <label>태그</label>
        <input type='text' value="" placeholder='태그를 입력해주세요' />
      </form>
      <Footer/>
    </div>
  )
};

export default Registration;