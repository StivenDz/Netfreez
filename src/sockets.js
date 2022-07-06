const { Router } = require('express');
const axios = require('axios');
const router = Router();
/*
    Eventos escuchados:
    - movie
    - watch

    Eventos emitidos:
    - loadTrailer
    - obtainedFilm
    - trailer
    - filmDoesntFound X3
*/

module.exports = (io) => {

    io.on('connection', async socket => {
        console.log('Connected');

        let cartelera;

        // trailer de la portada
        await axios.get(`https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2022-04-30&primary_release_date.lte=2022-12-27&api_key=e40f81b55b1ff2e898eaf34b92f0b2ad`)
            .then(async (response) => {
                cartelera = await response.data['results'];
                let id = cartelera[0]['id'];//id de la primer peli

                // con ese id busco el trailer y emito un evento
                await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=e40f81b55b1ff2e898eaf34b92f0b2ad&language=en-US`)
                    .then(async (response) => {
                        let url;
                        let trailer = await response.data['results'];
                        if (trailer.length > 0) {
                            for (let i = 0; i < trailer.length; i++) {
                                if (trailer[i]['type'] == 'Trailer' && trailer[i]['size'] == 1080 && trailer[i]['site'] == 'YouTube' && trailer[i]['official'] == true) {
                                    url = trailer[i]['key'];
                                }
                            }
                            socket.emit('loadTrailer', url);
                        } else {
                            socket.emit('filmDoesntFound', 'Not Found');
                            console.log('Not Found');
                        }
                    })
                    .catch((error) => {
                        console.log('error');
                    });
            })
            .catch((error) => {
                console.log('error');
            });

        //Buscador/Filter de pelicula por nombre
        socket.on('movie', async (data) => {
            let movies;

            await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=e40f81b55b1ff2e898eaf34b92f0b2ad&language=en-US&query=${data}`)
                .then(async (response) => {
                    movies = await response.data['results'];
                    if (movies.length > 0) {
                        socket.emit('obtainedFilm', movies);
                        console.log('obtainedFilm');
                    } else {
                        socket.emit('filmDoesntFound', 'Not Found');
                        console.log('Not Found');
                    }
                })
                .catch((error) => {
                    console.log('error');
                });
        })

        // Ver trailer, recibe le id, busca la peli y emite un array de objetos
        socket.on('watch', async (id) => {
            let movie;
            res = {
                iso_639_1: 'en',
                iso_3166_1: 'US',
                name: 'Fans reaction Trailer Tease',
                key: '3VbHg5fqBYw',
                published_at: '2017-11-28T17:09:22.000Z',
                site: 'YouTube',
                size: 720,
                type: 'Teaser',
                official: true,
                id: '5a200bdd0e0a264cca08d39f'
            }

            await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=e40f81b55b1ff2e898eaf34b92f0b2ad&language=en-US`)
                .then(async (response) => {
                    movie = await response.data['results'];
                    if (movie.length > 0) {
                        socket.emit('trailer', movie);
                        for (let i = 0; i < movie.length; i++) {
                            console.log('\n' + movie[i]['key']);
                            console.log(movie[i]['site']);
                            console.log(movie[i]['size']);
                            console.log(movie[i]['type']);
                            console.log('Official: ', movie[i]['official']);
                        }
                    } else {
                        socket.emit('filmDoesntFound', 'Not Found');
                        console.log('Not Found');
                    }
                })
                .catch((error) => {
                    console.log('error');
                });

        })

        let users = [
            {
                email: 'stivendiazh@gmail.com',
                password: '123456789'
            }
        ];
        //login
        socket.on('auth', (data, cb) => {
            for (let i = 0; i < users.length; i++) {
                if (users[i]['email'] === data.email && users[i]['password'] === data.password) {
                    cb(true);
                } else {
                    cb(false);
                }
            }
        })

        let myList = [];
        let ids = [];
        socket.on('loadMyList', async (data) => {
            ids = data;
            for (const id of ids) {
                await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=e40f81b55b1ff2e898eaf34b92f0b2ad&language=en-US`)
                    .then(async (response) => {
                        let favoriteMovie = await response.data;
                        myList.push(favoriteMovie);
                    })
                    .catch((error) => {
                        console.log('error');
                    });
            }
            socket.emit('myList', (myList));
        })

        socket.on('addToMyList', async (id) => {
            await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=e40f81b55b1ff2e898eaf34b92f0b2ad&language=en-US`)
                .then(async (response) => {
                    let favoriteMovie = await response.data;
                    myList.push(favoriteMovie);
                    console.log(favoriteMovie['original_title'], 'Added');
                })
                .catch((error) => {
                    console.log('error');
                });

        })

        socket.on('deleteMovieOfMyList', (id) => {
            if (myList.length == 1) {
                myList.shift();
            } else {
                for (let i = 0; i < myList.length; i++) {
                    if (myList[i]['id'] == id) {
                        console.log(myList[i]['original_title'], 'Deleted');
                        myList.splice(i, 1);
                    }
                }
            }
        });

    })

}