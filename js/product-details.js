(function () {

    "use strict";


    /* =====================================================
       GET PRODUCT ID FROM URL
    ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const productId =
        Number(
            params.get("id")
        );


    /* =====================================================
       WAIT FOR SHOP CATALOG
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            if (
                typeof products ===
                "undefined"
            ) {

                console.error(
                    "Product catalog not found."
                );

                return;

            }


            const product =
                products.find(
                    function (item) {

                        return (
                            Number(item.id) ===
                            productId
                        );

                    }
                );


            if (!product) {

                showProductNotFound();

                return;

            }


            renderProductDetails(
                product
            );

            renderRelatedProducts(
                product
            );

            initializeProductTabs();

            initializeQuantity();

            initializeImageModal();

        }
    );


    /* =====================================================
       PRODUCT NOT FOUND
    ===================================================== */

    function showProductNotFound() {

        const container =
            document.querySelector(
                ".product-details-container"
            );

        if (!container) {
            return;
        }

        container.innerHTML = `

            <div
                style="
                    width:100%;
                    text-align:center;
                    padding:100px 20px;
                "
            >

                <h1>
                    Product not found
                </h1>

                <p>
                    Sorry, this product is no longer
                    available.
                </p>

                <a
                    href="shop.html"
                    style="
                        display:inline-block;
                        margin-top:25px;
                        padding:14px 25px;
                        background:#ff9900;
                        color:#111;
                        text-decoration:none;
                        border-radius:6px;
                        font-weight:700;
                    "
                >
                    BACK TO SHOP
                </a>

            </div>

        `;

    }


    /* =====================================================
       RENDER PRODUCT
    ===================================================== */

    function renderProductDetails(
        product
    ) {

        const title =
            document.getElementById(
                "productTitle"
            );

        const price =
            document.getElementById(
                "productPrice"
            );

        const oldPrice =
            document.getElementById(
                "productOldPrice"
            );

        const mainImage =
            document.getElementById(
                "mainProductImage"
            );

        const sale =
            document.getElementById(
                "detailSale"
            );

        const productIdElement =
            document.getElementById(
                "productId"
            );


        /* TITLE */

        if (title) {

            title.textContent =
                product.title;

        }


        /* PRICE */

        if (price) {

            price.textContent =
                "$" +
                Number(
                    product.price
                ).toFixed(2);

        }


        /* OLD PRICE */

        if (oldPrice) {

            if (product.oldPrice) {

                oldPrice.textContent =
                    "$" +
                    Number(
                        product.oldPrice
                    ).toFixed(2);

                oldPrice.style.display =
                    "block";

            } else {

                oldPrice.textContent = "";

                oldPrice.style.display =
                    "none";

            }

        }


        /* SALE */

        if (sale) {

            sale.style.display =
                product.sale
                    ? "inline-block"
                    : "none";

        }


        /* MAIN IMAGE */

        if (mainImage) {

            mainImage.src =
                product.image;

            mainImage.alt =
                product.title;

            mainImage.onerror =
                function () {

                    this.onerror = null;

                    this.src =
                        "images/logo.png";

                };

        }


        /* PRODUCT ID */

        if (productIdElement) {

            productIdElement.textContent =
                product.id;

        }


        /* CATEGORY */

        const categoryName =
            formatCategory(
                product.category
            );


        const categoryLink =
            document.getElementById(
                "productCategoryLink"
            );

        if (categoryLink) {

            categoryLink.textContent =
                categoryName;

            categoryLink.href =
                "shop.html?category=" +
                encodeURIComponent(
                    product.category
                );

        }


        /* BREADCRUMB CATEGORY */

        const breadcrumbCategory =
            document.getElementById(
                "breadcrumbCategory"
            );

        if (breadcrumbCategory) {

            breadcrumbCategory.textContent =
                categoryName;

            breadcrumbCategory.href =
                "shop.html?category=" +
                encodeURIComponent(
                    product.category
                );

        }


        /* BREADCRUMB PRODUCT */

        const breadcrumbProduct =
            document.getElementById(
                "breadcrumbProduct"
            );

        if (breadcrumbProduct) {

            breadcrumbProduct.textContent =
                product.title;

        }


        /* DESCRIPTION */

        const shortDescription =
            document.getElementById(
                "productShortDescription"
            );

        const fullDescription =
            document.getElementById(
                "fullProductDescription"
            );


        const description =
            createDescription(
                product
            );


        if (shortDescription) {

            shortDescription.textContent =
                description.short;

        }


        if (fullDescription) {

    fullDescription.innerHTML =
        `
        <p>
            ${escapeHTML(description.full)}
        </p>
        `;

}
renderProductOptions(product);
renderProductDetailsTable(product);


        /* THUMBNAILS */

        renderThumbnails(
            product
        );


        /* ADD TO CART */

        const addButton =
    document.getElementById(
        "detailAddCart"
    );


if (addButton) {

    addButton.onclick =
        function () {

            addProductToCart(
                product
            );

        };

}


        /* WISHLIST */

        initializeDetailWishlist(
            product
        );


        /* PAGE TITLE */

        document.title =
            product.title +
            " - WebStore Inc";

    }


    /* =====================================================
       CATEGORY NAME
    ===================================================== */

    function formatCategory(
        category
    ) {

        const names = {

            auto:
                "Auto & Tires",

            clothing:
                "Clothing",

            electronics:
                "Electronics",

            home:
                "Home & Appliances",

            industrial:
                "Industrial & Scientific",

            office:
                "Office Supplies",

            patio:
                "Patio & Garden",

            personal:
                "Personal Care",

            sports:
                "Sports & Outdoors"

        };


        return (
            names[category] ||
            "Other"
        );

    }


    /* =====================================================
       DESCRIPTION
    ===================================================== */

function createDescription(product) {

    const category =
        formatCategory(product.category);

    const short =
        product.shortDescription ||
        (
            "Quality " +
            category.toLowerCase() +
            " product designed for everyday use."
        );

    const full =
        product.description ||
        (
            product.title +
            " is a quality product from the " +
            category +
            " collection at WebStore Inc."
        );

    return {
        short: short,
        full: full
    };

}

/* =====================================================
   PRODUCT DETAILS TABLE
===================================================== */

function renderProductDetailsTable(product) {

    const container =
        document.getElementById(
            "productDetailsTable"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const details = product.details || {};

    const detailEntries =
        Object.entries(details);

    if (detailEntries.length === 0) {

        container.style.display = "none";

        return;
    }

    container.style.display = "block";

    detailEntries.forEach(
        function ([key, value]) {

            const row =
                document.createElement("div");

            row.className =
                "product-detail-row";

            const label =
                document.createElement("div");

            label.className =
                "product-detail-label";

            label.textContent =
                formatDetailLabel(key);

            const detailValue =
                document.createElement("div");

            detailValue.className =
                "product-detail-value";

            detailValue.textContent =
                value;

            row.appendChild(label);

            row.appendChild(detailValue);

            container.appendChild(row);

        }
    );

}


/* =====================================================
   FORMAT DETAIL LABEL
===================================================== */

function formatDetailLabel(key) {

    const labels = {

        brand: "Brand",

        model: "Model",

        capacity: "Capacity",

        color: "Color",

        interface: "Interface",

        readSpeed: "Read Speed",

        writeSpeed: "Write Speed",

        waterDustResistance:
            "Water & Dust Resistance",

        dropResistance:
            "Drop Resistance",

        encryption:
            "Encryption",

        dimensions:
            "Dimensions",

        weight:
            "Weight",

        warranty:
            "Warranty"

    };

    if (labels[key]) {

        return labels[key];

    }

    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, function (letter) {
            return letter.toUpperCase();
        });

}

/* =====================================================
   PRODUCT OPTIONS
   SIZE / COLOR
===================================================== */

function renderProductOptions(
    product
) {

    const container =
        document.getElementById(
            "productOptions"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const options =
        product.options || {};


    /*
       SIZE
    */

    if (
        Array.isArray(options.sizes) &&
        options.sizes.length > 0
    ) {

        const sizeGroup =
            document.createElement(
                "div"
            );

        sizeGroup.className =
            "product-option-group";


        sizeGroup.innerHTML = `

            <span class="product-option-title">
                Size
            </span>

            <div
                class="product-option-values"
                data-option="size"
            ></div>

        `;


        const sizeContainer =
            sizeGroup.querySelector(
                ".product-option-values"
            );


        options.sizes.forEach(
            function (size) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "product-option-btn";


                button.textContent =
                    size;


                button.dataset.value =
                    size;


                button.addEventListener(
                    "click",
                    function () {

                        sizeContainer
                            .querySelectorAll(
                                ".product-option-btn"
                            )
                            .forEach(
                                function (item) {

                                    item.classList.remove(
                                        "selected"
                                    );

                                }
                            );


                        button.classList.add(
                            "selected"
                        );

                    }
                );


                sizeContainer.appendChild(
                    button
                );

            }
        );


        container.appendChild(
            sizeGroup
        );

    }


    /*
       COLOR
    */

    if (
        Array.isArray(options.colors) &&
        options.colors.length > 0
    ) {

        const colorGroup =
            document.createElement(
                "div"
            );

        colorGroup.className =
            "product-option-group";


        colorGroup.innerHTML = `

            <span class="product-option-title">
                Color
            </span>

            <div
                class="product-option-values"
                data-option="color"
            ></div>

        `;


        const colorContainer =
            colorGroup.querySelector(
                ".product-option-values"
            );


        options.colors.forEach(
            function (color) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "product-option-btn";


                button.textContent =
                    color;


                button.dataset.value =
                    color;


                button.addEventListener(
                    "click",
                    function () {

                        colorContainer
                            .querySelectorAll(
                                ".product-option-btn"
                            )
                            .forEach(
                                function (item) {

                                    item.classList.remove(
                                        "selected"
                                    );

                                }
                            );


                        button.classList.add(
                            "selected"
                        );

                    }
                );


                colorContainer.appendChild(
                    button
                );

            }
        );


        container.appendChild(
            colorGroup
        );

    }

}

renderProductOptions(
    product
);

    /* =====================================================
       THUMBNAILS
    ===================================================== */

    function renderThumbnails(
        product
    ) {

        const container =
            document.getElementById(
                "productThumbnails"
            );


        if (!container) {
            return;
        }


        container.innerHTML = "";

        const images = [
            product.image
        ];


        images.forEach(
            function (image, index) {

                const thumbnail =
                    document.createElement(
                        "button"
                    );

                thumbnail.type =
                    "button";

                thumbnail.className =
                    "product-thumbnail";

                if (index === 0) {

                    thumbnail.classList.add(
                        "active"
                    );

                }


                thumbnail.innerHTML = `

                    <img
                        src="${escapeAttribute(image)}"
                        alt="${escapeAttribute(product.title)}"
                    >

                `;


                thumbnail.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelectorAll(
                                ".product-thumbnail"
                            )
                            .forEach(
                                function (item) {

                                    item.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        thumbnail.classList.add(
                            "active"
                        );


                        const mainImage =
                            document.getElementById(
                                "mainProductImage"
                            );


                        if (mainImage) {

                            mainImage.src =
                                image;

                        }

                    }
                );


                container.appendChild(
                    thumbnail
                );

            }
        );

    }

    /* =====================================================
   PRODUCT IMAGE GALLERY
===================================================== */

function renderThumbnails(product) {

    const container =
        document.getElementById(
            "productThumbnails"
        );

    const mainImage =
        document.getElementById(
            "mainProductImage"
        );

    const previousButton =
        document.getElementById(
            "galleryPrev"
        );

    const nextButton =
        document.getElementById(
            "galleryNext"
        );


    if (
        !container ||
        !mainImage
    ) {
        return;
    }


    let images = [];

    if (
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {

        images = [
            ...product.images
        ];

    } else if (
        product.image
    ) {

        images = [
            product.image
        ];

    }


    /*
       Remove empty image paths.
    */

    images =
        images.filter(
            function (image) {

                return (
                    typeof image === "string" &&
                    image.trim() !== ""
                );

            }
        );


    if (
        images.length === 0
    ) {
        return;
    }


    let currentImageIndex = 0;


    /*
       Show selected image.
    */

    function showImage(index) {

        if (
            index < 0 ||
            index >= images.length
        ) {
            return;
        }


        currentImageIndex = index;


        mainImage.src =
            images[currentImageIndex];


        /*
           Update active thumbnail.
        */

        document
            .querySelectorAll(
                ".product-thumbnail"
            )
            .forEach(
                function (thumbnail, thumbnailIndex) {

                    thumbnail.classList.toggle(
                        "active",
                        thumbnailIndex ===
                        currentImageIndex
                    );

                }
            );


        /*
           Update arrow visibility.
        */

        if (previousButton) {

            previousButton.style.display =
                images.length > 1
                    ? "flex"
                    : "none";

        }


        if (nextButton) {

            nextButton.style.display =
                images.length > 1
                    ? "flex"
                    : "none";

        }

    }


    /*
       Create thumbnails.
    */

    container.innerHTML = "";


    images.forEach(
        function (image, index) {

            const thumbnail =
                document.createElement(
                    "button"
                );


            thumbnail.type =
                "button";


            thumbnail.className =
                "product-thumbnail";


            if (
                index === 0
            ) {

                thumbnail.classList.add(
                    "active"
                );

            }


            thumbnail.innerHTML = `

                <img
                    src="${escapeAttribute(image)}"
                    alt="${escapeAttribute(product.title)}"
                    onerror="
                        this.onerror=null;
                        this.src='images/logo.png';
                    "
                >

            `;


            thumbnail.addEventListener(
                "click",
                function () {

                    showImage(index);

                }
            );


            container.appendChild(
                thumbnail
            );

        }
    );


    /*
       Previous arrow.
    */

    if (previousButton) {

        previousButton.onclick =
            function () {

                if (
                    images.length <= 1
                ) {
                    return;
                }


                currentImageIndex--;

                if (
                    currentImageIndex < 0
                ) {

                    currentImageIndex =
                        images.length - 1;

                }


                showImage(
                    currentImageIndex
                );

            };

    }


    /*
       Next arrow.
    */

    if (nextButton) {

        nextButton.onclick =
            function () {

                if (
                    images.length <= 1
                ) {
                    return;
                }


                currentImageIndex++;

                if (
                    currentImageIndex >=
                    images.length
                ) {

                    currentImageIndex = 0;

                }


                showImage(
                    currentImageIndex
                );

            };

    }


    /*
       Show first image.
    */

    showImage(0);

}

    /* =====================================================
       QUANTITY
    ===================================================== */

    function initializeQuantity() {

        let quantity = 1;


        const quantityValue =
            document.getElementById(
                "quantityValue"
            );

        const minus =
            document.getElementById(
                "quantityMinus"
            );

        const plus =
            document.getElementById(
                "quantityPlus"
            );


        if (minus) {

            minus.addEventListener(
                "click",
                function () {

                    if (quantity > 1) {

                        quantity--;

                        quantityValue.textContent =
                            quantity;

                    }

                }
            );

        }


        if (plus) {

            plus.addEventListener(
                "click",
                function () {

                    quantity++;

                    quantityValue.textContent =
                        quantity;

                }
            );

        }


        window.getProductQuantity =
            function () {

                return quantity;

            };

    }


    /* =====================================================
   ADD PRODUCT TO CART
===================================================== */

function addProductToCart(
    product
) {

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

    } catch (error) {

        cart = [];

    }


    const quantity =
        typeof window.getProductQuantity ===
        "function"
            ? window.getProductQuantity()
            : 1;


    /*
       GET SELECTED SIZE
    */

    const selectedSize =
        document.querySelector(
            '#productOptions [data-option="size"] .product-option-btn.selected'
        );


    /*
       GET SELECTED COLOR
    */

    const selectedColor =
        document.querySelector(
            '#productOptions [data-option="color"] .product-option-btn.selected'
        );


    const hasSizes =
        product.options &&
        Array.isArray(
            product.options.sizes
        ) &&
        product.options.sizes.length > 0;


    const hasColors =
        product.options &&
        Array.isArray(
            product.options.colors
        ) &&
        product.options.colors.length > 0;


    const size =
        selectedSize
            ? selectedSize.dataset.value
            : "";


    const color =
        selectedColor
            ? selectedColor.dataset.value
            : "";


    /*
       REQUIRE SIZE
    */

    if (
        hasSizes &&
        !size
    ) {

        alert(
            "Please select a size."
        );

        return;

    }


    /*
       REQUIRE COLOR
    */

    if (
        hasColors &&
        !color
    ) {

        alert(
            "Please select a color."
        );

        return;

    }


    const variantKey =
        String(product.id) +
        "-" +
        String(size || "") +
        "-" +
        String(color || "");


    const existingIndex =
        cart.findIndex(
            function (item) {

                return (
                    String(
                        item.variantKey ||
                        item.id
                    ) ===
                    variantKey
                );

            }
        );


    if (
        existingIndex !==
        -1
    ) {

        cart[
            existingIndex
        ].quantity =
            Number(
                cart[
                    existingIndex
                ].quantity || 1
            ) + quantity;

    }

    else {

        let displayName =
            product.title;


        if (size) {

            displayName +=
                " | Size: " +
                size;

        }


        if (color) {

            displayName +=
                " | Color: " +
                color;

        }


        cart.push({

            id:
                product.id,

            variantKey:
                variantKey,

            name:
                displayName,

            title:
                product.title,

            price:
                Number(
                    product.price
                ),

            image:
                product.image,

            quantity:
                quantity,

            category:
                product.category,

            size:
                size,

            color:
                color

        });

    }


    localStorage.setItem(
        CART_KEY,
        JSON.stringify(
            cart
        )
    );


    window.dispatchEvent(
        new CustomEvent(
            "webstore:cart-updated"
        )
    );


    if (
        typeof updateHeaderCart ===
        "function"
    ) {

        updateHeaderCart();

    }


    if (
        typeof renderCartPage ===
        "function"
    ) {

        renderCartPage();

    }


    const button =
        document.getElementById(
            "detailAddCart"
        );


    if (button) {

        const originalText =
            button.textContent;


        button.textContent =
            "ADDED TO CART ✓";


        setTimeout(
            function () {

                button.textContent =
                    originalText;

            },
            1200
        );

    }

}


    /* =====================================================
       WISHLIST
    ===================================================== */

    function initializeDetailWishlist(
        product
    ) {

        const button =
            document.getElementById(
                "detailWishlist"
            );


        if (!button) {
            return;
        }


        const icon =
            button.querySelector(
                "i"
            );


        function getWishlist() {

            try {

                return JSON.parse(
                    localStorage.getItem(
                        "webstore_wishlist"
                    )
                ) || [];

            } catch (error) {

                return [];

            }

        }


        function updateHeart() {

            const wishlist =
                getWishlist();


            const exists =
                wishlist.some(
                    function (item) {

                        return String(
                            item.id
                        ) === String(
                            product.id
                        );

                    }
                );


            if (exists) {

                button.classList.add(
                    "active"
                );

                icon.className =
                    "fas fa-heart";

            } else {

                button.classList.remove(
                    "active"
                );

                icon.className =
                    "far fa-heart";

            }

        }


        updateHeart();


        button.addEventListener(
            "click",
            function () {

                let wishlist =
                    getWishlist();


                const index =
                    wishlist.findIndex(
                        function (item) {

                            return String(
                                item.id
                            ) === String(
                                product.id
                            );

                        }
                    );


                if (index !== -1) {

                    wishlist.splice(
                        index,
                        1
                    );

                } else {

                    wishlist.push({

                        id:
                            product.id,

                        title:
                            product.title,

                        price:
                            "$" +
                            Number(
                                product.price
                            ).toFixed(2),

                        image:
                            product.image

                    });

                }


                localStorage.setItem(
                    "webstore_wishlist",
                    JSON.stringify(
                        wishlist
                    )
                );


                updateHeart();

            }
        );

    }


    /* =====================================================
       RELATED PRODUCTS
    ===================================================== */

    function renderRelatedProducts(
        currentProduct
    ) {

        const container =
            document.getElementById(
                "relatedProducts"
            );


        if (!container) {
            return;
        }


        const related =
            products
                .filter(
                    function (product) {

                        return (
                            product.category ===
                            currentProduct.category &&
                            Number(product.id) !==
                            Number(currentProduct.id)
                        );

                    }
                )
                .slice(0, 6);


        container.innerHTML = "";


        related.forEach(
            function (product) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "related-product-card";


                card.innerHTML = `

                    ${
                        product.sale
                            ?
                            `
                            <span
                                class="badge-sale"
                                style="
                                    position:absolute;
                                    top:15px;
                                    left:15px;
                                    background:#CC0C39;
                                    color:white;
                                    padding:7px 10px;
                                    border-radius:4px;
                                    font-size:11px;
                                    font-weight:700;
                                "
                            >
                                SALE
                            </span>
                            `
                            :
                            ""
                    }


                    <img
                        src="${escapeAttribute(product.image)}"
                        alt="${escapeAttribute(product.title)}"
                        onerror="
                            this.onerror=null;
                            this.src='images/logo.png';
                        "
                    >


                    <h3>
                        ${escapeHTML(product.title)}
                    </h3>


                    <div class="related-price">
                        $${Number(product.price).toFixed(2)}
                    </div>


                    <button
                        type="button"
                        class="related-add-cart"
                    >
                        ADD TO CART
                    </button>

                `;


                card.addEventListener(
                    "click",
                    function (event) {

                        if (
                            event.target.closest(
                                ".related-add-cart"
                            )
                        ) {

                            return;

                        }


                        window.location.href =
                            "product-details.html?id=" +
                            encodeURIComponent(
                                product.id
                            );

                    }
                );


                const addButton =
                    card.querySelector(
                        ".related-add-cart"
                    );


                addButton.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();

                        addProductToCart(
                            product
                        );

                    }
                );


                container.appendChild(
                    card
                );

            }
        );

    }


    /* =====================================================
       TABS
    ===================================================== */

    function initializeProductTabs() {

        const tabs =
            document.querySelectorAll(
                ".product-tab"
            );


        tabs.forEach(
            function (tab) {

                tab.addEventListener(
                    "click",
                    function () {

                        const target =
                            tab.getAttribute(
                                "data-tab"
                            );


                        tabs.forEach(
                            function (item) {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        document
                            .querySelectorAll(
                                ".product-tab-content"
                            )
                            .forEach(
                                function (content) {

                                    content.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        tab.classList.add(
                            "active"
                        );


                        if (
                            target ===
                            "description"
                        ) {

                            document
                                .getElementById(
                                    "descriptionTab"
                                )
                                .classList.add(
                                    "active"
                                );

                        }


                        if (
                            target ===
                            "reviews"
                        ) {

                            document
                                .getElementById(
                                    "reviewsTab"
                                )
                                .classList.add(
                                    "active"
                                );

                        }

                    }
                );

            }
        );

    }


    /* =====================================================
       IMAGE MODAL
    ===================================================== */

    function initializeImageModal() {

        const expand =
            document.getElementById(
                "imageExpandBtn"
            );

        const modal =
            document.getElementById(
                "imageModal"
            );

        const modalImage =
            document.getElementById(
                "modalProductImage"
            );

        const close =
            document.getElementById(
                "closeImageModal"
            );

        const mainImage =
            document.getElementById(
                "mainProductImage"
            );


        if (
            !expand ||
            !modal ||
            !modalImage ||
            !close ||
            !mainImage
        ) {

            return;

        }


        expand.addEventListener(
            "click",
            function () {

                modalImage.src =
                    mainImage.src;

                modal.classList.add(
                    "active"
                );

            }
        );


        close.addEventListener(
            "click",
            function () {

                modal.classList.remove(
                    "active"
                );

            }
        );


        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    modal
                ) {

                    modal.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    /* =====================================================
       SECURITY
    ===================================================== */

    function escapeHTML(
        value
    ) {

        if (
            value === undefined ||
            value === null
        ) {

            return "";

        }


        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    function escapeAttribute(
        value
    ) {

        return escapeHTML(
            value
        );

    }

})();