document.addEventListener("DOMContentLoaded", function () {

    initWishlistButtons();
    syncWishlistIcons();
    initWishlistPage();
    bindScrollToTop();

});


/* =========================================================
   1. GET WISHLIST FROM LOCAL STORAGE
   ========================================================= */

function getWishlist() {

    try {

        return JSON.parse(
            localStorage.getItem("webstore_wishlist")
        ) || [];

    } catch (error) {

        console.error("Wishlist loading error:", error);

        return [];

    }

}


/* =========================================================
   2. SAVE WISHLIST
   ========================================================= */

function saveWishlist(wishlist) {

    localStorage.setItem(
        "webstore_wishlist",
        JSON.stringify(wishlist)
    );

}


/* =========================================================
   3. CREATE A PRODUCT ID
   ========================================================= */

function getProductId(card) {

  

    if (card.dataset.id) {

        return card.dataset.id;

    }


    const titleElement =
        card.querySelector("h4, h3, h2, .product-title");

    if (!titleElement) {

        return null;

    }


    const title =
        titleElement.innerText.trim();


    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}


/* =========================================================
   4. GET PRODUCT DATA FROM CARD
   ========================================================= */

function getProductData(card) {

    if (!card) {

        return null;

    }


    const titleElement =
        card.querySelector(
            "h4, h3, h2, .product-title"
        );


    const priceElement =
    card.querySelector(
        ".price, .product-price, .price-box"
    );


    const imageElement =
        card.querySelector("img");


    if (!titleElement) {

        return null;

    }


    const title =
        titleElement.innerText.trim();


    const id =
        getProductId(card);


    if (!id) {

        return null;

    }


    const price =
        priceElement
            ? priceElement.innerText.trim()
            : "$0.00";


    const image =
        imageElement
            ? imageElement.getAttribute("src")
            : "";


    return {

        id: id,

        title: title,

        price: price,

        image: image

    };

}


/* =========================================================
   5. SYNC HEART ICONS
   ========================================================= */

function syncWishlistIcons() {

    const wishlist =
        getWishlist();


    const icons =
    document.querySelectorAll(
        ".wishlist-icon, .heart-overlay-btn, .fav-btn"
    );


    icons.forEach(function (icon) {

        const card =
            icon.closest(".product-card");


        if (!card) {

            return;

        }


        const productId =
            getProductId(card);


        if (!productId) {

            return;

        }


        const exists =
            wishlist.some(function (item) {

                return item.id === productId;

            });


        const heart =
    icon.matches(".wishlist-icon")
        ? icon
        : icon.querySelector("i");

        if (!heart) {

            return;

        }


        if (exists) {

            heart.classList.remove(
                "far",
                "fa-regular"
            );

            heart.classList.add(
                "fas",
                "fa-solid",
                "active"
            );


            if (
                icon.classList.contains(
                    "heart-overlay-btn"
                )
            ) {

                icon.classList.add("active");

            }

        } else {

            /*
             * Empty heart
             */

            heart.classList.remove(
                "fas",
                "fa-solid",
                "active"
            );

            heart.classList.add(
                "far",
                "fa-regular"
            );


            if (
                icon.classList.contains(
                    "heart-overlay-btn"
                )
            ) {

                icon.classList.remove("active");

            }

        }

    });

}


/* =========================================================
   6. HEART CLICK HANDLER
   ========================================================= */

function initWishlistButtons() {

    document.addEventListener(
        "click",
        function (event) {

            const target =
    event.target.closest(
        ".wishlist-icon, .heart-overlay-btn, .fav-btn"
    );



            if (!target) {

                return;

            }


            event.preventDefault();
            event.stopPropagation();


            const card =
                target.closest(".product-card");


            if (!card) {

                console.error(
                    "Wishlist Error: Product card not found."
                );

                return;

            }


            const product =
                getProductData(card);


            if (!product) {

                console.error(
                    "Wishlist Error: Product information not found."
                );

                return;

            }


            toggleWishlistProduct(product);

        },
        false
    );

}


/* =========================================================
   7. ADD / REMOVE PRODUCT
   ========================================================= */

function toggleWishlistProduct(product) {

    let wishlist =
        getWishlist();


    const existingIndex =
        wishlist.findIndex(function (item) {

            return item.id === product.id;

        });


    if (existingIndex !== -1) {

        /*
         * Product already exists.
         * Remove it.
         */

        wishlist.splice(
            existingIndex,
            1
        );

        showWishlistMessage(
            "Removed from wishlist"
        );

    } else {

    

        wishlist.push(product);

        showWishlistMessage(
            "Added to wishlist"
        );

    }


    saveWishlist(wishlist);


    /*
     * Immediately update hearts.
     */

    syncWishlistIcons();


    if (
        document.getElementById(
            "wishlist-content"
        )
    ) {

        initWishlistPage();

    }

}


/* =========================================================
   8. WISHLIST MESSAGE
   ========================================================= */

function showWishlistMessage(message) {

    let messageBox =
        document.getElementById(
            "wishlistMessage"
        );


    if (!messageBox) {

        messageBox =
            document.createElement("div");

        messageBox.id =
            "wishlistMessage";


        messageBox.style.position =
            "fixed";

        messageBox.style.top =
            "90px";

        messageBox.style.right =
            "25px";

        messageBox.style.zIndex =
            "99999";

        messageBox.style.background =
            "#232F3E";

        messageBox.style.color =
            "#ffffff";

        messageBox.style.padding =
            "12px 20px";

        messageBox.style.borderRadius =
            "5px";

        messageBox.style.fontSize =
            "14px";

        messageBox.style.fontWeight =
            "600";

        messageBox.style.boxShadow =
            "0 4px 12px rgba(0,0,0,0.25)";


        document.body.appendChild(
            messageBox
        );

    }


    messageBox.innerText =
        message;


    messageBox.style.display =
        "block";


    clearTimeout(
        window.wishlistMessageTimer
    );


    window.wishlistMessageTimer =
        setTimeout(function () {

            messageBox.style.display =
                "none";

        }, 1800);

}


/* =========================================================
   9. RENDER WISHLIST PAGE
   ========================================================= */

function initWishlistPage() {

    const container =
        document.getElementById(
            "wishlist-content"
        );



    if (!container) {

        return;

    }


    const wishlist =
        getWishlist();


    /*
     * Empty wishlist
     */

    if (wishlist.length === 0) {

        container.innerHTML =
            '<p class="empty-msg">There are no products on the Wishlist!</p>';

        return;

    }


    let html =
        '<div class="product-grid">';


    wishlist.forEach(function (item) {

        html += `

            <div
                class="product-card"
                data-id="${escapeHTML(item.id)}"
            >

                <div class="product-img-wrapper">

                    <button
                        type="button"
                        class="heart-overlay-btn active"
                        onclick="removeFromWishlistPage('${escapeAttribute(item.id)}')"
                        title="Remove from Wishlist"
                    >
                        <i class="fas fa-heart"></i>
                    </button>

                    <img
                        src="${escapeAttribute(item.image)}"
                        alt="${escapeHTML(item.title)}"
                    >

                </div>

                <h4 class="product-title">
                    ${escapeHTML(item.title)}
                </h4>

                <div class="price">
                    ${escapeHTML(item.price)}
                </div>

                <button
                    type="button"
                    class="btn-add-cart"
                >
                    Add to cart
                </button>

            </div>

        `;

    });


    html +=
        "</div>";


    container.innerHTML =
        html;

}


/* =========================================================
   10. REMOVE FROM WISHLIST PAGE
   ========================================================= */

function removeFromWishlistPage(productId) {

    let wishlist =
        getWishlist();


    wishlist =
        wishlist.filter(function (item) {

            return item.id !== productId;

        });


    saveWishlist(wishlist);


    syncWishlistIcons();


    initWishlistPage();


    showWishlistMessage(
        "Removed from wishlist"
    );

}


/* =========================================================
   11. HTML SECURITY HELPERS
   ========================================================= */

function escapeHTML(value) {

    if (value === undefined || value === null) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

    return escapeHTML(value);

}


/* =========================================================
   12. SCROLL TO TOP
   ========================================================= */

function bindScrollToTop() {

    const scrollBtn =
        document.getElementById(
            "scrollTopBtn"
        );


    if (!scrollBtn) {

        return;

    }


    scrollBtn.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}