import "./LoginPage.css";
import pandaLogo from "../imgs/pandaMarketLogo.png";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div>
      <div className="wrap">
        {/* <!-- 로그인 요소들을 감싸는 박스 -->
        <!-- flex, width 값을 줌 -->
        <!-- 안에는 section 별로 이메일, 비밀번호, 로그인 버튼, 간편 로그인, 회원가입 나눔 --> */}
        <div className="loginContainer">
          <section className="pandaLogo">
            <div className="pandaLogoCon">
              <Link to="/">
                <a href="index.html">
                  <img id="pandaLogoImg" src={pandaLogo} alt="pandaLogoImg" />
                </a>
              </Link>
            </div>
          </section>
          <section className="email">
            <h1 className="boldText">이메일</h1>
            <input
              className="inputStyle"
              id="emailInput"
              type="text"
              placeholder="이메일을 입력해주세요"
            />
            <span className="errorText" id="emailError"></span>
          </section>
          <section className="password">
            <h1 className="boldText">비밀번호</h1>
            <div className="inputEye">
              <input
                className="inputStyle"
                id="pwInput"
                type="password"
                placeholder="비밀번호를 입력해주세요"
              />
              <i id="eyeIcon" class="fa fa-solid fa-eye-slash"></i>
              <span className="errorText" id="pwError"></span>
            </div>
          </section>
          <section>
            <a href="./login" id="loginBt">
              <div id="likeBtA">로그인</div>
            </a>
            {/* <!-- <button class="loginBtStyle" id="loginBt" disabled> 로그인</button> --> */}
          </section>
          <section className="simpleLogin">
            <div className="simpleLoginCon">
              <div className="simpleLogoText">간편 로그인하기</div>
              <div className="linkImgs">
                <a href="https://www.google.com/" target="_blank">
                  <img className="smallImg" src="imgs/Component 2@2x.png" />
                </a>
                <a href="https://www.kakaocorp.com/page/" target="_blank">
                  <img className="smallImg" src="imgs/Component 3@2x.png" />
                </a>
              </div>
            </div>
          </section>
          <section className="signUpQuestion">
            판다 마켓이 처음이신가요?
            <a href="signup.html">회원가입</a>
          </section>
        </div>
      </div>

      <div id="modal">
        <div className="modalPopup">
          <div id="modalText">fafasfasdfasdsf</div>
          <button id="modalBt" class="smallBt">
            확인
          </button>
        </div>
      </div>

      {/* <!-- js 파일 불러오기 --> */}
      <script src="login.js"></script>
    </div>
  );
}

export default LoginPage;
