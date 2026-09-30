/* =========================================
   SUPABASE CONFIGURATION
========================================= */

const SUPABASE_URL = "https://qebblyzjqtpdqigadzlu.supabase.co";
const SUPABASE_KEY = "sb_publishable_EjUfkDQ4967_HS_KiW69Sw_-zQB3sVf";

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
            document.getElementById("additionalMessage").value.trim()
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

    const number = Number(value);

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