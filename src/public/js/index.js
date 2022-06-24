const logo = document.getElementById('logo');

logo.addEventListener('click', () => {
    location.href = '/';
})

const form = document.getElementById('form-register');

form.addEventListener('submit',(e)=>{
    e.preventDefault();
})