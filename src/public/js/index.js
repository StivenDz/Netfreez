// slider.addEventListener("wheel", (e) => {
//     e.preventDefault();
//     slider.scrollLeft += (e.deltaY) * 6;
//     slider.style.scrollBehavior = 'smooth';
// });


for (let i = 0; i < 3; i++) {
    const slider = document.querySelectorAll('.container-movies');
    const slide_left = document.querySelectorAll('.left-side');
    const slide_right = document.querySelectorAll('.right-side');
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    
    slide_left[i].addEventListener('click',()=>{
        slider[i].style.scrollBehavior = 'smooth';
        slider[i].scrollLeft += -1200;
    })
    slide_right[i].addEventListener('click',()=>{
        slider[i].style.scrollBehavior = 'smooth';
        slider[i].scrollLeft += 1200;
    })
    
    slider[i].addEventListener('mousedown',(e)=>{
        isDown = true;
        slider[i].style.scrollBehavior = 'auto';
        
        startX = e.pageX - slider[i].offsetLeft;
        scrollLeft = slider[i].scrollLeft;
    })
    
    slider[i].addEventListener('mouseleave',(e)=>{
        isDown = false;
    })
    
    slider[i].addEventListener('mouseup',(e)=>{
        isDown = false;
    })
    
    slider[i].addEventListener('mousemove',(e)=>{
        if(!isDown) return;
        e.preventDefault();
        let x = e.pageX -  slider[i].offsetLeft;
        let walk = (x - startX);
        console.log(walk);
        slider[i].scrollLeft = scrollLeft - walk;
    })
}

