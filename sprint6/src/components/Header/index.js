import './index.css';
import pandaLogoImg from '../../img/panda-market-logo.png';

function Header() {
  return (
    <header>
      <nav className='nav'>
        <div id='navContent'>
          <a id='logoImg' href='./'>
            <img src={pandaLogoImg} alt='pandaMarketLogo' />
          </a>

          <div id='textBox'>
            <div className='text'><a href="/">자유게시판</a></div>
            <div className='text'><a href="/">중고마켓</a></div>
          </div>

          <a href="/로그인" id='loginButtn'>로그인</a>
        </div>
      </nav>
    </header>
  )
}

export default Header;