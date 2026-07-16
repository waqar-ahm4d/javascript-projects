import Gallery from "./script_OOP.js";
import imagesData from "./data.js"

document.addEventListener("DOMContentLoaded", () => {
    const mainGallery = new Gallery(imagesData, "galleryGrid", "searchInput");
    document.querySelector('#subheading').textContent = `Render Images using OOP`;
});