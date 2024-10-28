import { Link } from "react-router-dom";
import "../style/header.css";
import logo from '../img/logo.png';

function Header() {
  return (
    <header className="header__box">
      <div className="header__box__left">
        <Link to="/"><a href="/basic/index.html">
          <img alt="로고 이미지" src={logo} width='150'/>
        </a>
        </Link>
        <a className="word">자유게시판</a>
        <a className="word" href="/">중고마켓</a>
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
