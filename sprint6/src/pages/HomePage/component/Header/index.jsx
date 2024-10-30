import './index.css';
import pandaLogoImg from '../../../../img/logo/panda-market-logo.png';
import pandaLogoTextImg from '../../../../img/logo/panda-text-log.png';

function Header() {
  return (
    <header>
      <nav className='nav'>
        <div id='navContent'>
          <a id='logoImg' href='./'>
            <img id='pandaLogoImg' src={pandaLogoImg} alt='pandaMarketLogo' />
            <img id='pandaLogoText' src={pandaLogoTextImg} alt='pandaMarketLogo' />
          </a>
          <a href="/로그인" id='loginButtn'>로그인</a>
        </div>
      </nav>
    </header>
  )
}

export default Header;