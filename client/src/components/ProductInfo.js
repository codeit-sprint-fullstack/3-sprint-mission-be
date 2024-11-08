import "./ProductInfo.css";
import productImgEx from "../imgs/img_default.svg";

function ProductInfo({ name, price, like, imgSize }) {
  return (
    <div className="productInfo">
      <img src={productImgEx} className={imgSize} alt={name}></img>
      <div>{name}</div>
      <div>{price}원</div>
      <div>♡ {like}</div>
    </div>
  );
}
export default ProductInfo;
