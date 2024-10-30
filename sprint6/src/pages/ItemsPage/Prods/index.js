import heartImg from '../../../img/icons/heart.png';
import './index.css';

function Prods({index, price, images, name, favoriteCount}) {
  
  return (
    <div className='products' key={index}>
      <img className='productsImg' src={images} alt='productImage' />
      <div className='prodName'>{name}</div>
      <div className='prodPrice'>{price}원</div>
      <img src={heartImg} className='heart' alt='heart' />
      <span className='heartNum'>{favoriteCount}</span>
    </div>
  )
}

export default Prods;