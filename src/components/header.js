// src/components/Header.js
import React from 'react';
import './header.css';  // 스타일링 파일\
import pandaFace from './icons/panda_face.png';
import { Link } from 'react-router-dom';



function Header() {
  return (
    <header className="header">
      <div className="left">
        <div className="logo">
          <Link to="/" className="logo">
          <img src={pandaFace} alt="판다마켓로고" />
          <h1 className="panda_text">판다마켓</h1>
          </Link>
        </div>
        <nav className="nav">
        </nav>
      </div>
      <div className="login-button"> 
        <button>로그인</button>
      </div>
    </header>
  );
}

export default Header;
