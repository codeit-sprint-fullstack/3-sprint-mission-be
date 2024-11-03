import '../style/header.css';
import Header from './Header';
import '../style/registration.css'
import Footer from './Footer';
import { useEffect, useState } from 'react';
import { postProduct } from '../Api';
import { useNavigate } from 'react-router-dom';
import iconX from '../img/iconX.png';

function Registration() {
  const [formData, setFormData] = useState({
    name:'',
    description:'',
    price:'',
    tag:''
  });

  const navigate = useNavigate();

  const [chips,setChips] = useState([]);
  const [isComposing, setIsComposing] = useState(false);

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);

  const handleFormData = (e) => {
    const { name, value } = e.target;
      setFormData({
        ...formData,
        [name] : value, 
      });
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      const dt = {
        ...formData,
        tag: chips,
      }
      await postProduct(dt);
      navigate('/tmp');
    } catch(err) {
      alert('상품 등록 실패');
    }
  }

  const handleKeyDown = (e) => {
    if(e.key != 'Enter'|| isComposing) return;
    e.preventDefault();
    const value = e.target.value;
    if(!value.trim()) return;
    setChips([...chips, value]);
    e.target.value = "";
    setFormData({
      ...formData,
      tag:'',
    });
  
  }

  const handleDeleteChip = (deleteidx) => {
    setChips(chips.filter((chip, idx) => idx != deleteidx));  
  }

  return (
    <div className='registration__container'>
      <Header/>
      <form onSubmit={handleSumbit}>    
        <div className='form__head'>
          <h2>상품 등록하기</h2>
          <button type='submit' disabled={!Object.values(formData).some(value => value !== '')}>등록</button>
        </div>
        <label>상품명</label>
        <input type='text' name='name' value={formData.name} placeholder='상품명을 입력해주세요' onChange={handleFormData} />
        <label>상품 소개</label>
        <textarea name='description' value={formData.description} placeholder='상품 소개를 입력해주세요'className='form__description' onChange={handleFormData} />
        <label>판매가격</label>
        <input type='number' name='price' value={formData.price} placeholder='판매 가격을 입력해주세요' onChange={handleFormData} />
        <label>태그</label>
        <input type='text' name='tag' value={formData.tag} 
          placeholder='태그를 입력해주세요' onChange={handleFormData} 
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          />
        <div>
          {chips.map((chip, idx) => {
            return (
            <div className='chip' key={idx}>
              <span>{chip}</span>
              <span onClick={()=>handleDeleteChip(idx)}><img src={iconX} className='iconX' alt="취소 이미지"></img></span>
            </div>
            );
          })}
        </div>
      </form>
      <Footer/>
    </div>
  )
};

export default Registration;