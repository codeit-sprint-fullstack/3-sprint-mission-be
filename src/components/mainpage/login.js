// src/components/Login.js
import React from 'react';
import './login.css';

function Login() {
  return (
    <div className="login-container">
      <div className="logo-section">
        <a href="/"><img src="/pandalogo2.png" alt="로고" className="logo" /></a>
      </div>

      <form className="login-form">
        <div className="tinyhead">이메일</div>
        <div className="input-group1">
          <div className="putemail">
            <input type="email" id="email" placeholder="이메일을 입력해주세요" required />
            <span className="error-message-mail" id="emailError"></span>
          </div>
        </div>

        <div className="tinyhead">비밀번호</div>
        <div className="input-group2">
          <input type="password" id="password" placeholder="비밀번호를 입력해주세요" required />
          <span className="error-message-password" id="passwordError"></span>
          <button type="button" className="toggle-password">
            <img src="/btn_visibility_on_24px.png" alt="토글패스워드" />
          </button>
        </div>

        <button type="submit" className="login-btn" disabled>로그인</button>

        <div className="social-login">
          <div className="easylogin">간편 로그인하기</div>
          <div className="googlekakao">
            <a href="https://www.google.com">
              <img src="/google_logo.png" className="google" alt="구글 로그인" />
            </a>
            <a href="https://www.kakaocorp.com/page/">
              <img src="/kakaotalk_logo.png" className="kakao" alt="카카오 로그인" />
            </a>  
          </div>
        </div>

        <p className="signup-link">
          판다마켓 처음이신가요? <a href="/register">회원가입</a>
        </p>
      </form>

      <div id="modal" className="modal">
        <div className="modal-content">
          <p id="modalMessage" className="modalmessage">모달 내용</p>
          <div className="modal-footer">
            <button className="close-modal-btn">확인</button> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
