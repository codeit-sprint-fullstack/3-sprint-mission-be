
//----------------------로그인 input 에러--------------------------------//

// 인풋 id 가져오기
const emailInput = document.getElementById("emailInput");
const pwInput = document.getElementById("pwInput");

// 에러 span id 가져오기
const emailError = document.getElementById("emailError");
const pwError = document.getElementById("pwError");

// 이메일에 값이 없을때, 이메일 형식에 맞지 않을 때 에러메세지와 input border 색 바꾸기
function checkEmailForm() {
    const emailValue = emailInput.value.trim();
    // 이메일 정규식
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //값이 없을 때
    if (emailValue === '') {
        emailError.textContent = "이메일을 입력해주세요";
        emailError.style.display = "inline";
        emailInput.classList.add("errorBorder");
        // 이메일 정규식을 비교하는 test 함수 이메일 값과 비교한다
    } else if (!emailPattern.test(emailValue)) {
        emailError.textContent = "잘못된 이메일 형식입니다";
        emailError.style.display = "inline";
        emailInput.classList.add("errorBorder");
        // 빈칸이 아니고 형식이 잘 맞으면 원래대로
    } else {
        emailError.style.display = "none";
        emailInput.classList.remove("errorBorder");
    }
    // 로그인 버튼 활성화 여부
    checkLoginForm();
}
//이벤트 리스너 등록
emailInput.addEventListener("blur", checkEmailForm);

// 비밀번호가 빈칸이거나 8자 미만이면 에러 메세지 + 테두리 빨강
function checkPwForm() {
    const pwValue = pwInput.value.trim();
    if (pwValue === '') {
        pwError.textContent = "비밀번호를 입력해주세요";
        pwError.style.display = "inline";
        pwInput.classList.add("errorBorder");
    } else if (pwValue.length < 8) {
        pwError.textContent = "비밀번호를 8자 이상 입력해주세요";
        pwError.style.display = "inline";
        pwInput.classList.add("errorBorder");
    } else {
        pwError.style.display = "none";
        pwInput.classList.remove("errorBorder");
    }
    // 로그인 버튼 활성화 여부
    checkLoginForm();
}
//이벤트 리스너 등록
pwInput.addEventListener("blur", checkPwForm);

//------------ 로그인 버튼 활성화 함수------------------------//

// 버튼 id, 스타일 클래스 가져오기
const loginBt = document.getElementById("loginBt");
const loginBtStyle = document.getElementById("likeBtA");

// 이메일이랑 비밀번호 형식 맞는지 확인 함수
function checkLoginForm() {
    // 이메일과 비밀번호의 에러 메세지의 display가 none이고 값이 있을 때 true 
    const isEmailValid = emailError.style.display === "none" && emailInput.value.trim() !== '';
    const isPwValid = pwError.style.display === "none" && pwInput.value.trim() !== '';
    // 둘 다 true이면 버튼 활성화
    if (isEmailValid && isPwValid) {
        loginBt.style.pointerEvents = "auto";
        loginBtStyle.style.backgroundColor = "#3692FF";
    } else {
        loginBt.style.pointerEvents = "none";
        loginBtStyle.style.backgroundColor = "#9CA3AF";
    }
}
//----------------------회원 ID,PW 임시 DB-------------------------------//
const USER_DATA = [
    { email: 'codeit1@codeit.com', password: "codeit101!" },
    { email: 'codeit2@codeit.com', password: "codeit202!" },
    { email: 'codeit3@codeit.com', password: "codeit303!" },
    { email: 'codeit4@codeit.com', password: "codeit404!" },
    { email: 'codeit5@codeit.com', password: "codeit505!" },
    { email: 'codeit6@codeit.com', password: "codeit606!" },
]
//-------------------로그인 성공 여부 모달 창 열기----------------------------------//
const modalText = document.getElementById("modalText");
const modal = document.getElementById("modal");

function loginCheck() {
    // 로그인 버튼 클릭할 때 입력된 이메일과 pw 값 가져오기 
    const enteredEmail = emailInput.value.trim();
    const enteredPw = pwInput.value.trim();

    // db에서 찾는 이메일과 비밀번호가 일치하는지 확인
    // find 함수 사용 -> 값이 있으면 isUser에 저장
    const isUser = USER_DATA.find(
        userDataObj => userDataObj.email === enteredEmail
            && userDataObj.password === enteredPw);
    // 값이 있으면 true
    if (isUser) {
        modal.style.display = "block";
        modalText.textContent = "로그인 성공";
    } else {
        modal.style.display = "block";
        modalText.textContent = "비밀번호가 일치하지 않습니다";
    }
}
loginBt.addEventListener("click", loginCheck);

//-------모달 버튼 닫으면 생기는 이벤트-성공하면 링크로 이동 실패하면 걍 모달 닫기-----//
const modalBt = document.getElementById("modalBt");

function closeModal(e){
    if(modalText.textContent ==="비밀번호가 일치하지 않습니다"){
        modal.style.display = "none";
        e.preventDefault();
        
    }else {
        location.href= 'items.html';
    }
}

modalBt.addEventListener("click", closeModal);

//----------------------비밀번호 보이기 && 눈 아이콘 변경----------------------//

// 아이콘 ID 불러오기
const eyeIcon = document.getElementById("eyeIcon");
// input의 타입이 password이면 text로 바꾸고 반대면 password로 바꾸기
// 아이콘 눈 모양 슬래쉬 바꾸기
function pwShow(){
    if(pwInput.type ==="password"){
        pwInput.type = "text";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }else{
        pwInput.type = "password";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
        
    }

}
eyeIcon.addEventListener("click", pwShow);