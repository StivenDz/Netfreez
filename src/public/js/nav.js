import { ApiYouTube } from "./ApiYouTube.js";

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

    // SERACH MOVIE  ---------------------------------------------------------------

    //YOUTUBE API
    const YT = ApiYouTube();
    
    //-------------------------------------------------//


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
    let movieWantedTrailer = false;

    btn_close.addEventListener('click', (e) => {
        const trailerContainer = document.getElementById(`trailer`);
        header.classList.remove('back-black');
        header.classList.remove('overflow-hidden');
        header.style.height = '65px';

        if (movieWantedTrailer) {
            moviesWantedContainer.style.opacity = '1';
        }

        trailerContainer.classList.remove('modal--show');
        YT.stopVideo();
    })

    /*   Eventos emitidos:
        - movie
        - watch
    
        Eventos escuchados:
        - loadTrailer
        - obtainedFilm
        - trailer
        - filmDoesntFound X3
    */

    // Carga el trailer de la portada
    let urlTrailer;
    socket.on('loadTrailer', url => {
        urlTrailer = url;
        // onYouTubeIframeAPIReady(urlTrailer,'portada');
    })

    // Escucha el evento trailer Y muestra el trailer
    socket.on('trailer', movie => {
        const trailerContainer = document.getElementById(`trailer`);
        header.classList.add('back-black');
        header.classList.add('overflow-hidden');
        header.style.height = '0';

        trailerContainer.classList.add('modal--show');

        let url;

        for (let i = 0; i < movie.length; i++) {
            if (movie[i]['type'] == 'Trailer' && movie[i]['size'] == 1080 && movie[i]['site'] == 'YouTube' && movie[i]['official'] == true) {
                url = movie[i]['key'];
            }
        }

        YT.onYouTubeIframeAPIReady(url, 'player');

    })

    //Obtencion del id de la pelicula Y se transmite un evento llamado watch, se le envia el id
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', (e) => {
            id = buttons[i].id;
            socket.emit('watch', id);
        })
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

        const buttonsMW = document.querySelectorAll('.button');
        for (let i = 0; i < buttonsMW.length; i++) {
            buttonsMW[i].addEventListener('click', (e) => {
                let id = buttonsMW[i].id;
                moviesWantedContainer.style.opacity = '0';
                movieWantedTrailer = true;
                socket.emit('watch', id);
            })
        }
    })
});