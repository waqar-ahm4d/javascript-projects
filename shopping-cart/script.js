const mockProducts = [
  {
    id: 1,
    title: "Nike Air Max",
    price: 120,
    category: "Shoes",
    rating: 4.8,
    image: "https://picsum.photos/300?1",
  },
  {
    id: 2,
    title: "Apple Watch",
    price: 399,
    category: "Electronics",
    rating: 4.9,
    image: "https://picsum.photos/300?2",
  },
  {
    id: 3,
    title: "Gaming Mouse",
    price: 60,
    category: "Accessories",
    rating: 4.5,
    image: "https://picsum.photos/300?3",
  },
  {
    id: 4,
    title: "Laptop Backpack",
    price: 80,
    category: "Bags",
    rating: 4.7,
    image: "https://picsum.photos/300?4",
  },
];

const productList = document.querySelector(".product-list");
const cartItems = document.querySelector(".cart-items");

const itemCount = document.querySelector(".item-count");
const subtotalElement = document.querySelector(".subtotal");

const searchInput = document.querySelector(".search-input");

const sortSelect = document.querySelector(".sort-select");

// State
const state = {
  products: [],
  productMap: {},
  cart: [],
  search: "",
  sort: "default",
  category: "all",
};

function setProducts(products) {
  state.products = products;

  state.productMap = products.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {});
}

function getProduct(id) {
  return state.productMap[id];
}

function getCartItem(id) {
  return state.cart.find((item) => item.id === id);
}

function getFilteredProducts() {
//   const search = state.search.trim().toLowerCase();

//   if (!search) return state.products;

//   return state.products.filter((product) => {
//     return (
//       product.title.toLowerCase().includes(search) ||
//       product.category.toLowerCase().includes(search)
//     );
//   });

    let products = [...state.products];
    if(state.search) {
        const search = state.search.trim().toLowerCase();
        
        if(!search) return products;

        products = products.filter(product => {
            return (
                product.title.toLowerCase().includes(search) || product.category.toLowerCase().includes(search)
            );
        });
    }
    switch(state.sort) {
        case 'price-low':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            products.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            products.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            break;
    }
    return products;
}
// Search

searchInput.addEventListener("input", handleSearch);

function handleSearch(e) {
  state.search = e.target.value;
  renderProducts();
}

// Sorting 
sortSelect.addEventListener('click', hanldeSortClick);

function hanldeSortClick(e) {
    state.sort = e.target.value;
    renderProducts();
}

// Storage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(state.cart));
}

function loadCart() {
  const savedCart = localStorage.getItem("cart");
  if (!savedCart) return;
  state.cart = JSON.parse(savedCart);
}

// Renderinng
function renderProducts() {
  const filteredProducts = getFilteredProducts();
  productList.innerHTML = filteredProducts.map(createProductCard).join("");
}

function refreshCart() {
  saveCart();
  renderCart();
  updateSummary();
}

function renderCart() {
  cartItems.innerHTML = state.cart
    .map((cartItem) => {
      const product = getProduct(cartItem.id);

      return `
            <article class="cart-item">
                <img src="${product.image}" alt="${product.title}" />
                <div class="cart-info">
                    <h4 class="">${product.title}</h4>
                    <p>$${product.price}</p>
                    <div class="quantity-controls">
                        <button data-action="decrease" data-id="${product.id}"> - </button>
                        <span>${cartItem.quantity}</span>
                        <button data-action="increase" data-id="${product.id}"> + </button>
                    </div>
                </div>
                <button class="remove-btn" data-action="remove" data-id="${product.id}"> x </button>
            </article>
        `;
    })
    .join("");
}

function updateSummary() {
  const totalItems = state.cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const subtotal = state.cart.reduce((total, item) => {
    const product = getProduct(item.id);
    return total + product.price * item.quantity;
  }, 0);

  itemCount.textContent = totalItems;

  subtotalElement.textContent = subtotal;
}

// Actions
function createProductCard(product) {
  return `
        <article class="product-card">
            <img src="${product.image}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p>${product.category}</p>
            <p>${product.price}</p>
            <p>${product.rating}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to cart</button>
        </article>
    `;
}

productList.addEventListener("click", handleProductClick);

function handleProductClick(e) {
  const button = e.target.closest(".add-to-cart");
  console.log(button);
  if (!button) return;

  const id = Number(button.dataset.id);
  console.log(id);
  addToCart(id);
}

function addToCart(id) {
  const cartItem = getCartItem(id);

  if (cartItem) {
    cartItem.quantity++;
  } else {
    state.cart.push({ id, quantity: 1 });
  }
  refreshCart();
}

cartItems.addEventListener("click", handleCartClick);

function handleCartClick(e) {
  const button = e.target.closest("button");

  if (!button) return;

  const id = Number(button.dataset.id);

  const action = button.dataset.action;

  switch (action) {
    case "increase":
      increaseQty(id);
      break;
    case "decrease":
      decreaseQty(id);
      break;
    case "remove":
      removeFromCart(id);
      break;
  }
}

function increaseQty(id) {
  const item = getCartItem(id);

  item.quantity++;

  refreshCart();
}

function decreaseQty(id) {
  const item = getCartItem(id);

  item.quantity--;

  if (item.quantity === 0) {
    removeFromCart(id);
    return;
  }

  refreshCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter((item) => item.id !== id);

  refreshCart();
}


// Initialization

function init() {
  setProducts(mockProducts);
  loadCart();
  renderProducts();
  refreshCart();
}
init();
