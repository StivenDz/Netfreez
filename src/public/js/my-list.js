import { ApiYouTube } from "./ApiYouTube.js";
import { addOrDeleteToMyList, updateFavoriteSelected } from './addOrDeleteToMyList.js'

$(async () => {
    const socket = io();

    // NAVIGATION  ------------------------------------------------------------------------------


    const bars = document.getElementById('button-nav-res');
    const asideLinks = document.getElementById('aside-links');


    // bars es el boton responsive del menu
    bars.addEventListener('click', (e) => {
        // esta el menu res, con opacity cero
        //se le agrega opacity 1 y pointer events all y se cambia el icono de hamburguer a la X
        asideLinks.classList.toggle('opacity-pointer-events');
        bars.classList.toggle('fa-bars-staggered');
        bars.classList.toggle('fa-circle-xmark');

        // si la hambueguer cambio a x pasa lo siguiente
        // si se le da click a algo que no sea el nav responsive se ejecuta la funcion reset
        // reset es para que el nav responsive se cierre
        if (bars.classList.contains('fa-circle-xmark')) {
            const other = document.querySelectorAll('.other');
            for (let i = 0; i < other.length; i++) {
                other[i].addEventListener('touchmove', reset);
            }
            wantedMovie.addEventListener('click', reset);
        } else { // sino se remueve el evento de reset 
            const other = document.querySelectorAll('.other');
            for (let i = 0; i < other.length; i++) {
                other[i].removeEventListener('touchmove', reset, true);
            }
            wantedMovie.removeEventListener('click', reset, true);
        }
    });

    const reset = () => {
        asideLinks.classList.remove('opacity-pointer-events');
        bars.classList.add('fa-bars-staggered');
        bars.classList.remove('fa-circle-xmark');
    }

    // NAVIGATION END --------------------------------------------------------------

    const links = document.querySelectorAll('.links-nav');
    const myListContainer = document.querySelector('.myList');
    links[4].classList.add('selected');
    // El cuarto link del ehader adquiere esa clase


    let myList = [];
    let html = ``;

    const YT = ApiYouTube();

    const $searchForm = $('#search_movie');
    const wantedMovie = document.getElementById('wantedMovie');
    const $wantedMovie = $('#wantedMovie');
    const logo = document.getElementById('logo');

    const moviesWantedContainer = document.getElementById('wanted_movie_container');
    const $moviesWantedContainerJquery = $('.wanted_movie_containerJquery');

    const title = document.querySelectorAll('.add');
    const header = document.querySelector('.header');

    const buttons = document.querySelectorAll('.button');
    const btn_close = document.getElementById('close-modal');
    const trailerContainer = document.getElementById(`trailer`);
    const loading = document.querySelector('.loading');
    const mylistCount = document.querySelector('.movies-count');

    header.classList.add('back-black');

    btn_close.addEventListener('click', (e) => {
        header.classList.remove('back-black');
        header.classList.remove('overflow-hidden');
        header.style.height = '65px';

        trailerContainer.classList.remove('modal--show');
        YT.stopVideo();
        setTimeout(() => {
            trailerContainer.classList.remove('z-index');
        }, 2000);
    })

    // Escucha el evento trailer Y muestra el trailer
    socket.on('trailer', movie => {
        let url;
        let validUrl;
        console.log(movie);
        for (let i = 0; i < movie.length; i++) {
            if (movie[i]['type'] == 'Trailer' && movie[i]['size'] == 1080 && movie[i]['site'] == 'YouTube' && movie[i]['official'] == true) {
                url = movie[i]['key'];
                validUrl = true;

                header.classList.add('back-black');
                header.classList.add('overflow-hidden');
                header.style.height = '0';

                trailerContainer.classList.add('z-index');
                trailerContainer.classList.add('modal--show');
                YT.onYouTubeIframeAPIReady(url, 'player');

                break;
            } else {
                validUrl = false;
            }
        }

        !validUrl && (
            Toastify({
                text: `Sorry! Movie "${movie[0]['name']}" Not Available`,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "bottom",
                position: "center",
                className: 'toastyAlert',
                stopOnFocus: false,
                style: {
                    background: "linear-gradient(to right, rgb(230,0,0), rgb(200,0,0))",
                }
            }).showToast()
        )


    })
    let moviesId = [];
    socket.on('myList', (list) => {
        html = ``;
        myList = list;
        for (let i = 0; i < myList.length; i++) {
            console.log(myList[i]['original_title']);
            if (myList[i]['poster_path']) {
                html += `<div class="movie rounded-15px m${myList[i]['id']}">
                            <img src="https://image.tmdb.org/t/p/w500${myList[i]['poster_path']}" class="card-img-top rounded-15px">
                            <div class="overlay rounded-15px">
                                <i 
                                    class="fa-solid fa-bookmark favorite-myList"
                                    id="mov${myList[i]['id']}" title="Remove of My List ">

                                </i>

                                <div class="content rounded-15px">
    
                                    <p class="move-name">${myList[i]['original_title']}</p>
                                    <p class="text">${myList[i]['release_date']}</p>
                        
                                    <div class="rating">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="far fa-star"></i>
                                        <span>${myList[i]['vote_average']}</span>
                                    </div>
                                    <div class="cast">
                                        <p>${myList[i]['overview']}</p>
                                    </div>
                                    <button class="button" id="${myList[i]['id']}">Watch Trailer<i class="fas fa-play"></i></button>
                                </div>
                            </div>
                        </div>
    `
            }
            myListContainer.innerHTML = html;
            loading.style.display = 'none';
            myListContainer.style.display = 'grid';

            //Obtencion del id de la pelicula Y se transmite un evento llamado watch, se le envia el id
            const buttons = document.querySelectorAll('.button');
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', (e) => {
                    let id = buttons[i].id;
                    socket.emit('watch', id);
                })
            }
            //delete of my list
            const addToFavoriteButton = document.querySelectorAll('.favorite-myList');
            for (let i = 0; i < addToFavoriteButton.length; i++) {
                addToFavoriteButton[i].addEventListener('click', () => {
                    let idMovie = addToFavoriteButton[i].id;
                    Toastify({
                        text: "Movie Deleted From My List",
                        duration: 2000,
                        newWindow: true,
                        close: true,
                        className: 'toastyAlert',
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: false, // Prevents dismissing of toast on hover
                        style: {
                            background: "linear-gradient(to right, rgb(230,0,0), rgb(200,0,0))",
                        }
                    }).showToast();


                    console.log('está guardada esta peli, voy a eliminarla de mi lista');

                    if (moviesId.length > 1) {
                        let indiceMovie = moviesId.indexOf(idMovie);
                        moviesId.splice(indiceMovie, 1);
                        console.log(moviesId);
                    } else {
                        moviesId.shift();
                        console.log(moviesId);
                    }

                    localStorage.setItem('myList', JSON.stringify(moviesId));
                    let myList = JSON.parse((localStorage.getItem('myList')));
                    if (myList.length >= 1) {
                        mylistCount.innerHTML = `<p>${myList.length}</p>`;
                        mylistCount.style.backgroundColor = '#5353531f'
                    } else {
                        mylistCount.innerHTML = ``;
                        mylistCount.style.backgroundColor = 'transparent';
                    }
                    addToFavoriteButton[i].classList.add('fa-regular');
                    addToFavoriteButton[i].classList.remove('fa-solid');
                    addToFavoriteButton[i].style.pointerEvents = 'none';

                    document.querySelector(`.m${(idMovie.replace('mov', ''))}`).classList.add('opacity-hidden');

                    setTimeout(() => {
                        socket.emit('deleteMovieOfMyList', (idMovie.replace('mov', '')));
                    }, 2000);
                    console.log(moviesId);
                });
            }

        };
    });


    if (localStorage.getItem('myList') && (JSON.parse(localStorage.getItem('myList'))).length > 0) {
        let myListFromLS = JSON.parse(localStorage.getItem('myList'));
        moviesId = myListFromLS;
        console.log(moviesId);
        myListFromLS = myListFromLS.map(i => Number(i.replace('mov', '')));

        myList = JSON.parse(localStorage.getItem('myList'));
        if (myList.length >= 1) {
            mylistCount.innerHTML = `<p>${myList.length}</p>`;
            mylistCount.style.backgroundColor = '#5353531f'
        } else {
            mylistCount.innerHTML = ``;
            mylistCount.style.backgroundColor = 'transparent';
        }
        setTimeout(() => {
            socket.emit('loadMyList', (myListFromLS));
        }, 2000);

    } else {
        setTimeout(() => {
            loading.style.display = 'none';
            myListContainer.innerHTML = `
                <div class="no-movies-yet">
                    <h2>
                        You have nothing added to favorites
                    </h2>
                    <hr>
                </div>
            `;
        }, 1500)
        console.log('no hay LS')
    }

    $searchForm.submit((e) => {
        e.preventDefault();
    })

    logo.addEventListener('click', () => {
        location.href = '/home';
    })

    let timeout;

    // Timing del Buscador
    // Cuando deje de escribir buscara las pelis depues de 1.5seg
    wantedMovie.addEventListener('keydown', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            $searchForm.submit();// se le hace submit al search
            clearTimeout(timeout);
        }, 1500)
    })

    // Buscador
    wantedMovie.addEventListener('input', () => {
        let movie = $wantedMovie.val();
        if (movie.length > 0) {
            moviesWantedContainer.style.display = 'grid';
            //portada.style.display = 'none';
            header.classList.add('back-black');
            for (let i = 0; i < title.length; i++) {
                title[i].style.display = 'none';

            }
            $searchForm.submit((e) => { //Esto pasara cuando se le haga submit al input search
                e.preventDefault();
                let movie = $wantedMovie.val();
                socket.emit('movie', movie);
            })

        } else if (movie.length === 0) {
            moviesWantedContainer.style.display = 'none';
            //portada.style.display = 'block';
            header.classList.remove('back-black');
            for (let i = 0; i < title.length; i++) {
                title[i].style.display = 'grid';

            }
        }
    })

    // escucha el evento obtainedFilm, pelis buscadas y las muestra
    socket.on('obtainedFilm', (data) => {
        let html = '';

        for (let i = 0; i < data.length; i++) {
            if (data[i]['poster_path']) {
                html += `<div class="movie">
                            <img src="https://image.tmdb.org/t/p/w500${data[i]['poster_path']}" class="card-img-top">
                            <div class="overlay">

                                <div class="content">

                                    <i class="fa-regular fa-bookmark favorite"
                                    id="mov${data[i]['id']}" title="Add To My List">
                                    </i>
    
                                    <p class="move-name">${data[i]['original_title']}</p>
                                    <p class="text">${data[i]['release_date']}</p>
                        
                                    <div class="rating">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="far fa-star"></i>
                                        <span>${data[i]['vote_average']}</span>
                                    </div>
                                    <div class="cast">
                                        <p>${data[i]['overview']}</p>
                                    </div>
                                    <button class="button" id="${data[i]['id']}">Watch Trailer<i class="fas fa-play"></i></button>
                                </div>
                            </div>
                        </div>
    `
            }
        };

        $moviesWantedContainerJquery.html(html);
        updateFavoriteSelected(moviesId);
        addOrDeleteToMyList(moviesId, socket, mylistCount);

        const buttonsMW = document.querySelectorAll('.button');
        for (let i = 0; i < buttonsMW.length; i++) {
            buttonsMW[i].addEventListener('click', (e) => {
                let id = buttonsMW[i].id;
                socket.emit('watch', id);
            })
        }
    })

});
