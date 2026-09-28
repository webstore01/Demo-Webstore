(function () {

    "use strict";

    /* =====================================================
       HOME PAGE ADD TO CART
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".btn-add-cart"
                );

        
            if (!button) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            const productCard =
                button.closest(
                    ".product-card"
                );


            if (!productCard) {

                console.error(
                    "Add to Cart: Product card not found."
                );

                return;

            }


            /*
               Get the product ID.
            */
            const productId =
                productCard.getAttribute(
                    "data-id"
                );


            if (!productId) {

                console.error(
                    "Add to Cart: Product ID not found."
                );

                return;

            }

            let product = null;


            if (
                typeof products !==
                "undefined"
            ) {

                product =
                    products.find(
                        function (item) {

                            return String(
                                item.id
                            ) === String(
                                productId
                            );

                        }
                    );

            }


            if (!product) {

                console.error(
                    "Add to Cart: Product not found in catalog.",
                    productId
                );

                return;

            }


      
            const CART_KEY =
                "webstore_cart";


            let cart = [];


            try {

                cart =
                    JSON.parse(
                        localStorage.getItem(
                            CART_KEY
                        )
                    ) || [];


                if (!Array.isArray(cart)) {
                    cart = [];
                }

            } catch (error) {

                console.error(
                    "Add to Cart: Could not read cart.",
                    error
                );

                cart = [];

            }

            const existingIndex =
                cart.findIndex(
                    function (item) {

                        return String(
                            item.id
                        ) === String(
                            product.id
                        );

                    }
                );

            if (
                existingIndex !== -1
            ) {

                cart[
                    existingIndex
                ].quantity =
                    Number(
                        cart[
                            existingIndex
                        ].quantity || 1
                    ) + 1;

            }

        
            else {

                cart.push({

                    id:
                        product.id,

                    name:
                        product.title,

                    title:
                        product.title,

                    price:
                        Number(
                            product.price
                        ),

                    image:
                        product.image,

                    imgSrc:
                        product.image,

                    quantity:
                        1,

                    category:
                        product.category

                });

            }


            /*
               Save cart.
            */
            localStorage.setItem(
                CART_KEY,
                JSON.stringify(cart)
            );


    
            if (
                typeof window.updateHeaderCart ===
                "function"
            ) {

                window.updateHeaderCart();

            }


            /*
               Button confirmation.
            */
            const originalText =
                button.textContent;


            button.textContent =
                "ADDED ✓";


            button.classList.add(
                "added"
            );


            setTimeout(
                function () {

                    button.textContent =
                        originalText;

                    button.classList.remove(
                        "added"
                    );

                },
                1000
            );


            console.log(
                "Added to cart:",
                product.title
            );

        },
        false
    );

    /* =====================================================
       WHEN PAGE LOADS
       ===================================================== */

    document.addEventListener("DOMContentLoaded", function () {

        /* =========================================================
   NEWSLETTER SUBSCRIPTION
========================================================= */

const subscribeForm =
    document.getElementById(
        "subscribeForm"
    );

const subscribeEmail =
    document.getElementById(
        "subscribeEmail"
    );

const subscribeSuccess =
    document.getElementById(
        "subscribeSuccess"
    );


if (
    subscribeForm &&
    subscribeEmail &&
    subscribeSuccess
) {

    subscribeForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* Browser checks email format */

            if (
                !subscribeEmail.checkValidity()
            ) {

                subscribeEmail.reportValidity();

                return;

            }


            /* Hide the form */

            subscribeForm.style.display =
                "none";


            /* Show success message */

            subscribeSuccess.style.display =
                "block";

        }
    );

}

        /* =================================================
   MINI CART
   ================================================= */

const cartTrigger =
    document.getElementById("cartTrigger") ||
    document.querySelector(".cart-trigger");

const miniCartDropdown =
    document.getElementById("miniCartDropdown") ||
    document.querySelector(".mini-cart-dropdown");


/* =================================================
   CART ICON → VIEW CART PAGE
   ================================================= */

if (cartTrigger) {

    cartTrigger.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            window.location.href =
                "cart.html";

        }
    );

}


/* =================================================
   MINI CART DELETE PRODUCT
   ================================================= */

document.addEventListener(
    "click",
    function (event) {

        const removeButton =
            event.target.closest(
                ".mini-cart-remove"
            );


        /*
           Not a delete button.
        */

        if (!removeButton) {

            return;

        }


        event.preventDefault();

        event.stopPropagation();


        /*
           Get product ID.
        */

        const productId =
            removeButton.getAttribute(
                "data-product-id"
            );


        if (!productId) {

            console.error(
                "Mini Cart: Product ID not found."
            );

            return;

        }


        /*
           Read current cart.
        */

        let cart = [];


        try {

            cart =
                JSON.parse(
                    localStorage.getItem(
                        "webstore_cart"
                    )
                ) || [];


            if (!Array.isArray(cart)) {

                cart = [];

            }

        } catch (error) {

            console.error(
                "Mini Cart: Could not read cart.",
                error
            );

            cart = [];

        }



        cart =
            cart.filter(
                function (item) {

                    return String(
                        item.id
                    ) !== String(
                        productId
                    );

                }
            );


        /*
           Save updated cart.
        */

        localStorage.setItem(
            "webstore_cart",
            JSON.stringify(cart)
        );

        if (
            typeof window.updateHeaderCart ===
            "function"
        ) {

            window.updateHeaderCart();

        }



        if (miniCartDropdown) {

            miniCartDropdown.classList.add(
                "active"
            );

        }

    }
);


/* =================================================
   CLOSE MINI CART WHEN CLICKING OUTSIDE
   ================================================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            !miniCartDropdown ||
            !cartTrigger
        ) {

            return;

        }


   

        if (
            miniCartDropdown.contains(
                event.target
            )
        ) {

            return;

        }


        if (
            cartTrigger.contains(
                event.target
            )
        ) {

            return;

        }


        miniCartDropdown.classList.remove(
            "active"
        );

    }
);

        /* =================================================
   HOME PAGE CATEGORY CARDS
   ================================================= */

const categoryCards =
    document.querySelectorAll(".category-card[data-category]");

categoryCards.forEach(function (card) {

    card.addEventListener("click", function () {

        const category =
            card.getAttribute("data-category");

        if (!category) {
            return;
        }

        if (category === "all") {

            window.location.href =
                "shop.html";

        } else {

            window.location.href =
                "shop.html?category=" +
                encodeURIComponent(category);

        }

    });

});

/* =================================================
   HOME + SHOP PRODUCT DETAILS
   ================================================= */

document.addEventListener(
    "click",
    function (event) {


        if (
            event.target.closest(
                "button, .wishlist-icon, .fav-btn, a"
            )
        ) {
            return;
        }


    

        const card =
            event.target.closest(
                ".product-card"
            );


        if (!card) {
            return;
        }


        /*
           Get product information
        */

        const titleElement =
            card.querySelector(
                "h4, h3, h2, .product-title"
            );


        if (!titleElement) {
            return;
        }


        const title =
            titleElement.textContent.trim();



        let productId = null;


        if (
            typeof products !==
            "undefined"
        ) {

            const product =
                products.find(
                    function (item) {

                        return (
                            item.title.trim() ===
                            title
                        );

                    }
                );


            if (product) {

                productId =
                    product.id;

            }

        }



        if (!productId) {

            productId =
                card.getAttribute(
                    "data-id"
                );

        }



        if (productId) {

            window.location.href =
                "product-details.html?id=" +
                encodeURIComponent(
                    productId
                );

        }

    }
);

/* =========================================================
   HEADER SEARCH
========================================================= */

const headerSearchToggle =
    document.getElementById(
        "headerSearchToggle"
    );

const searchOverlayBar =
    document.getElementById(
        "searchOverlayBar"
    );

const closeSearchBtn =
    document.getElementById(
        "closeSearchBtn"
    );

const productSearchInput =
    document.getElementById(
        "productSearchInput"
    );

const productSearchBtn =
    document.getElementById(
        "productSearchBtn"
    );


/* =========================================================
   OPEN SEARCH BAR
========================================================= */

if (
    headerSearchToggle &&
    searchOverlayBar
) {

    headerSearchToggle.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            searchOverlayBar.classList.remove(
                "hidden"
            );

            searchOverlayBar.classList.add(
                "active"
            );

            if (productSearchInput) {

                productSearchInput.focus();

            }

        }
    );

}


/* =========================================================
   CLOSE SEARCH BAR
========================================================= */

if (
    closeSearchBtn &&
    searchOverlayBar
) {

    closeSearchBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            searchOverlayBar.classList.add(
                "hidden"
            );

            searchOverlayBar.classList.remove(
                "active"
            );

            if (productSearchInput) {

                productSearchInput.value = "";

            }

        }
    );

}


/* =========================================================
   GO TO SHOP WITH SEARCH
========================================================= */

function goToShopWithSearch() {

    if (!productSearchInput) {

        return;

    }


    const query =
        productSearchInput.value
            .trim();



    if (!query) {

        productSearchInput.focus();

        return;

    }



    window.location.href =
        "shop.html?search=" +
        encodeURIComponent(
            query
        );

}


/* =========================================================
   SEARCH BUTTON
========================================================= */

if (productSearchBtn) {

    productSearchBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            goToShopWithSearch();

        }
    );

}


/* =========================================================
   ENTER KEY
========================================================= */

if (productSearchInput) {

    productSearchInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                goToShopWithSearch();

            }

        }
    );

}
        /* =================================================
           CAROUSEL BUTTONS
           ================================================= */

        const carousels = document.querySelectorAll(".carousel-wrapper");

        carousels.forEach(function (carousel) {

            const container = carousel.querySelector(".carousel-container");
            const previous = carousel.querySelector(".prev-btn");
            const next = carousel.querySelector(".next-btn");

            if (!container) {
                return;
            }

            if (next) {
                next.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    container.scrollBy({ left: 320, behavior: "smooth" });
                });
            }

            if (previous) {
                previous.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    container.scrollBy({ left: -320, behavior: "smooth" });
                });
            }
        });

        /* =================================================
           INITIAL CART
           ================================================= */

        console.log("WebStore cart & search initialized.");

    });

})();