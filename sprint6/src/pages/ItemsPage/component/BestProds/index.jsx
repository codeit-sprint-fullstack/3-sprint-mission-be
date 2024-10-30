import heartImg from "../../../../img/icons/heart.png";
import "./index.css";

function BestProds({ index, images, name, price, favoriteCount }) {
  return (
    <div className="bestProducts" key={index}>
      <img className="bestProsImg" src={images} alt="bestProducts" />
      <div className="prodName">{name}</div>
      <div className="prodPrice">{price}원</div>
      <img src={heartImg} className="heart" alt="heart" />
      <span className="heartNum">{favoriteCount}</span>
    </div>
  );
}

export default BestProds;
