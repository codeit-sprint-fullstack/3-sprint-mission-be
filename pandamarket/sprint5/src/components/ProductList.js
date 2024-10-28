
import '../style/productlist.css';
import likeIcon from '../img/LikeIcon.png';
import { useState } from 'react';


function ProductItem({ item , label }) {
  const {id, name, description, price, images, favoriteCount, createdAt, updatedAt} = item;

  return (
    <div key={id} className={label === '베스트 상품' ? 'favoriteProductItem' : 'sortedProductItem'} >
      <img src={images} alt={name} />
      <div className='productItem__description'>{description}</div>
      <div>{price}원</div>
      <div>
        <img alt="좋아요 버튼" src={likeIcon} width='13.4'/>
        {favoriteCount}
      </div>
    </div>
  );
}

function ProductList({ items, label, setSort, onSearch }) {
  const handleSortChange = (e) => {
    setSort(e.target.value);
  }

  return (
    <div className='productList__container'>  
      { label === '베스트 상품' ? (<p className='productList__label'>{label}</p>)
        : (<div className='sortedProductList__label__box'>
            <p className='productList__label'>{label}</p>
            <div>
              <input type='search' placeholder='검색할 상품을 입력해주세요' onChange={onSearch} />
              <button type='button'>상품 등록하기</button>
              <select className='sortedSelect' onChange={handleSortChange}>
                <option value="recent">최신순</option>
                <option value="favorite">좋아요순</option>
              </select>
            </div>
          </div>) 
      }
      <div className={label === '베스트 상품' ? 'favoriteProductList' : 'sortedProductList'}>
        {items.map((item) => (
          <ProductItem item={item}  label={label}/>
        ))}
      </div>
    </div>
  )
};

export default ProductList;