$(() => {

    // <iframe width="1348" height="528" src="https://www.youtube.com/embed/6ZfuNTqbHE8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

    const socket = io();

    socket.on('trailer',movie=>{
        const $trailerContainer = $(`#trailer`);
        console.log('id');

        let url;

        for (let i = 0; i < movie.length; i++) {
            if(movie[i]['type'] == 'Trailer' && movie[i]['size'] == 1080 && movie[i]['site'] == 'YouTube' && movie[i]['official'] == true){
                url = movie[i]['key'];
            }
        }

        $trailerContainer.html(`

            <iframe width="1348" height="528" src="https://www.youtube.com/embed/${url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

        `)
    })

})