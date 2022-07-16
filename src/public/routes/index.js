const { Router } = require('express');
const axios = require('axios');
const router = Router();


router.get('/', (req, res) => {
    res.render('index');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/home', async (req, res) => {
    const sortJSON = (data, key, orden) => {
        return data.sort((a, b) => {
            var x = a[key],
                y = b[key];

            if (orden === 'asc') {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }

            if (orden === 'desc') {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }
        });
    }

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    month++;
    let year = date.getFullYear();

    if (day < 10) {
        day = `0${day}`;
    }

    month = month - 1;

    if (month < 10) {
        month = `0${month}`;
    }

    let fechaCompleta = `${year}-${month}-${day}`;

    let popular_movies;
    let highest_rated;
    let cartelera;
    let portada;

    await axios.get(`https://api.themoviedb.org/3/movie/453395?api_key=e40f81b55b1ff2e898eaf34b92f0b2ad&language=en-US`)
        .then(async (response) => {
            portada = await response.data;
        })
        .catch((error) => {
            console.log('error');
        });

    await axios.get(`https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=${fechaCompleta}&primary_release_date.lte=2022-12-27&api_key=e40f81b55b1ff2e898eaf34b92f0b2ad`)
        .then(async (response) => {
            cartelera = await response.data['results'];
        })
        .catch((error) => {
            console.log('error');
        });

    await axios.get('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=e40f81b55b1ff2e898eaf34b92f0b2ad&language=en-US&page=1')
        .then(async (response) => {
            popular_movies = await response.data['results'];
        })
        .catch((error) => {
            console.log('error');
        });
    await axios.get('https://api.themoviedb.org/3/discover/movie?sort_by=vote_count.desc&api_key=e40f81b55b1ff2e898eaf34b92f0b2ad')
        .then(async (response) => {
            highest_rated = await response.data['results'];
            //sortJSON(highest_rated,'vote_count','desc');
        })
        .catch((error) => {
            console.log('error');
        });

    if (++month < 10) {
        month = `0${month}`;
    }
    fechaCompleta = `${year}-${month}-${day}`;

    res.render('home', { popular_movies, highest_rated, cartelera, fechaCompleta, portada });
})

router.get('/home/my-list', async (req, res) => {
    res.render('my-list');
})

router.get('*', (req, res) => {
    res.send('Error');
})

// router.get('/watch-trailer/:id/',(req,res)=>{
//     const {id} = req.params;
//     res.render('trailer',{id});
// })

module.exports = router;