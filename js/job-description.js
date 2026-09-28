document.addEventListener("DOMContentLoaded", function () {


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const docPage =
        document.getElementById("docPage");

    const docContainer =
        document.getElementById("docContainer");

    const thumbnailPage =
        document.getElementById("thumbnailPage");

    const sidebar =
        document.getElementById("pdfSidebar");

    const toggleSidebarBtn =
        document.getElementById("toggleSidebarBtn");

    const zoomInBtn =
        document.getElementById("zoomInBtn");

    const zoomOutBtn =
        document.getElementById("zoomOutBtn");

    const zoomVal =
        document.getElementById("zoomVal");

    const fitPageBtn =
        document.getElementById("fitPageBtn");

    const rotateBtn =
        document.getElementById("rotateBtn");

    const downloadBtn =
        document.getElementById("downloadBtn");

    const printBtn =
        document.getElementById("printBtn");

    const moreMenuBtn =
        document.getElementById("moreMenuBtn");

    const moreDropdown =
        document.getElementById("moreDropdown");

    const saveDriveBtn =
        document.getElementById("saveDriveBtn");

    const downloadTextBtn =
        document.getElementById("downloadTextBtn");

    const aboutDocumentBtn =
        document.getElementById("aboutDocumentBtn");



    /* =========================================================
       SIDEBAR
    ========================================================= */

    toggleSidebarBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle("collapsed");

        }
    );



    /* =========================================================
       CREATE DOCUMENT THUMBNAIL
    ========================================================= */

    function createThumbnail() {

        if (!thumbnailPage || !docPage) {
            return;
        }


        /*
         * Clone the complete document.
         */

        const clone =
            docPage.cloneNode(true);


        /*
         * Remove IDs from cloned content.
         */

        clone.removeAttribute("id");



        clone.querySelectorAll("[id]")
            .forEach(function (element) {

                element.removeAttribute("id");

            });


        /*
         * Put cloned document inside thumbnail.
         */

        thumbnailPage.innerHTML = "";

        thumbnailPage.appendChild(clone);

    }


    createThumbnail();



    /* =========================================================
       ZOOM
    ========================================================= */

    let currentZoom = 100;


    function updateZoom() {

        const zoom =
            currentZoom / 100;


        docPage.style.transform =
            `scale(${zoom})`;


        zoomVal.textContent =
            `${currentZoom}%`;

        const baseWidth = 850;

        const baseHeight = 1100;


        docPage.style.marginBottom =
            `${70 + (baseHeight * (zoom - 1))}px`;


        docPage.style.marginRight =
            `${Math.max(
                0,
                (baseWidth * (zoom - 1)) / 2
            )}px`;

    }



    zoomInBtn.addEventListener(
        "click",
        function () {

            if (currentZoom < 200) {

                currentZoom += 10;

                updateZoom();

            }

        }
    );



    zoomOutBtn.addEventListener(
        "click",
        function () {

            if (currentZoom > 50) {

                currentZoom -= 10;

                updateZoom();

            }

        }
    );



    /* =========================================================
       FIT TO PAGE
    ========================================================= */

    fitPageBtn.addEventListener(
        "click",
        function () {

            const containerWidth =
                docContainer.clientWidth;

            const containerHeight =
                docContainer.clientHeight;


            const horizontalPadding = 100;

            const verticalPadding = 80;


            const availableWidth =
                containerWidth -
                horizontalPadding;


            const availableHeight =
                containerHeight -
                verticalPadding;


            const widthScale =
                availableWidth / 850;


            const heightScale =
                availableHeight / 1100;


            let scale =
                Math.min(
                    widthScale,
                    heightScale
                );


            /*
             * Keep scale within sensible limits.
             */

            scale =
                Math.max(
                    0.5,
                    Math.min(scale, 1.5)
                );


            currentZoom =
                Math.round(scale * 100);


            updateZoom();

        }
    );



    /* =========================================================
       ROTATE
    ========================================================= */

    let rotated = false;


    rotateBtn.addEventListener(
        "click",
        function () {

            rotated = !rotated;


            if (rotated) {

                docPage.classList.add(
                    "rotated"
                );

            } else {

                docPage.classList.remove(
                    "rotated"
                );

            }

        }
    );



    /* =========================================================
       SAVE / DOWNLOAD PDF
    ========================================================= */

    downloadBtn.addEventListener(
        "click",
        async function () {

            await saveAsPDF();

        }
    );



    async function saveAsPDF() {

        try {


            /*
             * Show temporary message.
             */

            const oldHTML =
                downloadBtn.innerHTML;


            downloadBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i>';


            downloadBtn.disabled = true;



            const oldTransform =
                docPage.style.transform;

            const oldMarginBottom =
                docPage.style.marginBottom;

            const oldMarginRight =
                docPage.style.marginRight;


            docPage.style.transform =
                "none";

            docPage.style.marginBottom =
                "0";

            docPage.style.marginRight =
                "0";



            /*
             * Capture document.
             */

            const canvas =
                await html2canvas(
                    docPage,
                    {
                        scale: 2,

                        useCORS: true,

                        backgroundColor: "#ffffff",

                        logging: false,

                        imageTimeout: 15000
                    }
                );



            /*
             * Restore viewer.
             */

            docPage.style.transform =
                oldTransform;

            docPage.style.marginBottom =
                oldMarginBottom;

            docPage.style.marginRight =
                oldMarginRight;



            const {
                jsPDF
            } = window.jspdf;


            const pdf =
                new jsPDF(
                    {
                        orientation: "portrait",

                        unit: "mm",

                        format: "letter",

                        compress: true
                    }
                );



            const pageWidth =
                pdf.internal.pageSize.getWidth();


            const pageHeight =
                pdf.internal.pageSize.getHeight();


            const imageWidth =
                pageWidth;


            const imageHeight =
                (
                    canvas.height *
                    imageWidth
                ) /
                canvas.width;



            let remainingHeight =
                imageHeight;


            let position = 0;


            pdf.addImage(
                canvas.toDataURL("image/jpeg", 0.95),

                "JPEG",

                0,

                position,

                imageWidth,

                imageHeight
            );


            remainingHeight -=
                pageHeight;


            while (
                remainingHeight > 0
            ) {

                position =
                    position -
                    pageHeight;


                pdf.addPage();


                pdf.addImage(
                    canvas.toDataURL(
                        "image/jpeg",
                        0.95
                    ),

                    "JPEG",

                    0,

                    position,

                    imageWidth,

                    imageHeight
                );


                remainingHeight -=
                    pageHeight;

            }



            /*
             * Download.
             */

            pdf.save(
                "WebStore-Inc-Shipping-Coordinator-Job-Offer.pdf"
            );



            /*
             * Restore button.
             */

            downloadBtn.innerHTML =
                oldHTML;

            downloadBtn.disabled = false;


        } catch (error) {

            console.error(
                "PDF generation error:",
                error
            );


            alert(
                "Unable to save the PDF. Please try again."
            );


            downloadBtn.innerHTML =
                '<i class="fa-solid fa-download"></i>';

            downloadBtn.disabled = false;

        }

    }



    /* =========================================================
       PRINT
    ========================================================= */

    printBtn.addEventListener(
        "click",
        function () {

            window.print();

        }
    );



    /* =========================================================
       MORE MENU
    ========================================================= */

    moreMenuBtn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            moreDropdown.classList.toggle(
                "show"
            );

        }
    );



    document.addEventListener(
        "click",
        function () {

            moreDropdown.classList.remove(
                "show"
            );

        }
    );



    /* =========================================================
       SAVE TO DRIVE
    ========================================================= */

    saveDriveBtn.addEventListener(
        "click",
        function () {

            alert(
                "Google Drive integration can be connected later. The PDF can currently be saved directly to your computer using the Download button."
            );

        }
    );



    /* =========================================================
       DOWNLOAD TEXT
    ========================================================= */

    downloadTextBtn.addEventListener(
        "click",
        function () {

            const text =
                docPage.innerText;


            const blob =
                new Blob(
                    [text],
                    {
                        type: "text/plain"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;

            link.download =
                "WebStore-Inc-Job-Offer.txt";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );

        }
    );



    /* =========================================================
       DOCUMENT INFORMATION
    ========================================================= */

    aboutDocumentBtn.addEventListener(
        "click",
        function () {

            alert(
                "WebStore Inc.\n\n" +
                "Document: Job Offer - Shipping Coordinator\n" +
                "Company: WebStore Inc.\n" +
                "Email: franklyn@lpteam.online\n" +
                "Phone: +1 302 302 2233\n" +
                "Address: 13 Marlin Ct, New Castle, DE 19720, USA"
            );

        }
    );



    /* =========================================================
       THUMBNAIL CLICK
    ========================================================= */

    document
        .getElementById("documentThumbnail")
        .addEventListener(
            "click",
            function () {

                docContainer.scrollTo(
                    {
                        top: 0,

                        behavior: "smooth"
                    }
                );

            }
        );



    /* =========================================================
       KEYBOARD SHORTCUTS
    ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {


            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "p"
            ) {

                event.preventDefault();

                window.print();

            }


            /*
             * Ctrl + S
             */

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "s"
            ) {

                event.preventDefault();

                saveAsPDF();

            }


            /*
             * Escape
             */

            if (
                event.key === "Escape"
            ) {

                moreDropdown.classList.remove(
                    "show"
                );

            }

        }
    );



    /* =========================================================
       RECREATE THUMBNAIL AFTER IMAGES LOAD
    ========================================================= */

    window.addEventListener(
        "load",
        function () {

            createThumbnail();

        }
    );

});