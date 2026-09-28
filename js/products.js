const defaultProducts = [
  {
    id: 1,
    title: "Bose Home Speaker 500",
    price: 375.00,
    oldPrice: null,
    sale: false,
    category: "electronics",
    image: "https://m.media-amazon.com/images/I/81k34i6f9SL._AC_SL1500_.jpg",
    section: "favorites"
  },
  {
    id: 2,
    title: "Portable Wireless Apple CarPlay",
    price: 150.00,
    oldPrice: null,
    sale: false,
    category: "auto",
    image: "https://m.media-amazon.com/images/I/71KWW3u0x8L._AC_SL1500_.jpg",
    section: "favorites"
  },
  {
    id: 3,
    title: "Miele Blizzard CX1 Cat & Dog Bagless Canister Vacuum",
    price: 1200.00,
    oldPrice: null,
    sale: false,
    category: "home",
    image: "https://m.media-amazon.com/images/I/718y6Q2WqWL._AC_SL1500_.jpg",
    section: "favorites"
  },
  {
    id: 4,
    title: "Dyson V12 Detect Slim Cordless Vacuum Cleaner",
    price: 670.00,
    oldPrice: null,
    sale: false,
    category: "home",
    image: "https://m.media-amazon.com/images/I/61u48FEs0rL._AC_SL1000_.jpg",
    section: "favorites"
  },
  {
    id: 5,
    title: "Samsung Portable SSD T7 Shield",
    price: 1280.00,
    oldPrice: 1450.00,
    sale: true,
    category: "electronics",
    image: "https://m.media-amazon.com/images/I/61u48FEs0rL._AC_SL1000_.jpg",
    section: "favorites"
  },
  {
    id: 6,
    title: "Big Ass Fans - Haiku White, Smart Ceiling Fan",
    price: 382.80,
    oldPrice: null,
    sale: false,
    category: "home",
    image: "https://m.media-amazon.com/images/I/41Dq-wN-JqL._AC_SL1000_.jpg",
    section: "shop"
  },
  {
    id: 7,
    title: "Patagonia Men's Down Sweater Hoody...",
    price: 365.00,
    oldPrice: null,
    sale: false,
    category: "clothing",
    image: "https://m.media-amazon.com/images/I/718y6Q2WqWL._AC_SL1500_.jpg",
    section: "shop"
  },
  {
    id: 8,
    title: "Philips Norelco S1560/81 Shaver 2100",
    price: 146.00,
    oldPrice: null,
    sale: false,
    category: "personal",
    image: "https://m.media-amazon.com/images/I/61SGB9+5yHL._AC_SL1500_.jpg",
    section: "shop"
  }
];

// Load products from localStorage or initialize defaults
function getProducts() {
  const stored = localStorage.getItem('store_products');
  if (!stored) {
    localStorage.setItem('store_products', JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(stored);
}

// Function to add a NEW product dynamically from anywhere
function addNewProduct(newProduct) {
  const currentProducts = getProducts();
  newProduct.id = Date.now(); // assign unique ID
  currentProducts.push(newProduct);
  localStorage.setItem('store_products', JSON.stringify(currentProducts));
}