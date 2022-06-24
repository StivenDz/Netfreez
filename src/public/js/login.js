const eye = document.getElementById('eye');
const inputPassword = document.getElementById('password');
const logo = document.getElementById('logo');

logo.addEventListener('click',()=>{
    location.href = '/';
})

eye.addEventListener('click',(e)=>{
    eye.classList.toggle('fa-eye-slash');
    eye.classList.toggle('fa-eye');
    if(inputPassword.type == 'password'){
        inputPassword.type = 'text';
    }else{
        inputPassword.type = 'password';
    }
})