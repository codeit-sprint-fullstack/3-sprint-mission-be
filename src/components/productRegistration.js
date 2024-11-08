import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './productRegistration.css';

function ProductRegistration() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 상품 데이터 객체 생성
    const productData = {
      name,
      description,
      price: Number(price), // 숫자로 변환
      tags: tags.split(',').map(tag => tag.trim()) // 태그를 배열로 변환
    };

    try {
      // POST 요청 보내기
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();
      
      // 상품 등록 성공 시 해당 상품 상세 페이지로 이동
      if (response.ok) {
        const productId = data.product._id; // 등록된 상품의 ID
        navigate(`/products/${productId}`);
      } else {
        console.error('상품 등록 실패:', data.message);
      }
    } catch (error) {
      console.error('Error during product registration:', error);
    }
  };

  return (
    <section className="product-registration">
        <div className="registration-header">
        <h2>상품 등록하기</h2>
        <button onClick={handleSubmit}>등록</button>
      </div>
      <form>
        <label>상품명</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="상품명을 입력해주세요"
          required
        />
        
        <label>상품 소개</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="상품 소개를 입력해주세요"
          required
        ></textarea>
        
        <label>판매 가격</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="판매 가격을 입력해주세요"
          required
        />
        
        <label>태그</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="태그를 콤마(,)로 구분하여 입력해주세요"
        />
        
        
      </form>
    </section>
  );
}

export default ProductRegistration;
