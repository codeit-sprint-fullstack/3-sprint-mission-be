import "./TopNav.css";
import pandaLogoImg from "../imgs/pandaMarketLogo.png";
import { Link, useLocation, NavLink } from "react-router-dom";

export function TopNav() {
  const location = useLocation();
  const isItemPage = location.pathname === "/items";
  const isFreePage = location.pathname === "/free";

  return (
    <section className="topNav">
      <div className="navCon">
        <div className="leftCon">
          {/* 판다로고 이미지 */}
          <NavLink to="/">
            <img id="logoImg" src={pandaLogoImg} alt="pandaMarketLogo" />
          </NavLink>
          {/* 자유게시판 & 중고마켓 */}
          <NavLink
            to="/free"
            className={`navLinkBt ${isFreePage ? "active" : ""}`}
          >
            자유게시판
          </NavLink>
          <NavLink
            to="/items"
            className={`navLinkBt ${isItemPage ? "active" : ""}`}
          >
            중고마켓
          </NavLink>
        </div>

        {/* 글씨 만이 아닌 여백을 클릭해도 링크 이동하기 위함 */}
        <Link to="/login" className="topNavLoginBt">
          로그인
        </Link>
      </div>
    </section>
  );
}
