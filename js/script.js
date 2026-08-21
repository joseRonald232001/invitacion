const loader =
    document.getElementById("loader");

const music =
    document.getElementById("music");

const invitationCard =
    document.getElementById("invitationCard");

const screens =
    [...document.querySelectorAll(".screen")];

const currentScreen =
    document.getElementById("currentScreen");

const progressFill =
    document.getElementById("progressFill");


let musicStarted =
    false;

let activeScreen =
    0;


/* =====================================================
   LOADER
===================================================== */

window.addEventListener("load", () => {

    setTimeout(() => {

        loader.classList.add("hidden");

    }, 700);

});


/* =====================================================
   AUDIO
===================================================== */

async function startMusic() {

    if (musicStarted) {
        return;
    }

    try {

        music.currentTime = 0;

        music.volume = 0;

        await music.play();

        musicStarted = true;


        const fade =
            setInterval(() => {

                music.volume =
                    Math.min(
                        music.volume + 0.025,
                        0.35
                    );

                if (
                    music.volume >= 0.35
                ) {

                    clearInterval(fade);

                }

            }, 60);

    } catch (error) {

        console.log(
            "El navegador bloqueó el audio."
        );

    }

}


/* =====================================================
   ABRIR INVITACIÓN
===================================================== */

invitationCard.addEventListener(
    "click",
    async () => {

        await startMusic();


        const cover =
            document.querySelector(".cover");


        cover.classList.add(
            "opening"
        );


        setTimeout(() => {

            screens[1].scrollIntoView({
                behavior:
                    "smooth"
            });

        }, 900);

    }
);


/* =====================================================
   OBSERVER
===================================================== */

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    !entry.isIntersecting
                ) {
                    return;
                }


                const index =
                    screens.indexOf(
                        entry.target
                    );


                if (index === -1) {
                    return;
                }


                activeScreen =
                    index;


                entry.target.classList.add(
                    "active"
                );


                updateProgress(
                    index
                );

            });

        },
        {
            threshold:
                0.65
        }
    );


screens.forEach(screen => {

    observer.observe(screen);

});


/* =====================================================
   PROGRESO
===================================================== */

function updateProgress(index) {

    currentScreen.textContent =
        String(index + 1)
            .padStart(2, "0");


    const percentage =
        ((index + 1) / screens.length) *
        100;


    progressFill.style.height =
        `${percentage}%`;

}


/* =====================================================
   CONTADOR
===================================================== */

const weddingDate =
    new Date(
        "2026-09-05T13:30:00"
    );


function updateCountdown() {

    const now =
        new Date();

    const difference =
        weddingDate - now;


    if (
        difference <= 0
    ) {

        setCountdown(
            0,
            0,
            0,
            0
        );

        return;

    }


    const days =
        Math.floor(
            difference /
            86400000
        );


    const hours =
        Math.floor(
            (difference % 86400000) /
            3600000
        );


    const minutes =
        Math.floor(
            (difference % 3600000) /
            60000
        );


    const seconds =
        Math.floor(
            (difference % 60000) /
            1000
        );


    setCountdown(
        days,
        hours,
        minutes,
        seconds
    );

}


function setCountdown(
    days,
    hours,
    minutes,
    seconds
) {

    document.getElementById(
        "days"
    ).textContent =
        String(days).padStart(2, "0");


    document.getElementById(
        "hours"
    ).textContent =
        String(hours).padStart(2, "0");


    document.getElementById(
        "minutes"
    ).textContent =
        String(minutes).padStart(2, "0");


    document.getElementById(
        "seconds"
    ).textContent =
        String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);


/* =====================================================
   TECLADO
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "ArrowDown" &&
            event.key !== "ArrowUp"
        ) {
            return;
        }


        event.preventDefault();


        let next =
            activeScreen;


        if (
            event.key === "ArrowDown"
        ) {

            next++;

        } else {

            next--;

        }


        next =
            Math.max(
                0,
                Math.min(
                    screens.length - 1,
                    next
                )
            );


        screens[next].scrollIntoView({
            behavior:
                "smooth"
        });

    }
);


/* =====================================================
   PRELOAD
===================================================== */

[
    "img/portada.jpeg",
    "img/foto1.jpeg",
    "img/foto2.jpeg",
    "img/foto3.jpeg"
].forEach(src => {

    const image =
        new Image();

    image.src =
        src;

});


/* =====================================================
   INICIO
===================================================== */

screens[0].classList.add(
    "active"
);

updateProgress(0);