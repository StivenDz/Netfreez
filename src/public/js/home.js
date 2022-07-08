$(async () => {
    const socket = io();

    //YOUTUBE API
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    async function onYouTubeIframeAPIReady(id, playerId) {
        player = await new YT.Player(playerId, {
            height: '720',
            width: '1080',
            videoId: id,
            playerVars: {
                'controls': 0
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function onPlayerReady(event) {
        event.target.setPlaybackQuality('hd1080');
        event.target.setVolume(60);
        event.target.playVideo();
    };

    var done = false;
    function onPlayerStateChange(event) {
        // if (event.data == YT.PlayerState.PLAYING && !done) {
        //     setTimeout(stopVideo, 6000);
        //     done = true;
        //     }
        event.target.setLoop(true);
    };

    const stopVideo = () => {
        player.destroy();
    };

    //END YOUTUBE API
    //-------------------------------------------------//

    const links = document.querySelectorAll('.links-nav');
    links[0].classList.add('selected');

    const $searchForm = $('#search_movie');
    const wantedMovie = document.getElementById('wantedMovie');
    const $wantedMovie = $('#wantedMovie');
    const logo = document.getElementById('logo');

    const moviesWantedContainer = document.getElementById('wanted_movie_container');
    const $moviesWantedContainerJquery = $('.wanted_movie_containerJquery');

    const title = document.querySelectorAll('.add');
    const containerMovies = document.querySelectorAll('.container');
    const portada = document.querySelector('.port');
    const header = document.querySelector('.header');
    const bars = document.getElementById('button-nav-res');
    const asideLinks = document.getElementById('aside-links');
    const mylistCount = document.querySelector('.movies-count');
    const buttons = document.querySelectorAll('.button');
    const btn_close = document.getElementById('close-modal');
    let movieWantedTrailer = false;

    let myList = [];

    //add to my list  | FALTA QUE CAMBIEN LOS ATRIBUTO TITLE MOV IGUALES |
    const addToFavoriteButton = document.querySelectorAll('.favorite');
    for (let i = 0; i < addToFavoriteButton.length; i++) {
        addToFavoriteButton[i].setAttribute('title', 'Add To My List');

        addToFavoriteButton[i].addEventListener('click', () => {
            let idMovie = addToFavoriteButton[i].id;
            const mov = document.querySelectorAll(`#${idMovie}`);

            if (addToFavoriteButton[i].classList.contains('fa-solid')) {
                console.log('está guardada esta peli, voy a eliminarla de mi lista');
                addToFavoriteButton[i].setAttribute('title', 'Add To My List');
                if (myList.length > 1) {
                    let indiceMovie = myList.indexOf(idMovie);
                    myList.splice(indiceMovie, 1);
                    console.log(myList);
                } else {
                    myList.shift();
                    console.log(myList);
                }
                socket.emit('deleteMovieOfMyList', (idMovie.replace('mov', '')));
                if (mov.length > 1) {
                    for (let j = 0; j < mov.length; j++) {
                        mov[j].setAttribute('title', 'Add To My List');
                    }
                } else {
                    addToFavoriteButton[i].setAttribute('title', 'Add To My List');
                }
            } else {
                if (mov.length > 1) {
                    for (let j = 0; j < mov.length; j++) {
                        mov[j].setAttribute('title', 'Remove To My List');
                    }
                } else {
                    addToFavoriteButton[i].setAttribute('title', 'Remove To My List');
                }
                console.log('new movie added');
                myList.push(idMovie);
                socket.emit('addToMyList', (idMovie.replace('mov', '')));
                console.log(myList);
            }
            localStorage.setItem('myList', JSON.stringify(myList));
            if (myList.length >= 1) {
                mylistCount.innerHTML = `<p>${myList.length}</p>`;
                mylistCount.style.backgroundColor = '#5353531f'
            } else {
                mylistCount.innerHTML = ``;
                mylistCount.style.backgroundColor = 'transparent';
            }

            if (mov.length > 1) {
                for (let j = 0; j < mov.length; j++) {
                    mov[j].classList.toggle('fa-regular');
                    mov[j].classList.toggle('fa-solid');
                }
            } else {
                addToFavoriteButton[i].classList.toggle('fa-regular');
                addToFavoriteButton[i].classList.toggle('fa-solid');
            }
        });

    };


    // load mym list from localStorage
    if (localStorage.getItem('myList')) {
        let myListFromLS = JSON.parse(localStorage.getItem('myList'));
        myListFromLS = myListFromLS.map(i => Number(i.replace('mov', '')))

        myList = JSON.parse(localStorage.getItem('myList'));

        if (myList.length >= 1) {
            mylistCount.innerHTML = `<p>${myList.length}</p>`;
            mylistCount.style.backgroundColor = '#5353531f';
        } else {
            mylistCount.innerHTML = ``;
        }

        for (let i = 0; i < myList.length; i++) {
            const lsmov = document.querySelectorAll(`#${myList[i]}`);
            const lsmovi = document.getElementById(myList[i]);
            if (lsmov.length > 1) {
                for (let j = 0; j < lsmov.length; j++) {
                    lsmov[j].classList.replace('fa-regular', 'fa-solid');
                    lsmov[j].setAttribute('title', 'Remove To My List');

                }
            } else {
                lsmovi.setAttribute('title', 'Remove To My List');
                lsmovi.classList.replace('fa-regular', 'fa-solid');
            }
        }
        console.log(myList);

        setTimeout(() => {
            socket.emit('loadMyList', (myListFromLS));
        }, 1000);
    }

    // cerrar modal del trailer
    btn_close.addEventListener('click', (e) => {
        const trailerContainer = document.getElementById(`trailer`);
        header.classList.remove('back-black');
        header.classList.remove('overflow-hidden');
        header.style.height = '65px';

        if (movieWantedTrailer) {
            moviesWantedContainer.style.opacity = '1';
        }

        trailerContainer.classList.remove('modal--show');
        stopVideo();
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

        onYouTubeIframeAPIReady(url, 'player');

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
            portada.style.display = 'none';
            header.classList.add('back-black');
            for (let i = 0; i < title.length; i++) {
                title[i].style.display = 'none';
                containerMovies[i].style.display = 'none';
            }
            $searchForm.submit((e) => { //Esto pasara cuando se le haga submit al input search
                e.preventDefault();
                let movie = $wantedMovie.val();
                socket.emit('movie', movie);
            })

        } else if (movie.length === 0) {
            moviesWantedContainer.style.display = 'none';
            portada.style.display = 'block';
            header.classList.remove('back-black');
            for (let i = 0; i < title.length; i++) {
                title[i].style.display = 'flex';
                containerMovies[i].style.display = 'flex';
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
                id = buttonsMW[i].id;
                moviesWantedContainer.style.opacity = '0';
                movieWantedTrailer = true;
                socket.emit('watch', id);
            })
        }
    })
})