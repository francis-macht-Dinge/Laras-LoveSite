
/* =========================================
   SUPABASE CONFIGURATION
========================================= */

const SUPABASE_URL =
    "https://qebblyzjqtpdqigadzlu.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_EjUfkDQ4967_HS_KiW69Sw_-zQB3sVf";

const { createClient } = supabase;

const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================
   SCROLL REVEAL
========================================= */

const animatedElements = document.querySelectorAll(
    ".section-heading, .form-group, .choice-card, .large-question, .final-content"
);

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("reveal");
                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.12
    }
);

animatedElements.forEach((element) => {
    observer.observe(element);
});


/* =========================================
   PHOTO PREVIEW
========================================= */

const photoInput =
    document.getElementById("photo");

const photoPreview =
    document.getElementById("photoPreview");


photoInput?.addEventListener(
    "change",
    () => {

        photoPreview.innerHTML = "";

        const file =
            photoInput.files[0];

        if (!file) {
            return;
        }


        /* Dateigröße prüfen */

        const maxSize =
            5 * 1024 * 1024;

        if (file.size > maxSize) {

            alert(
                "Das Foto darf maximal 5 MB groß sein."
            );

            photoInput.value = "";

            return;
        }


        /* Dateityp prüfen */

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            alert(
                "Bitte lade ein JPG-, PNG- oder WebP-Bild hoch."
            );

            photoInput.value = "";

            return;
        }


        /* Vorschau anzeigen */

        const image =
            document.createElement("img");

        image.src =
            URL.createObjectURL(file);

        image.alt =
            "Vorschau deines Fotos";

        image.className =
            "photo-preview-image";

        photoPreview.appendChild(image);

    }
);


/* =========================================
   COLLECT ANSWERS
========================================= */

function collectAnswers() {

    return {

        name:
            document.getElementById("name").value.trim(),

        age:
            getNumberValue("age"),

        location:
            document.getElementById("location").value.trim(),

        happiness:
            document.getElementById("happiness").value.trim(),

        sunday:
            document.getElementById("sunday").value.trim(),

        passions:
            document.getElementById("passions").value.trim(),

        morning:
            document.getElementById("morning").value,

        food:
            document.getElementById("food").value.trim(),

        music:
            document.getElementById("music").value.trim(),

        travel:
            document.getElementById("travel").value.trim(),

        guilty_pleasure:
            document.getElementById("guiltyPleasure").value.trim(),

        relationship:
            document.getElementById("relationship").value.trim(),

        communication:
            document.getElementById("communication").value.trim(),

        values:
            document.getElementById("values").value.trim(),

        future:
            document.getElementById("future").value.trim(),

        additional_message:
            document.getElementById("additionalMessage").value.trim(),

        phone:
            document.getElementById("phone").value.trim(),

        instagram:
            document.getElementById("instagram").value.trim(),

        image_path:
            null
    };
}


/* =========================================
   NUMBER HELPER
========================================= */

function getNumberValue(id) {

    const value =
        document.getElementById(id).value.trim();

    if (!value) {
        return null;
    }

    const number =
        Number(value);

    return Number.isNaN(number)
        ? null
        : number;
}


/* =========================================
   VALIDATION
========================================= */

function validateAnswers(answers) {

    if (!answers.name) {

        const element =
            document.getElementById("name");

        element.focus();

        alert(
            "Bitte verrate mir noch deinen Namen."
        );

        return false;
    }


    if (
        answers.age !== null &&
        (answers.age < 18 || answers.age > 100)
    ) {

        const element =
            document.getElementById("age");

        element.focus();

        alert(
            "Bitte gib ein gültiges Alter ein."
        );

        return false;
    }


    return true;
}


/* =========================================
   UPLOAD PHOTO
========================================= */

async function uploadPhoto(file) {

    if (!file) {
        return null;
    }


    const fileExtension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const uniqueName =
        `${crypto.randomUUID()}.${fileExtension}`;


    const filePath =
        `responses/${uniqueName}`;


    const { error } =
        await supabaseClient
            .storage
            .from("dating-photos")
            .upload(
                filePath,
                file,
                {
                    contentType: file.type,
                    upsert: false
                }
            );


    if (error) {

        console.error(
            "Photo upload error:",
            error
        );

        throw error;
    }


    return filePath;
}


/* =========================================
   SUBMIT TO SUPABASE
========================================= */

const submitButton =
    document.getElementById("submitButton");

const successMessage =
    document.getElementById("successMessage");


submitButton.addEventListener(
    "click",
    async () => {

        /*
         * Antworten einsammeln
         */

        const answers =
            collectAnswers();


        /*
         * Eingaben überprüfen
         */

        if (!validateAnswers(answers)) {
            return;
        }


        /*
         * Button deaktivieren
         */

        submitButton.disabled = true;

        submitButton.innerHTML =
            "Sending...";


        try {

            /*
             * Foto hochladen
             */

            const photoFile =
                photoInput?.files?.[0];

            if (photoFile) {

                answers.image_path =
                    await uploadPhoto(
                        photoFile
                    );
            }


            /*
             * Daten an Supabase senden
             */

            const { error } =
                await supabaseClient
                    .from("dating_responses")
                    .insert([answers]);


            /*
             * Supabase-Fehler behandeln
             */

            if (error) {

                console.error(
                    "Supabase error:",
                    error
                );

                throw error;
            }


            /*
             * Erfolgreich gespeichert
             */

            console.log(
                "Antwort erfolgreich gespeichert."
            );


            submitButton.innerHTML =
                "Sent ♡";


            successMessage.classList.add(
                "visible"
            );


            /*
             * Zum Erfolgshinweis scrollen
             */

            successMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


        } catch (error) {

            console.error(
                "Fehler beim Speichern:",
                error
            );


            submitButton.disabled = false;

            submitButton.innerHTML =
                "Try again →";


            alert(
                "Leider ist etwas schiefgelaufen. " +
                "Bitte versuche es noch einmal."
            );
        }

    }
);


/* =========================================
   SMOOTH SCROLL
========================================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth"
                });

            }
        );

    });
