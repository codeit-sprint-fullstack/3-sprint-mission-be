import { Link, NavLink } from "react-router-dom";
import "./index.css";
import pandaLogoImg from "../../../../img/logo/panda-market-logo.png";
import pandaLogoTextImg from '../../../../img/logo/panda-text-log.png';

const getLinkStyle = (isActive) => {
  return {
    color: isActive ? "#3692FF" : undefined,
  };
};

function Header() {
  return (
    <header>
      <nav className="nav">
        <div id="navContent">
          <Link to="/" id='logoImg'>
            <img id='pandaLogoImg' src={pandaLogoImg} alt='pandaMarketLogo' />
            <img id='pandaLogoText' src={pandaLogoTextImg} alt='pandaMarketLogo' />
          </Link>

          <div id="textBox">
            <div className="text">
              <Link to="/CommunityFeedPage">
                자유게시판
              </Link>
            </div>
            <div className="text">
              <NavLink to="/items" style={getLinkStyle}>
                중고마켓
              </NavLink>
            </div>
          </div>

          <button id="loginButtn">
            <Link to="/login">로그인</Link>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
