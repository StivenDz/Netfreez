$(async () => {
    const socket = io();

    const links = document.querySelectorAll('.links-nav');
    const myListContainer = document.querySelector('.myList');
    links[4].classList.add('selected');

    let myList = [];
    let html = ``;
    
    socket.on('myList', (list) => {
        myList = list;

        for (let i = 0; i < myList.length; i++) {
            console.log(myList[i]['original_title']);
            if (myList[i]['poster_path']) {
                html += `<div class="movie rounded-15px">
                            <img src="https://image.tmdb.org/t/p/w500${myList[i]['poster_path']}" class="card-img-top rounded-15px">
                            <div class="overlay rounded-15px">
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
            myListContainer.style.display = 'grid';
        };
    });


    if (localStorage.getItem('myList')) {
        let myListFromLS = JSON.parse(localStorage.getItem('myList'));
        myListFromLS = myListFromLS.map(i => Number(i.replace('mov', '')));

        myList = JSON.parse(localStorage.getItem('myList'));

        setTimeout(() => {
            socket.emit('loadMyList', (myListFromLS));
        }, 1000);
    };
});
