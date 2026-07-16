import imagesData from './data.js';
const searchInput = document.getElementById("searchInput");
const galleryGrid = document.getElementById("galleryGrid");
const subHeading = document.querySelector('#subheading');
// Naive approach to display images
// const displayImages = (images) => {
    // subHeading.textContent = `Render Images using innerHTML (Naive Approach)`;
//   galleryGrid.innerHTML = "";
//   images.forEach((image) => {
//     const cardHTML = `
//             <div class="card">
//                 <img src="${image.url}" alt="${image.title}" />
//                 <div class="card-info">
//                     <p>${image.category}</p>
//                     <h3>${image.title}</h3>
//                     ${image.tags.map((tag) => `<span class="tag">#${tag}</span>`).join("")}
//                 </div>
//             </div>`;
//     galleryGrid.innerHTML += cardHTML;
//   });
// };
// displayImages(imagesData);

//Optimized approach to display images
const displayOptimizedImages = (images) => {
    subHeading.textContent = `Render Images using DocumentFragment & forEach`;
    galleryGrid.innerHTML = "";
    //Empty state fallback
    if(images.length === 0){
        const noResultsHTML = document.createElement("div");
        noResultsHTML.classList.add("no-results");
        noResultsHTML.innerHTML = `<h3>No images found matching that keyword 😢</h3>`;
        galleryGrid.appendChild(noResultsHTML);
        return;
    }
    const fragment = document.createDocumentFragment();
    images.forEach(image => {
        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = image.url;
        img.alt = image.title;
        img.loading = 'lazy';

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("card-info");

        const category = document.createElement('span');
        category.classList.add("category");
        category.textContent = image.category;

        const title = document.createElement("h3");
        title.textContent = image.title;

        infoDiv.append(category, title);

        image.tags.forEach(tagTxt => {
            const tag = document.createElement('span');
            tag.classList.add("tag");
            tag.textContent = `#${tagTxt}`;
            infoDiv.appendChild(tag);
        });

        card.append(img, infoDiv);
        fragment.appendChild(card);
    });
    galleryGrid.append(fragment);
};
displayOptimizedImages(imagesData);


// Using map()
// const gridHTML = images.map(image => `
//     <div class="card">
//         <img src="${image.url}" alt="${image.title}" loading="lazy">
//         <div class="card-info">
//             <span>${image.category}</span>
//             <h3>${image.title}</h3>
//         </div>
//     </div>
// `).join('');

// galleryGrid.innerHTML = gridHTML;
// subHeading.textContent = `Render Images using map()`;

// using map() and create Elements
// const cardElements = images.map(image => {
//     const card = document.createElement("div");
//     card.classList.add("card");

//     const img = document.createElement("img");
//     img.src = image.url;
//     img.alt = image.title;
//     img.loading = 'lazy';

//     const infoDiv = document.createElement("div");
//     infoDiv.classList.add("card-info");

//     const category = document.createElement('span');
//     category.textContent = image.category;

//     const title = document.createElement("h3");
//     title.textContent = image.title;

//     infoDiv.append(category, title);
//     card.append(img, infoDiv); 

//     return card; // map() must return element
// });

// galleryGrid.append(...cardElements);

//Debounce utility to handle fast type and filtering on every single keystroke
const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
        if(timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Search method 1

// searchInput.addEventListener('input', (event) => {
//     const query = event.target.value.toLowerCase().trim();
//     const filtered = imagesData.filter(img => {
//         return img.title.toLowerCase().includes(query) ||
//         img.category.toLowerCase().includes(query) ||
//         img.tags.some(tag => tag.toLowerCase().includes(query));
//     });
//     displayOptimizedImages(filtered);
// });

//search method 2

const handleSearch = (event) => {
    const query = event.target.value.toLowerCase().trim();
    const filtered = imagesData.filter(img => {
        const matchesTitle = img.title.toLowerCase().includes(query);
        const matchesCategory = img.category.toLowerCase().includes(query);
        const matchesTag = img.tags.some(tag => tag.toLowerCase().includes(query));

        return matchesTitle || matchesCategory || matchesTag;
    });

    displayOptimizedImages(filtered);
};
// searchInput.addEventListener('input', handleSearch);

const debouncedSearch = debounce(handleSearch, 300);
searchInput.addEventListener('input', debouncedSearch);
