/* =========================================================
   ELEMENTOS
========================================================= */

const loader = document.getElementById("loader");

const loaderText = document.getElementById("loaderText");

const music = document.getElementById("music");

const audioZone = document.getElementById("audioZone");

const screens = [...document.querySelectorAll(".screen")];

const progressDots = [...document.querySelectorAll(".progress-dots button")];

const currentNumber = document.getElementById("currentNumber");

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const MUSIC_START_TIME = 17;

const MUSIC_VOLUME = 0.35;

/* =========================================================
   ESTADO
========================================================= */

let currentScreen = 0;

let musicStarted = false;

/* =========================================================
   IMÁGENES
========================================================= */

const images = [
  "img/portada.jpeg",
  "img/foto1.jpeg",
  "img/foto2.jpeg",
  "img/foto3.jpeg",
];

/* =========================================================
   PRELOAD
========================================================= */

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = resolve;

    image.onerror = resolve;

    image.src = src;
  });
}

async function prepareInvitation() {
  try {
    loaderText.textContent = "Preparando nuestra historia...";

    await preloadImage(images[0]);

    loaderText.textContent = "Preparando nuestros recuerdos...";

    await Promise.all(images.slice(1).map(preloadImage));

    loaderText.textContent = "Todo listo ✦";

    setTimeout(() => {
      loader.classList.add("hidden");
    }, 500);
  } catch (error) {
    loader.classList.add("hidden");
  }
}

prepareInvitation();

/* =========================================================
   MÚSICA
========================================================= */

async function startMusic() {
  if (musicStarted) {
    return;
  }

  try {
    /*
     * El audio empieza exactamente
     * desde el segundo 17.
     */

    music.currentTime = MUSIC_START_TIME;

    music.volume = 0;

    /*
     * Como esta función se ejecuta
     * después de una interacción
     * del usuario, el navegador
     * permite reproducir el audio.
     */

    await music.play();

    musicStarted = true;

    /*
     * Fade in
     */

    let volume = 0;

    const fade = setInterval(() => {
      volume += 0.025;

      music.volume = Math.min(volume, MUSIC_VOLUME);

      if (volume >= MUSIC_VOLUME) {
        clearInterval(fade);
      }
    }, 60);
  } catch (error) {
    console.warn("El navegador bloqueó el audio.");
  }
}

/* =========================================================
   PRIMER GESTO
========================================================= */

/*
 * La zona ocupa:
 *
 * 100% WIDTH
 * 50% HEIGHT
 *
 * Es invisible.
 */

audioZone.addEventListener(
  "pointerdown",
  () => {
    startMusic();
  },
  {
    passive: true,
  },
);

/*
 * Especialmente útil
 * en dispositivos táctiles.
 */

audioZone.addEventListener(
  "touchstart",
  () => {
    startMusic();
  },
  {
    passive: true,
  },
);

/*
 * Si el usuario comienza
 * directamente deslizando.
 */

audioZone.addEventListener(
  "touchmove",
  () => {
    startMusic();
  },
  {
    passive: true,
  },
);

/* =========================================================
   RESPALDO PARA PRIMERA INTERACCIÓN
========================================================= */

document.addEventListener(
  "pointerdown",
  () => {
    startMusic();
  },
  {
    once: true,
    passive: true,
  },
);

/* =========================================================
   OBSERVER
========================================================= */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const index = screens.indexOf(entry.target);

      if (index === -1) {
        return;
      }

      activateScreen(index);
    });
  },
  {
    threshold: 0.65,
  },
);

screens.forEach((screen) => {
  observer.observe(screen);
});

/* =========================================================
   ACTIVAR PANTALLA
========================================================= */

function activateScreen(index) {
  currentScreen = index;

  currentNumber.textContent = String(index + 1).padStart(2, "0");

  progressDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
  });

  screens.forEach((screen, screenIndex) => {
    screen.classList.toggle("active", screenIndex === index);
  });
}

/* =========================================================
   NAVEGACIÓN POR PUNTOS
========================================================= */

progressDots.forEach((dot, index) => {
  dot.addEventListener("click", (event) => {
    event.stopPropagation();

    screens[index].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

/* =========================================================
   PRECARGA DE SIGUIENTES IMÁGENES
========================================================= */

const nextImages = {
  0: ["img/foto1.jpeg"],

  1: ["img/foto3.jpeg"],

  2: ["img/foto2.jpeg"],

  3: ["img/foto4.jpeg"],
};

function preloadNext(index) {
  if (!nextImages[index]) {
    return;
  }

  nextImages[index].forEach((src) => {
    const image = new Image();

    image.src = src;
  });
}

const preloadObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const index = screens.indexOf(entry.target);

      preloadNext(index);
    });
  },
  {
    threshold: 0.2,
  },
);

screens.forEach((screen) => {
  preloadObserver.observe(screen);
});

/* =========================================================
   TECLADO
========================================================= */

document.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
    return;
  }

  event.preventDefault();

  let next = currentScreen;

  if (event.key === "ArrowDown") {
    next++;
  } else {
    next--;
  }

  next = Math.max(0, Math.min(screens.length - 1, next));

  screens[next].scrollIntoView({
    behavior: "smooth",
  });

  startMusic();
});

/* =========================================================
   INICIO
========================================================= */

activateScreen(0);
