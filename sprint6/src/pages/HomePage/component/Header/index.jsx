import './index.css';
import '../../../../styles/global.css';
import pandaLogoImg from '../../../../img/logo/panda-market-logo.png';
import pandaLogoTextImg from '../../../../img/logo/panda-text-log.png';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav className='nav'>
        <div id='navContent'>
          <a id='logoImg' href='./'>
            <img id='pandaLogoImg' src={pandaLogoImg} alt='pandaMarketLogo' />
            <img id='pandaLogoText' src={pandaLogoTextImg} alt='pandaMarketLogo' />
          </a>
          <button id='loginButtn'><Link to="/login">로그인</Link></button>
        </div>
      </nav>
    </header>
  )
}

export default Header;