import { Link, useLocation } from "react-router-dom";
import "../style/header.css";
import logo from '../img/logo.png';

function Header() {
  const location = useLocation();

  return (
    <header className="header__box">
      <div className="header__box__left">
        <Link to="/">
          <img alt="로고 이미지" src={logo} width='150'/>
        </Link>
        <a className="word">자유게시판</a>
        <Link to='/items'>
        <p className="word" style={{ color: location.pathname === '/items' ? '#3692FF' : '#4B5563' }}>
        중고마켓</p>
        </Link>
      </div>

      <button className="header__box__right" onClick={()=>{
        window.location.href = "/basic/login.html"
      }}>
        로그인
      </button>
    </header>
  );
}

export default Header;
