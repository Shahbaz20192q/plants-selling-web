const main_img = document.getElementById("main_gal_img");
let gali_mages = document.querySelectorAll(".gal_img");

gali_mages.forEach((e) => {
    e.addEventListener('click', () => {
        main_img.src = e.src
    })
})