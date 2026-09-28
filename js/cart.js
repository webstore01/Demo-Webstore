document.addEventListener("DOMContentLoaded", function () {

    renderCheckoutOrderSummary();

});

document.addEventListener(
    'DOMContentLoaded',
    function () {

        initializeCartPage();

        setupScrollTop();

        setupCheckout();

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

function initializeCartPage() {

    setupCouponAccordion();

    renderCartPage();

    updateHeaderCart();

    window.addEventListener(
        'storage',
        function (event) {

            if (isCartStorageKey(event.key)) {

                renderCartPage();

                updateHeaderCart();

            }

        }
    );

}


/* =========================================================
   CENTRAL WEBSTORE CART
========================================================= */

const CART_STORAGE_KEY = "webstore_cart";

const OLD_CART_KEYS = [
    "cart",
    "cartItems",
    "shoppingCart",
    "miniCart",
    "webstoreCart",
    "cartData",
    "productsCart"
];


/* =========================================================
   READ ANY CART FORMAT
========================================================= */

function parseCart(value) {

    if (!value) {
        return [];
    }

    try {

        const data = JSON.parse(value);

        if (Array.isArray(data)) {
            return data;
        }

        if (data && Array.isArray(data.items)) {
            return data.items;
        }

        if (data && Array.isArray(data.cart)) {
            return data.cart;
        }

        if (data && Array.isArray(data.products)) {
            return data.products;
        }

    } catch (error) {

        console.error(
            "Cart parsing error:",
            error
        );

    }

    return [];
}


/* =========================================================
   NORMALIZE CART PRODUCT
========================================================= */

function normalizeCartItem(item, index) {

    if (!item || typeof item !== "object") {
        return null;
    }

    const name =
        item.name ??
        item.title ??
        item.productName ??
        "Product";


    const id =
        item.id ??
        item.productId ??
        item.productID ??
        `product-${index}`;


    let price =
        item.price ??
        item.productPrice ??
        item.unitPrice ??
        item.amount ??
        0;


    if (typeof price === "string") {

        price = price
            .replace(/[$,₹]/g, "")
            .trim();

    }

    price = parseFloat(price) || 0;


    const image =
        item.image ??
        item.img ??
        item.src ??
        item.imageSrc ??
        item.imageUrl ??
        item.imageURL ??
        item.productImage ??
        item.product_image ??
        "";


    let quantity =
        item.quantity ??
        item.qty ??
        item.count ??
        1;


    quantity =
        parseInt(quantity) || 1;


    if (quantity < 1) {
        quantity = 1;
    }


    return {

        id: String(id),

        name: name,

        title: name,

        price: price,

        image: image,

        quantity: quantity,

        qty: quantity

    };

}


/* =========================================================
   MERGE OLD CARTS
========================================================= */

function migrateCart() {

    const allItems = [];


    const currentCart =
        parseCart(
            localStorage.getItem(
                CART_STORAGE_KEY
            )
        );

    allItems.push(...currentCart);


    OLD_CART_KEYS.forEach(function (key) {

        const oldCart =
            parseCart(
                localStorage.getItem(key)
            );

        allItems.push(...oldCart);

    });


    const normalized =
        allItems
            .map(normalizeCartItem)
            .filter(Boolean);



    const merged = [];


    normalized.forEach(function (item) {

        const existing =
            merged.find(function (product) {

                return (
                    String(product.id) ===
                    String(item.id)
                ) ||
                (
                    product.name
                        .trim()
                        .toLowerCase() ===
                    item.name
                        .trim()
                        .toLowerCase()
                );

            });


        if (existing) {

            existing.quantity +=
                item.quantity;

            existing.qty =
                existing.quantity;

            if (
                !existing.image &&
                item.image
            ) {

                existing.image =
                    item.image;

            }

        } else {

            merged.push({
                ...item
            });

        }

    });


    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(merged)
    );


    OLD_CART_KEYS.forEach(function (key) {

        localStorage.removeItem(key);

    });


    return merged;

}


/* =========================================================
   GET CART
========================================================= */

function getCartItems() {

    if (
        !localStorage.getItem(
            CART_STORAGE_KEY
        )
    ) {

        return migrateCart();

    }


    return parseCart(
        localStorage.getItem(
            CART_STORAGE_KEY
        )
    );

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCartItems(items) {

    const cleanItems =
        items
            .map(normalizeCartItem)
            .filter(Boolean);


    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cleanItems)
    );


    if (
        typeof updateHeaderCart ===
        "function"
    ) {

        updateHeaderCart();

    }


    if (
        typeof renderMiniCart ===
        "function"
    ) {

        renderMiniCart();

    }


    window.dispatchEvent(
        new CustomEvent(
            "webstore:cart-updated"
        )
    );

}



const productImageMap = {

    'Amazon Fire HD 10 tablet':
        'https://m.media-amazon.com/images/I/61u48FEs0rL._AC_SL1000_.jpg',

    'Bose Home Speaker 500':
        'images/favorite-1.jpg',

    'Portable Wireless Apple CarPlay':
        'images/favorite-2.jpg',

    'Miele Blizzard CX1 Cat & Dog Bagless Canister Vacuum':
        'images/favorite-3.jpg',

    'Dyson V12 Detect Slim Cordless Vacuum Cleaner':
        'images/favorite-4.jpg',

    'Samsung Portable SSD T9':
        'images/favorite-5.jpg',

    'Amazon Kindle E-Reader':
        'images/favorite-6.jpg',

    'SEIKO SRPJ81 Men’s Analog Mechanical Watch':
        'images/favorite-7.jpg',

    'SEIKO SRPJ81 Men’s Analog Mechanical Watch':
        'images/favorite-7.jpg',

    'SITKA Gear Men’s Traverse Hunting Hoody':
        'images/deal-1.jpg',

    'THE NORTH FACE Wawona 4P Tent Green/Grey':
        'images/deal-2.jpg',

    'SEIKO SRPG27 5 Sports Men’s Watch':
        'images/deal-3.jpg',

    'THE NORTH FACE Thermoball Lifty II Mens Boots':
        'images/deal-4.jpg',

    'Breville Juice Fountain Plus Juicer':
        'images/deal-5.jpg',

    'apc by Schneider Electric AP9613':
        'images/deal-6.jpg',

    'Okuma Cold Water Line Counter Reel':
        'images/deal-7.jpg',

    'adidas Women’s Gamecourt 2.0 Tennis Shoe':
        'images/arrival-1.jpg',

    'New Balance Women’s 515 V3 Sneaker':
        'images/arrival-2.jpg',

    'Nike Women’s Gymnastics Shoes Sneaker':
        'images/arrival-3.jpg',

    'adidas Women’s Run Falcon 5 Sneaker':
        'images/arrival-4.jpg',

    'adidas Women’s Runfalcon 3 Running Shoe':
        'images/arrival-5.jpg',

    'adidas Women’s Cloudfoam Pure 2.0 Running Shoe':
        'images/arrival-6.jpg',

    'Nike Dunk Low Women\'s Shoes':
        'images/arrival-7.jpg'

};


/* =========================================================
   NORMALIZE PRODUCT
========================================================= */

function normalizeProduct(
    product,
    index
) {

    if (
        !product ||
        typeof product !== 'object'
    ) {

        return null;

    }


    /* PRODUCT ID */

    const id =

        product.id ??

        product.productId ??

        product.productID ??

        `cart-product-${index}`;


    /* PRODUCT NAME */

    const name =

        product.name ??

        product.title ??

        product.productName ??

        product.product_title ??

        'Product';


    /* PRICE */

    let price =

        product.price ??

        product.productPrice ??

        product.unitPrice ??

        product.amount ??

        0;


    if (
        typeof price === 'string'
    ) {

        price =
            price
                .replace(/[$,₹]/g, '')
                .trim();

    }


    price =
        parseFloat(price) || 0;


    /* IMAGE */

    let image =

        product.image ??

        product.img ??

        product.src ??

        product.imageSrc ??

        product.imageUrl ??

        product.imageURL ??

        product.image_url ??

        product.thumbnail ??

        product.thumbnailUrl ??

        product.productImage ??

        product.product_image ??

        product.photo ??

        '';


    if (
        typeof image !== 'string'
    ) {

        image = '';

    }


    image =
        image.trim();


    /*
       If old cart item has no image,
       use product-name fallback.
    */

    if (
        !image &&
        productImageMap[name]
    ) {

        image =
            productImageMap[name];

    }


    /* QUANTITY */

    let quantity =

        product.quantity ??

        product.qty ??

        product.count ??

        1;


    quantity =
        parseInt(quantity) || 1;


    if (
        quantity < 1
    ) {

        quantity = 1;

    }


    /* DESCRIPTION */

    const description =

        product.description ??

        product.subtext ??

        product.subtitle ??

        product.details ??

        '';


    return {

        id: id,

        name: name,

        price: price,

        image: image,

        quantity: quantity,

        description: description

    };

}


/* =========================================================
   RENDER CART PAGE
========================================================= */

function renderCartPage() {

    const itemsList =
        document.getElementById(
            'itemsList'
        );


    const estimatedTotal =
        document.getElementById(
            'estimatedTotal'
        );


    if (!itemsList) {

        return;

    }


    const rawItems =
        getCartItems();


    const items =
        rawItems

            .map(
                function (
                    product,
                    index
                ) {

                    return normalizeProduct(
                        product,
                        index
                    );

                }
            )

            .filter(
                function (product) {

                    return product !== null;

                }
            );


    /* EMPTY CART */

    if (
        items.length === 0
    ) {

        itemsList.innerHTML = `

            <div class="empty-cart-page">

                <i class="fas fa-shopping-cart"></i>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add products to your cart
                    and they will appear here.
                </p>

                <a href="index.html">
                    CONTINUE SHOPPING
                </a>

            </div>

        `;


        if (estimatedTotal) {

            estimatedTotal.innerText =
                '$0.00';

        }


        updateHeaderCart();

        return;

    }


    itemsList.innerHTML = '';


    let total = 0;


    /* PRODUCTS */

    items.forEach(
        function (
            item,
            index
        ) {

            const lineTotal =
                item.price *
                item.quantity;


            total += lineTotal;


            const itemId =
                `cart-item-${index}`;


            const imageSource =
                item.image ||
                'images/logo.png';


            const itemHTML = `

                <div
                    class="cart-item"
                    id="${itemId}"
                    data-index="${index}"
                    data-product-id="${escapeHTML(item.id)}"
                >


                    <!-- IMAGE -->

                    <div class="item-image">

                        <img
                            src="${escapeHTML(imageSource)}"
                            alt="${escapeHTML(item.name)}"
                            class="cart-product-image"
                            loading="lazy"
                            onerror="this.onerror=null; this.src='images/logo.png';"
                        >

                    </div>


                    <!-- DETAILS -->

                    <div class="item-details">


                        <h3 class="item-title">

                            ${escapeHTML(item.name)}

                        </h3>


                        <div class="item-price">

                            $${item.price.toFixed(2)}

                        </div>


                        ${
                            item.description
                            ?
                            `

                                <p class="item-subtext">

                                    ${escapeHTML(
                                        item.description
                                    )}

                                </p>

                            `
                            :
                            ''
                        }


                        <!-- ACTIONS -->

                        <div class="item-actions">


                            <div class="quantity-control">


                                <button
                                    type="button"
                                    class="qty-btn minus"
                                    onclick="changeQty(${index}, -1)"
                                >
                                    −
                                </button>


                                <input
                                    type="text"
                                    class="qty-input"
                                    value="${item.quantity}"
                                    readonly
                                >


                                <button
                                    type="button"
                                    class="qty-btn plus"
                                    onclick="changeQty(${index}, 1)"
                                >
                                    +
                                </button>


                            </div>


                            <!-- DELETE -->

                            <button
                                type="button"
                                class="delete-btn"
                                onclick="removeItem(${index})"
                                title="Remove Item"
                            >

                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                >

                                    <polyline
                                        points="3 6 5 6 21 6"
                                    ></polyline>

                                    <path
                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                    ></path>

                                </svg>

                            </button>


                        </div>

                    </div>


                    <!-- LINE TOTAL -->

                    <div class="item-line-total">

                        $${lineTotal.toFixed(2)}

                    </div>


                </div>

            `;


            itemsList.insertAdjacentHTML(
                'beforeend',
                itemHTML
            );

        }
    );


    /* TOTAL */

    if (estimatedTotal) {

        estimatedTotal.innerText =
            `$${total.toFixed(2)}`;

    }


    updateHeaderCart();

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQty(
    index,
    change
) {

    const items =
        getCartItems();


    if (
        !items[index]
    ) {

        return;

    }


    let quantity =

        parseInt(
            items[index].quantity ??
            items[index].qty ??
            1
        ) || 1;


    quantity += change;


    if (
        quantity < 1
    ) {

        quantity = 1;

    }


    items[index].quantity =
        quantity;


    items[index].qty =
        quantity;


    saveCartItems(items);


    renderCartPage();


    updateHeaderCart();

}


/* =========================================================
   REMOVE PRODUCT
========================================================= */

function removeItem(index) {

    const items =
        getCartItems();


    if (
        !items[index]
    ) {

        return;

    }


    items.splice(
        index,
        1
    );


    saveCartItems(items);


    renderCartPage();


    updateHeaderCart();

}


/* =========================================================
   UPDATE HEADER CART
========================================================= */

function updateHeaderCart() {

    const items =
        getCartItems();


    let total = 0;

    let itemCount = 0;


    items.forEach(function (item, index) {

        const product =
            normalizeCartItem(
                item,
                index
            );


        if (!product) {
            return;
        }


        total +=
            product.price *
            product.quantity;


        itemCount +=
            product.quantity;

    });


    /*
       Header price
    */

    const cartTotalPrice =
        document.getElementById(
            "cartTotalPrice"
        );


    if (cartTotalPrice) {

        cartTotalPrice.textContent =
            `$${total.toFixed(2)}`;

    }


    /*
       Header badge
    */

    const cartBadge =
        document.getElementById(
            "cartBadge"
        );


    if (cartBadge) {

        cartBadge.textContent =
            itemCount;

    }


    /*
       Mini-cart subtotal
    */

    const miniSubtotal =
        document.getElementById(
            "miniCartSubtotal"
        );


    if (miniSubtotal) {

        miniSubtotal.textContent =
            `$${total.toFixed(2)}`;

    }


    /*
       Render all products
    */

    renderMiniCart();

}


/* =========================================================
   MINI CART
========================================================= */

function renderMiniCart() {

    const container =
        document.getElementById(
            "miniCartItems"
        );

    const footer =
        document.getElementById(
            "miniCartFooter"
        );


    if (!container) {
        return;
    }


    const items =
        getCartItems()
            .map(function (item, index) {

                return normalizeCartItem(
                    item,
                    index
                );

            })
            .filter(Boolean);


    /*
       EMPTY
    */

    if (items.length === 0) {

        container.innerHTML = `
            <p class="empty-msg">
                Your cart is empty.
            </p>
        `;


        if (footer) {

            footer.style.display =
                "none";

        }

        return;

    }


    /*
       SHOW ALL CART PRODUCTS
    */

    container.innerHTML = "";


    items.forEach(function (item) {

        const image =
            item.image ||
            "images/logo.png";


        const itemTotal =
            item.price *
            item.quantity;


        container.insertAdjacentHTML(
            "beforeend",
            `
            <div
                class="mini-cart-item"
                data-product-id="${escapeHTML(item.id)}"
            >

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(item.name)}"
                    class="mini-cart-img"
                    onerror="
                        this.onerror=null;
                        this.src='images/logo.png';
                    "
                >

                <div class="mini-cart-product-info">

                    <div class="mini-cart-title">
                        ${escapeHTML(item.name)}
                    </div>

                    <div class="mini-cart-price">
                        ${item.quantity} ×
                        $${item.price.toFixed(2)}
                    </div>

                </div>

                <button
                    type="button"
                    class="mini-cart-remove"
                    data-product-id="${escapeHTML(item.id)}"
                    title="Remove"
                >
                    <i class="fas fa-trash"></i>
                </button>

            </div>
            `
        );

    });


    if (footer) {

        footer.style.display =
            "block";

    }

}


/* =========================================================
   COUPON ACCORDION
========================================================= */

function setupCouponAccordion() {

    const toggle =
        document.getElementById(
            'couponToggle'
        );


    const content =
        document.getElementById(
            'couponContent'
        );


    if (
        !toggle ||
        !content
    ) {

        return;

    }


    toggle.addEventListener(
        'click',
        function () {

            toggle.classList.toggle(
                'active'
            );


            content.classList.toggle(
                'show'
            );

        }
    );

}


/* =========================================================
   APPLY COUPON
========================================================= */

function applyCoupon() {

    const input =
        document.getElementById(
            'couponInput'
        );


    if (
        !input
    ) {

        return;

    }


    const code =
        input.value.trim();


    if (!code) {

        return;

    }


    alert(
        `Coupon "${code}" applied!`
    );


    input.value = '';

}


/* =========================================================
   CHECKOUT
========================================================= */

function setupCheckout() {

    const checkoutBtn =
        document.getElementById(
            'checkoutBtn'
        );


    if (!checkoutBtn) {

        return;

    }


    checkoutBtn.addEventListener(
        'click',
        function () {

            const items =
                getCartItems();


            if (
                items.length === 0
            ) {

                alert(
                    'Your cart is empty.'
                );

                return;

            }


            /*
             * Change this to your actual
             * checkout page when ready.
             */

            window.location.href =
                'checkout.html';

        }
    );

}


/* =========================================================
   SCROLL TO TOP
========================================================= */

function setupScrollTop() {

    const button =
        document.getElementById(
            'scrollToTop'
        );


    if (!button) {

        return;

    }


    window.addEventListener(
        'scroll',
        function () {

            if (
                window.scrollY > 300
            ) {

                button.style.display =
                    'flex';

            }
            else {

                button.style.display =
                    'none';

            }

        }
    );


    button.addEventListener(
        'click',
        function () {

            window.scrollTo({

                top: 0,

                behavior: 'smooth'

            });

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return '';

    }


    return String(value)

        .replace(
            /&/g,
            '&amp;'
        )

        .replace(
            /</g,
            '&lt;'
        )

        .replace(
            />/g,
            '&gt;'
        )

        .replace(
            /"/g,
            '&quot;'
        )

        .replace(
            /'/g,
            '&#039;'
        );

}


/* =========================================================
   MAKE FUNCTIONS AVAILABLE TO HTML
========================================================= */

window.changeQty =
    changeQty;

window.removeItem =
    removeItem;

window.applyCoupon =
    applyCoupon;