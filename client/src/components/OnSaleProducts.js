import ProductInfo from "./ProductInfo";
import "./OnSale.css";

export function OnSaleProducts({ items, imgSize }) {
  return (
    <>
      {items.map((product) => (
        <ProductInfo
          key={product.id}
          name={product.name}
          price={product.price}
          like={product.favoriteCount}
          imgSize={imgSize}
        />
      ))}
    </>
  );
}
