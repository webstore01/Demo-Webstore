const CHECKOUT_CART_KEY = "webstore_cart";


/* =========================================================
   MONEY FORMAT
========================================================= */

function checkoutFormatMoney(value) {

    const number = Number(value) || 0;

    return "$" + number.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}


/* =========================================================
   GET CART
========================================================= */

function checkoutGetCart() {

    try {

        let savedCart =
            localStorage.getItem(
                CHECKOUT_CART_KEY
            );


        /*
         * Compatibility with older cart.
         */

        if (!savedCart) {

            savedCart =
                localStorage.getItem(
                    "webstoreCart"
                );

        }


        if (!savedCart) {

            return [];

        }


        const parsed =
            JSON.parse(savedCart);


        if (Array.isArray(parsed)) {

            return parsed;

        }


        if (
            parsed &&
            Array.isArray(parsed.items)
        ) {

            return parsed.items;

        }


        if (
            parsed &&
            Array.isArray(parsed.cart)
        ) {

            return parsed.cart;

        }


        return [];

    }

    catch (error) {

        console.error(
            "Checkout cart error:",
            error
        );

        return [];

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeCheckoutHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   PRODUCT IMAGE FALLBACKS
========================================================= */

const checkoutImageByName = {

    "Bose Home Speaker 500":
        "images/favorite-1.jpg",

    "Portable Newest Wireless Apple CarPlay":
        "images/favorite-2.jpg",

    "Miele Blizzard CX1 Cat & Dog Bagless Canister Vacuum":
        "images/favorite-3.jpg",

    "Dyson V12 Detect Slim Cordless Vacuum Cleaner":
        "images/favorite-4.jpg",

    "Portable SSD 4TB":
        "images/favorite-5.jpg",

    "Amazon Kindle E-Reader":
        "images/favorite-6.jpg",

    "SEIKO SRP J81 Men's Watch":
        "images/favorite-7.jpg"

};


/* =========================================================
   GET PRODUCT IMAGE
========================================================= */

function checkoutGetImage(item) {

    if (!item) {

        return "images/logo.png";

    }


    /*
     * First use image saved in cart.
     */

    if (item.image) {

        return item.image;

    }


    if (item.imgSrc) {

        return item.imgSrc;

    }


    if (item.img) {

        return item.img;

    }


    /*
     * Then try product name.
     */

    const name =
        item.name ||
        item.title ||
        "";


    if (
        checkoutImageByName[name]
    ) {

        return checkoutImageByName[name];

    }


    /*
     * Final fallback.
     */

    return "images/logo.png";

}


/* =========================================================
   GET PRODUCT NAME
========================================================= */

function checkoutGetName(item) {

    return (
        item.name ||
        item.title ||
        item.productName ||
        "Product"
    );

}


/* =========================================================
   GET PRODUCT PRICE
========================================================= */

function checkoutGetPrice(item) {

    let price =
        item.price ??
        item.productPrice ??
        item.unitPrice ??
        0;


    if (
        typeof price === "string"
    ) {

        price =
            price
                .replace(/[$,₹]/g, "")
                .trim();

    }


    return parseFloat(price) || 0;

}


/* =========================================================
   GET QUANTITY
========================================================= */

function checkoutGetQuantity(item) {

    let quantity =
        Number(
            item.quantity ??
            item.qty ??
            item.count ??
            1
        );


    if (
        !Number.isFinite(quantity) ||
        quantity < 1
    ) {

        quantity = 1;

    }


    return quantity;

}


/* =========================================================
   RENDER ORDER SUMMARY
========================================================= */

function renderCheckoutOrderSummary() {

    const container =
        document.getElementById(
            "checkoutProducts"
        );


    if (!container) {

        return 0;

    }


    const cart =
        checkoutGetCart();


    container.innerHTML = "";


    /*
     * EMPTY CART
     */

    if (
        cart.length === 0
    ) {

        container.innerHTML = `
            <div class="checkout-empty-cart">
                Your cart is empty.
            </div>
        `;


        updateCheckoutTotals(0);

        return 0;

    }


    let subtotal = 0;


    /*
     * CREATE EACH PRODUCT
     */

    cart.forEach(function (item) {

        const name =
            checkoutGetName(item);


        const price =
            checkoutGetPrice(item);


        const quantity =
            checkoutGetQuantity(item);


        const image =
            checkoutGetImage(item);


        const lineTotal =
            price * quantity;


        subtotal +=
            lineTotal;


        const row =
            document.createElement(
                "div"
            );


        row.className =
            "checkout-dynamic-item";


        row.innerHTML = `

            <div class="checkout-image-box">

                <img
                    src="${escapeCheckoutHTML(image)}"
                    alt="${escapeCheckoutHTML(name)}"
                    class="checkout-product-image"
                >

                <span class="checkout-quantity-badge">
                    ${quantity}
                </span>

            </div>


            <div class="item-details">

                <h4>
                    ${escapeCheckoutHTML(name)}
                </h4>

                <p class="item-price-unit">
                    ${checkoutFormatMoney(price)}
                </p>

            </div>


            <div class="item-total">

                ${checkoutFormatMoney(lineTotal)}

            </div>

        `;


        /*
         * Image fallback
         */

        const imageElement =
            row.querySelector(
                ".checkout-product-image"
            );


        if (imageElement) {

            imageElement.addEventListener(
                "error",
                function () {

                    if (
                        imageElement.dataset.fallback
                    ) {

                        return;

                    }


                    imageElement.dataset.fallback =
                        "true";


                    imageElement.src =
                        "images/logo.png";

                }
            );

        }


        container.appendChild(
            row
        );

    });


    updateCheckoutTotals(
        subtotal
    );


    return subtotal;

}


/* =========================================================
   UPDATE SUBTOTAL + TOTAL
========================================================= */

function updateCheckoutTotals(
    subtotal
) {

    const subtotalElement =
        document.getElementById(
            "checkoutSubtotal"
        );


    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            checkoutFormatMoney(
                subtotal
            );

    }


    if (totalElement) {

        totalElement.textContent =
            checkoutFormatMoney(
                subtotal
            );

    }

}


/* =========================================================
   ADDRESS FIELDS
========================================================= */

function getCheckoutAddressFields() {

    return {

        country:
            document.getElementById(
                "country"
            ),

        firstName:
            document.getElementById(
                "firstName"
            ),

        lastName:
            document.getElementById(
                "lastName"
            ),

        address:
            document.getElementById(
                "address"
            ),

        city:
            document.getElementById(
                "city"
            ),

        state:
            document.getElementById(
                "state"
            ),

        zip:
            document.getElementById(
                "zipCode"
            ),

        phone:
            document.getElementById(
                "phone"
            )

    };

}

function isShippingAddressComplete() {

    const fields =
        getCheckoutAddressFields();


    const requiredFields = [

        fields.country,

        fields.firstName,

        fields.lastName,

        fields.address,

        fields.city,

        fields.state,

        fields.zip

    ];


    return requiredFields.every(
        function (field) {

            return (
                field &&
                field.value.trim() !== ""
            );

        }
    );

}


/* =========================================================
   UPDATE SHIPPING WARNING
========================================================= */

function updateShippingWarning() {

    const warning =
        document.getElementById(
            "shipping-warning"
        );


    const shippingMessage =
        document.getElementById(
            "shipping-options-message"
        );


    const delivery =
        document.getElementById(
            "checkoutDelivery"
        );


    if (!warning) {

        return;

    }


    const addressComplete =
        isShippingAddressComplete();


    /*
     * FULL ADDRESS ENTERED
     */

    if (addressComplete) {

        warning.classList.remove(
            "hidden"
        );


        warning.style.display =
            "flex";


        if (shippingMessage) {

            shippingMessage.classList.add(
                "warning-active"
            );

        }


        if (delivery) {

            delivery.textContent =
                "No available delivery option";

        }

    }


    /*
     * ADDRESS NOT COMPLETE
     */

    else {

        warning.classList.add(
            "hidden"
        );


        warning.style.display =
            "none";


        if (shippingMessage) {

            shippingMessage.classList.remove(
                "warning-active"
            );

        }


        if (delivery) {

            delivery.textContent =
                "Enter address to calculate";

        }

    }

}


/* =========================================================
   ADDRESS LISTENERS
========================================================= */

function setupAddressListeners() {

    const fields =
        getCheckoutAddressFields();


    Object.values(fields)
        .forEach(
            function (field) {

                if (!field) {

                    return;

                }


                field.addEventListener(
                    "input",
                    function () {

                        updateShippingWarning();

                    }
                );


                field.addEventListener(
                    "change",
                    function () {

                        updateShippingWarning();

                    }
                );

            }
        );

}


/* =========================================================
   ADD SUITE
========================================================= */

function setupSuiteField() {

    const link =
        document.getElementById(
            "addSuiteLink"
        );


    const field =
        document.getElementById(
            "suiteField"
        );


    if (
        !link ||
        !field
    ) {

        return;

    }


    link.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            field.classList.remove(
                "hidden"
            );


            link.style.display =
                "none";


            const input =
                field.querySelector(
                    "input"
                );


            if (input) {

                input.focus();

            }

        }
    );

}


/* =========================================================
   PAYMENT METHOD
========================================================= */

function setupPaymentMethods() {

    const paymentOptions =
        document.querySelectorAll(
            ".payment-option"
        );


    const cardDetails =
        document.getElementById(
            "cardDetails"
        );


    const paymentMessage =
        document.getElementById(
            "paymentMessage"
        );


    paymentOptions.forEach(
        function (option) {

            const radio =
                option.querySelector(
                    "input[type='radio']"
                );


            if (!radio) {

                return;

            }


            radio.addEventListener(
                "change",
                function () {

                    /*
                     * Remove selected
                     * from every option.
                     */

                    paymentOptions.forEach(
                        function (item) {

                            item.classList.remove(
                                "selected"
                            );

                        }
                    );


                    /*
                     * Select current option.
                     */

                    option.classList.add(
                        "selected"
                    );


                    /*
                     * CREDIT CARD
                     */

                    if (
                        radio.value ===
                        "card"
                    ) {

                        if (cardDetails) {

                            cardDetails.classList.remove(
                                "hidden"
                            );

                        }


                        if (paymentMessage) {

                            paymentMessage.style.display =
                                "none";

                        }

                    }


                    /*
                     * PAYPAL
                     */

                    else {

                        if (cardDetails) {

                            cardDetails.classList.add(
                                "hidden"
                            );

                        }


                        if (paymentMessage) {

                            paymentMessage.style.display =
                                "block";

                        }

                    }

                }
            );

        }
    );

}


/* =========================================================
   ADD ORDER NOTE
========================================================= */

function setupOrderNote() {

    const checkbox =
        document.getElementById(
            "order-note"
        );


    const noteBox =
        document.getElementById(
            "order-note-box"
        );


    if (
        !checkbox ||
        !noteBox
    ) {

        return;

    }


    checkbox.addEventListener(
        "change",
        function () {

            if (
                checkbox.checked
            ) {

                noteBox.classList.remove(
                    "hidden"
                );


                const textarea =
                    document.getElementById(
                        "order-note-text"
                    );


                if (textarea) {

                    textarea.focus();

                }

            }

            else {

                noteBox.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/* =========================================================
   COUPON TOGGLE
========================================================= */

function toggleCoupon() {

    const content =
        document.getElementById(
            "couponContent"
        );


    const button =
        document.getElementById(
            "couponToggle"
        );


    const arrow =
        document.getElementById(
            "couponArrow"
        );


    if (!content) {

        console.error(
            "Coupon content element not found."
        );

        return;

    }


    /* ---------------------------------------------
       CHECK CURRENT STATE
    --------------------------------------------- */

    const isOpen =
        content.style.display === "block";


    /* ---------------------------------------------
       CLOSE COUPON
    --------------------------------------------- */

    if (isOpen) {

        content.style.setProperty(
            "display",
            "none",
            "important"
        );


        if (button) {

            button.classList.remove(
                "active"
            );

        }


        if (arrow) {

            arrow.style.transform =
                "rotate(0deg)";

        }


        return;

    }


    /* ---------------------------------------------
       OPEN COUPON
    --------------------------------------------- */

    content.style.setProperty(
        "display",
        "block",
        "important"
    );


    if (button) {

        button.classList.add(
            "active"
        );

    }


    if (arrow) {

        arrow.style.transform =
            "rotate(180deg)";

    }

}

/* =========================================================
   APPLY COUPON
========================================================= */

function applyCoupon() {

    const input =
        document.getElementById(
            "couponInput"
        );

    const errorBox =
        document.getElementById(
            "couponError"
        );

    const errorText =
        document.getElementById(
            "couponErrorText"
        );

    if (!input) {
        return;
    }

    const code =
        input.value.trim();

    /* Remove previous error */
    if (errorBox) {
        errorBox.classList.remove(
            "show"
        );
    }

    input.classList.remove(
        "coupon-invalid"
    );

    /* Empty coupon */
    if (!code) {

        return;
    }

    const validCoupons = [
        "SAVE10",
        "WEBSTORE10",
        "SAVE20",
        "WEBSTORE20"
    ];

    /* =====================================================
       INVALID COUPON
    ===================================================== */

    if (
        !validCoupons.includes(
            code.toUpperCase()
        )
    ) {

        input.classList.add(
            "coupon-invalid"
        );

        if (errorText) {

            errorText.textContent =
                `Coupon "${code}" cannot be applied because it does not exist.`;
        }

        if (errorBox) {

            errorBox.classList.add(
                "show"
            );
        }

        return;
    }

    /* =====================================================
       VALID COUPON
    ===================================================== */

    input.classList.remove(
        "coupon-invalid"
    );

    if (errorBox) {

        errorBox.classList.remove(
            "show"
        );
    }

    alert(
        `Coupon "${code}" applied successfully!`
    );
}

/* =========================================================
   CLEAR COUPON ERROR WHEN USER TYPES
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const input =
            document.getElementById(
                "couponInput"
            );

        const errorBox =
            document.getElementById(
                "couponError"
            );

        if (!input) {
            return;
        }

        input.addEventListener(
            "input",
            function () {

                input.classList.remove(
                    "coupon-invalid"
                );

                if (errorBox) {

                    errorBox.classList.remove(
                        "show"
                    );
                }

            }
        );

    }
);

/* =========================================================
   PLACE ORDER
========================================================= */

function setupPlaceOrder() {

    const button =
        document.getElementById(
            "placeOrderBtn"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function () {

            const cart =
                checkoutGetCart();


            if (
                cart.length === 0
            ) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            if (
                !isShippingAddressComplete()
            ) {

                alert(
                    "Please complete your shipping address before placing the order."
                );

                return;

            }


            const phone =
                document.getElementById(
                    "phone"
                );


            if (
                !phone ||
                phone.value.trim() === ""
            ) {

                alert(
                    "Please enter your phone number before placing the order."
                );

                return;

            }


            const selectedPayment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            if (
                !selectedPayment
            ) {

                alert(
                    "Please select a payment method."
                );

                return;

            }


            if (
                selectedPayment.value ===
                "card"
            ) {

                const cardName =
                    document.getElementById(
                        "cardholderName"
                    );

                const cardNumber =
                    document.getElementById(
                        "cardNumber"
                    );

                const expiry =
                    document.getElementById(
                        "expiryDate"
                    );

                const security =
                    document.getElementById(
                        "securityCode"
                    );


                if (
                    !cardName.value.trim() ||
                    !cardNumber.value.trim() ||
                    !expiry.value.trim() ||
                    !security.value.trim()
                ) {

                    alert(
                        "Please complete your card details."
                    );

                    return;

                }

            }


            alert(
                "Your order is ready to be placed."
            );

        }
    );

}


/* =========================================================
   SCROLL TO TOP
========================================================= */

function setupScrollTop() {

    const button =
        document.getElementById(
            "scrollToTop"
        );


    if (!button) {

        return;

    }


    window.addEventListener(
        "scroll",
        function () {

            if (
                window.scrollY > 300
            ) {

                button.style.display =
                    "flex";

            }

            else {

                button.style.display =
                    "none";

            }

        }
    );


    button.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* =========================================================
   REFRESH CHECKOUT
========================================================= */

function refreshCheckout() {

    renderCheckoutOrderSummary();

    updateShippingWarning();

}


/* =========================================================
   STORAGE LISTENER
========================================================= */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key ===
                CHECKOUT_CART_KEY ||
            event.key ===
                "webstoreCart"
        ) {

            refreshCheckout();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

function initializeCheckout() {

    console.log(
        "WebStore checkout loaded"
    );


    renderCheckoutOrderSummary();

    setupAddressListeners();

    setupSuiteField();

    setupPaymentMethods();

    setupOrderNote();

    setupPlaceOrder();

    setupScrollTop();

    updateShippingWarning();

}


/* =========================================================
   START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeCheckout
    );

}

else {

    initializeCheckout();

}