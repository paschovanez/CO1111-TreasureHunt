



/* Navigation open the bars */
function SOCIAL(){
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".links");
    const links = document.querySelectorAll(".links li");

    hamburger.addEventListener('click', ()=>{
        //Links
        navLinks.classList.toggle("open");
        links.forEach(link => {
            link.classList.toggle("fade");
        });

        //Animation
        hamburger.classList.toggle("toggle");
    });
}

/* Press to open the spam: Social Media */
function openNav() {
    document.getElementById("sideMedia").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("sideMedia").style.width = "0%";
}
