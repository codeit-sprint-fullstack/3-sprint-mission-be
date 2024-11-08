import "./OnSale.css";
import Dropdown from "./DropDown";
import { Link } from "react-router-dom";

export function OnSaleBanner({ options, order, orderChange }) {
  return (
    <div className="onSaleBanner">
      <div className="textBold">판매 중인 상품</div>
      <div className="rightBanner">
        <input
          className="OnSaleInput"
          placeholder="검색할 상품을 입력해주세요"
        />
        <Link to="/registration" className="registerBt">
          상품 등록하기
        </Link>
        <Dropdown
          options={options}
          selectedOrder={order}
          orderChange={orderChange}
        />
      </div>
    </div>
  );
}
