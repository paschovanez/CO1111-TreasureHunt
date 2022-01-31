
var x = document.getElementById("Links");
const menuBtn = document.querySelector('.menu-btn');
let menuOpen = false;
menuBtn.addEventListener('click', () =>{
    if(!menuOpen){
        menuBtn.classList.add('open');
        x.style.display = "block";
        menuOpen = true;
    }
    else {
        menuBtn.classList.remove('open');
        x.style.display = "none";
        menuOpen = false;
    }
});





