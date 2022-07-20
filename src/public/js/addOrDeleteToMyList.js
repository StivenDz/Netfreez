/**
 * 
 * @param {array} myList 
 */
export const addOrDeleteToMyList = (myList, socket, mylistCount) => {
    const addToFavoriteButton = document.querySelectorAll('.favorite');
    for (let i = 0; i < addToFavoriteButton.length; i++) {

        addToFavoriteButton[i].addEventListener('click', () => {
            let idMovie = addToFavoriteButton[i].id;
            const mov = document.querySelectorAll(`#${idMovie}`);

            if (addToFavoriteButton[i].classList.contains('fa-solid')) {
                console.log('está guardada esta peli, voy a eliminarla de mi lista');

                Toastify({
                    text: "Movie Deleted From My List",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "right",
                    offset: {
                        x: 30, 
                        y: 60 
                    },
                    className: 'toastyAlert',
                    stopOnFocus: false,
                    style: {
                        background: "linear-gradient(to right, rgb(230,0,0), rgb(200,0,0))",
                    }
                }).showToast();

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
                Toastify({
                    text: "Movie Added To My List",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "right",
                    offset: {
                        x: 30, 
                        y: 60 
                    },
                    className: 'toastyAlert',
                    stopOnFocus: false,
                    style: {
                        background: "linear-gradient(to right, #22ffc0, rgb(0,200,0))",
                    }
                }).showToast();

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
}

export const justDelete = () => {
    console.log('wait');
}

/**
 * 
 * @param {array} myList 
 */
export const updateFavoriteSelected = (myList) => {
    for (let i = 0; i < myList.length; i++) {
        const lsmov = document.querySelectorAll(`#${myList[i]}`);
        const lsmovi = document.getElementById(myList[i]);
        if (lsmov.length > 1) {
            for (let j = 0; j < lsmov.length; j++) {
                lsmov[j].classList.replace('fa-regular', 'fa-solid');
                lsmov[j].setAttribute('title', 'Remove To My List');

            }
        } else {

            lsmovi && (
                lsmovi.setAttribute('title', 'Remove To My List'),
                lsmovi.classList.replace('fa-regular', 'fa-solid')
            );
        }
    }
}
