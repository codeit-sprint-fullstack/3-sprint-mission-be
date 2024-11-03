import ProductInfo from "./ProductInfo";
import "./BestProducts.css";

// const bestProductList = await getProductByLike();

export function BestProducts({ items, imgSize }) {
  return (
    <div className="bestProductCon">
      {items.map((product) => (
        <ProductInfo
          key={product.id}
          name={product.name}
          price={product.price}
          like={product.favoriteCount}
          imgSize={imgSize}
        />
      ))}
    </div>
  );
}
