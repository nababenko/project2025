// Menu
window.addEventListener('scroll', function() {
    const windowHeight = window.innerHeight;

    const element = document.getElementById("head_div");
    const triggerPoint = windowHeight * 0.98;

    // для зміни кольору меню відносно висоти вікна
    if (window.scrollY > triggerPoint) {
        element.classList.remove("header_menu");
        element.classList.add("header_menu_done");
    } else {
        element.classList.remove("header_menu_done");
        element.classList.add("header_menu");
    }
    // зменшення розміру текту при прокрутці
    const scalableText = document.getElementById("scalable-text");
    const scrollPosition = window.scrollY;

    const maxFontSize = 72.22;
    const minFontSize = 5;
    let newFontSize = maxFontSize - scrollPosition * 0.08;

    if (newFontSize < minFontSize) {
        newFontSize = minFontSize;
    }

    scalableText.style.fontSize = newFontSize + "vh";
});


// SLIDER
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}


// MODAL IMG
document.querySelector('#modal_photo').addEventListener('click', event => {

    const originalImage = document.querySelector('#modal_photo');
    const linkImage = originalImage.src;

    const instance = basicLightbox.create(`
            <img src="${linkImage}" alt="Збільшене зображення">
        `);

    instance.show();

});
