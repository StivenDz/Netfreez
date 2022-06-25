$(async () => {
    const socket = io();

    const validationEmail = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;

    const form = document.getElementById('form-login');
    const inputEmail = document.getElementById('email');
    const inputPassword = document.getElementById('password');
    const eye = document.getElementById('eye');

    // inputEmail.value = 'stivendiazh@gmail.com';

    const logo = document.getElementById('logo');

    logo.addEventListener('click', () => {
        location.href = '/';
    })

    eye.addEventListener('click', (e) => {
        eye.classList.toggle('fa-eye-slash');
        eye.classList.toggle('fa-eye');
        if (inputPassword.type == 'password') {
            inputPassword.type = 'text';
        } else {
            inputPassword.type = 'password';
        }
    })

    const invalid = (input)=>{
        input.classList.add('invalid');
        
        setTimeout(()=>{
            input.classList.remove('invalid');
        },2000);
    }
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formDataLogin = new FormData(e.target);
        const dataUser = {
            email: formDataLogin.get('Email'),
            password: formDataLogin.get('Password')
        };
        if(!validationEmail.exec(dataUser.email) || dataUser.email.slice(-4) != '.com') {
            invalid(inputEmail);
        }if(dataUser.password.length < 7){
            invalid(inputPassword);
        } else {
            socket.emit('auth',(dataUser),(cb)=>{
                if(!cb){
                    invalid(inputEmail);
                    invalid(inputPassword);
                }else{
                    form.reset();
                    location.href = '/home';
                };
            })
        };
    });
});