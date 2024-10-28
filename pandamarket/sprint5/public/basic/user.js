const email = document.querySelector('#email');
const emailError = document.querySelector('#emailError');
const password = document.querySelector('#password');
const passwordError = document.querySelector('#passwordError');
const confirmPassword = document.querySelector('#confirmPassword');
const confirmError = document.querySelector('#confirmError');
const loginBtn = document.querySelector('#loginButton');
const signUpBtn = document.querySelector('#signUpButton');
const eyesBtn = document.querySelector('.eyes');

const USER_DATA = [
  {email:'codeit1@codeit.com',password:'codeit101!'},
  {email:'codeit2@codeit.com',password:'codeit202!'},
  {email:'codeit3@codeit.com',password:'codeit303!'},
  {email:'codeit4@codeit.com',password:'codeit404!'},
  {email:'codeit5@codeit.com',password:'codeit505!'},
  {email:'codeit6@codeit.com',password:'codeit606!'},
]

eyesBtn.addEventListener('click', function() {
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type',type);
})

email.addEventListener('keydown',function(event){
  if(event.key === 'Enter'){
    event.preventDefault();
    email_validation();
  }
});

email.addEventListener('focusout',email_validation);

password.addEventListener('keydown',function(event){
  if(event.key == 'Enter'){
    event.preventDefault();
    password_validation();
  }
});

password.addEventListener('focusout',password_validation);


function email_validation() {
  if(!email.value){
    email.classList.add('input_error_outline');
    emailError.textContent = '이메일을 입력해주세요.';
    return false;
  }

  const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
  if(!pattern.test(email.value)){
    email.classList.add('input_error_outline');
    emailError.textContent = '잘못된 이메일 형식입니다.';
    return false;
  }
   else {
    emailError.textContent = '';
    email.classList.remove('input_error_outline');
    return true;
  }
};

function password_validation() {
  if(!password.value){
    password.classList.add('input_error_outline');
    passwordError.textContent = '비밀번호를 입력해주세요.';
    return false;
  }

  
  if(password.value.length < 8){
    password.classList.add('input_error_outline');
    passwordError.textContent = '비밀번호를 8자 이상 입력해주세요.';
    return false;
  }
   else {
    passwordError.textContent = '';
    password.classList.remove('input_error_outline');
    return true;
  }
};

if(window.location.href.includes('signup')){
  confirmPassword.addEventListener('keydown',function(event){
      if(event.key == 'Enter'){
      event.preventDefault();
      confirm_validation();
    }
  });

  confirmPassword.addEventListener('keydown',() => {
    if(confirm_validation() && btnActivator()){
     signUpBtn.disabled = false;
     signUpBtn.setAttribute('style','cursor:pointer');
    }
    else {
     signUpBtn.disabled = true;
    }
  })
} else {    //login.html 일때
  email.addEventListener('keydown', btnActivator);
  password.addEventListener('keydown',btnActivator);
} 
      
function btnActivator(){
  if(email_validation() && password_validation()){  
   if(window.location.href.includes('login')){
    loginBtn.disabled = false; 
   loginBtn.setAttribute('style','cursor:pointer');
   }
    return true;
  }
  else {
   loginBtn.disabled = true;
   signUpBtn.disabled = true;
    return false;
  }
}

function confirm_validation(){
  if(password.value != confirmPassword.value){
    confirmPassword.classList.add('input_error_outline');
    confirmError.textContent = '비밀번호가 일치하지 않습니다.';
    return false;
  }
  else {
    confirmError.textContent = '';
    confirmPassword.classList.remove('input_error_outline');
    return true;
  }
}

const modal = document.querySelector('.modal');

if(window.location.href.includes('login')){
loginBtn.addEventListener('click', login_alert);
} else {
  signUpBtn.addEventListener('click',signUp_alert);
}

function login_alert() {
  const user = USER_DATA.find((data) => data.email == email.value);

  if(user){
    const idx = USER_DATA.indexOf(user);
    console.log(USER_DATA[idx]);
    if(USER_DATA[idx].password === password.value){
      window.location.href = '/items.html';
    } else {
      modal.style.display = 'block';
    }
  } else {
    modal.style.display = 'block';
  }
}

function signUp_alert() {
  const user = USER_DATA.find((data) => data.email == email.value);

  if(user) {
    modal.style.display = 'block';
  } else {
    window.location.href = '/login.html';
  }
}

const okBtn = document.querySelector('.ok_btn');

okBtn.addEventListener('click',()=> {
  modal.style.display = 'none';
});
