document.addEventListener("DOMContentLoaded", function () {


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const form =
        document.getElementById("employmentForm");

    const successMessage =
        document.getElementById("successMessage");

    const closeSuccess =
        document.getElementById("closeSuccess");



    /* =========================================================
       MONTHS
    ========================================================= */

    const months = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];



    /* =========================================================
       GET DATE SELECT
    ========================================================= */

    function getSelect(id) {

        return document.getElementById(id);

    }



    /* =========================================================
       POPULATE MONTHS
    ========================================================= */

    function populateMonths(id) {

        const select =
            getSelect(id);


        if (!select) {
            return;
        }


        months.forEach(
            function (month, index) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    index + 1;


                option.textContent =
                    month;


                select.appendChild(
                    option
                );

            }
        );

    }



    populateMonths("birthMonth");

    populateMonths("startMonth");

    populateMonths("employmentMonth");



    /* =========================================================
       POPULATE DAYS
    ========================================================= */

    function populateDays(id) {

        const select =
            getSelect(id);


        if (!select) {
            return;
        }


        for (
            let day = 1;
            day <= 31;
            day++
        ) {

            const option =
                document.createElement(
                    "option"
                );


            option.value = day;

            option.textContent = day;


            select.appendChild(
                option
            );

        }

    }



    populateDays("birthDay");

    populateDays("startDay");

    populateDays("employmentDay");



    /* =========================================================
       POPULATE YEARS
    ========================================================= */

    function populateYears(
        id,
        startYear,
        endYear
    ) {

        const select =
            getSelect(id);


        if (!select) {
            return;
        }


        for (
            let year = startYear;
            year >= endYear;
            year--
        ) {

            const option =
                document.createElement(
                    "option"
                );


            option.value = year;

            option.textContent = year;


            select.appendChild(
                option
            );

        }

    }



    const currentYear =
        new Date().getFullYear();


    populateYears(
        "birthYear",
        currentYear,
        currentYear - 100
    );


    populateYears(
        "startYear",
        currentYear + 5,
        currentYear
    );


    populateYears(
        "employmentYear",
        currentYear + 5,
        currentYear - 50
    );



    /* =========================================================
       FORM VALIDATION
    ========================================================= */

    function clearErrors() {

        form
            .querySelectorAll(".input-error")
            .forEach(
                function (element) {

                    element.classList.remove(
                        "input-error"
                    );

                }
            );

    }



    function validateForm() {

        clearErrors();


        let valid = true;


        const requiredFields =
            form.querySelectorAll(
                "input[required], select[required]"
            );


        requiredFields.forEach(
            function (field) {

                /*
                 * Radio groups are handled separately.
                 */

                if (
                    field.type === "radio"
                ) {

                    return;

                }


                if (
                    !field.value.trim()
                ) {

                    field.classList.add(
                        "input-error"
                    );

                    valid = false;

                }

            }
        );



        /* =====================================================
           REQUIRED RADIO GROUPS
        ================================================== */

        const requiredRadioGroups = [

            "citizen",

            "crime"

        ];


        requiredRadioGroups.forEach(
            function (groupName) {

                const checked =
                    form.querySelector(
                        `input[name="${groupName}"]:checked`
                    );


                if (!checked) {

                    const radios =
                        form.querySelectorAll(
                            `input[name="${groupName}"]`
                        );


                    radios.forEach(
                        function (radio) {

                            radio.parentElement
                                .classList.add(
                                    "input-error"
                                );

                        }
                    );


                    valid = false;

                }

            }
        );



        /* =====================================================
           EMAIL
        ===================================================== */

        const email =
            form.querySelector(
                'input[name="email"]'
            );


        if (
            email.value.trim() &&
            !email.checkValidity()
        ) {

            email.classList.add(
                "input-error"
            );

            valid = false;

        }



        return valid;

    }



    /* =========================================================
       FORM SUBMIT
    ========================================================= */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (!validateForm()) {

                const firstError =
                    form.querySelector(
                        ".input-error"
                    );


                if (firstError) {

                    firstError.scrollIntoView(
                        {
                            behavior: "smooth",

                            block: "center"
                        }
                    );

                    firstError.focus();

                }


                alert(
                    "Please complete all required fields before submitting the application."
                );


                return;

            }



            successMessage.classList.add(
                "show"
            );


            window.scrollTo(
                {
                    top: 0,

                    behavior: "smooth"
                }
            );

        }
    );



    /* =========================================================
       CLOSE SUCCESS
    ========================================================= */

    closeSuccess.addEventListener(
        "click",
        function () {

            successMessage.classList.remove(
                "show"
            );

        }
    );



    /* =========================================================
       REMOVE ERROR WHEN USER TYPES
    ========================================================= */

    form.addEventListener(
        "input",
        function (event) {

            if (
                event.target.classList.contains(
                    "input-error"
                )
            ) {

                event.target.classList.remove(
                    "input-error"
                );

            }

        }
    );



    /* =========================================================
       PHONE NUMBER - NUMBERS ONLY
    ========================================================= */

    const phoneInputs =
        form.querySelectorAll(
            'input[type="tel"], input[name*="Phone"], input[name*="phone"], input[name*="AreaCode"], input[name*="areaCode"]'
        );


    phoneInputs.forEach(
        function (input) {

            input.addEventListener(
                "input",
                function () {

                    input.value =
                        input.value.replace(
                            /[^0-9+\-\s()]/g,
                            ""
                        );

                }
            );

        }
    );



    /* =========================================================
       YEAR / NUMBER INPUT
    ========================================================= */

    const numberInputs =
        form.querySelectorAll(
            'input[type="number"]'
        );


    numberInputs.forEach(
        function (input) {

            input.addEventListener(
                "input",
                function () {

                    if (
                        Number(input.value) < 0
                    ) {

                        input.value = 0;

                    }

                }
            );

        }
    );

});