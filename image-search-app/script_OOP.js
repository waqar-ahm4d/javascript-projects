class Gallery {
  constructor(data, gridId, inputId) {
    this.imagesData = data;
    this.galleryGrid = document.getElementById(gridId);
    this.searchInput = document.getElementById(inputId);

    this.init();
  }
  init() {
    this.renderImages(this.imagesData);
    this.bindEvents();
  }
  renderImages(images) {
    if (images.length === 0) {
      this.galleryGrid.innerHTML = `
            <div class="no-results">
                    <h3>No images found matching that keyword 😢</h3>
                </div>`;
      return;
    }
    this.galleryGrid.innerHTML = images
      .map(
        (image) => `<div class="card">
                <img src="${image.url}" alt="${image.title}" loading="lazy">
                <div class="card-info">
                    <span class="category">${image.category}</span>
                    <h3>${image.title}</h3>
                    <div class="tags">
                        ${image.tags.map((tag) => `<span class="tag">#${tag}</span>`).join("")}
                    </div>
                </div>
            </div>`,
      )
      .join("");
  }
  handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();

    if(!query) {
        this.renderImages(this.imagesData);
        return;
    }

    const filtered = this.imagesData.filter(image => {
        return image.title.toLowerCase().includes(query) ||
        image.category.toLowerCase().includes(query) ||
        image.tags.some(tag => tag.toLowerCase().includes(query)); 
    })
    this.renderImages(filtered);
  }
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        if(timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {func.apply(this, args)},delay);
    };
  }
  bindEvents() {
    const debouncedSearch = this.debounce(this.handleSearch.bind(this), 300);
    this.searchInput.addEventListener('input', debouncedSearch);
  }
}

export default Gallery;