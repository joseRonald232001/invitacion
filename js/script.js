/* =========================================================
   ELEMENTOS
========================================================= */

const loader = document.getElementById("loader");

const loaderText = document.getElementById("loaderText");

const music = document.getElementById("music");

const musicButton = document.getElementById("musicButton");

const locationButton = document.getElementById("locationButton");

const floatingControls = document.getElementById("floatingControls");

const audioTriggerZone = document.getElementById("audioTriggerZone");

const screens = [...document.querySelectorAll(".screen")];

const progressDots = [...document.querySelectorAll(".progress-dot")];

const currentNumber = document.getElementById("currentNumber");

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

  "img/foto4.jpeg",
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
  loaderText.textContent = "Preparando nuestra historia...";

  /*
   * La portada primero.
   */

  await preloadImage(images[0]);

  loaderText.textContent = "Un momento...";

  /*
   * Después las demás.
   */

  await Promise.all(images.slice(1).map(preloadImage));

  loaderText.textContent = "Todo listo ✦";

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 500);
}

prepareInvitation();

/* =========================================================
   MÚSICA
========================================================= */

async function startMusic() {
  if (musicStarted) {
    return true;
  }

  try {
    music.volume = 0;

    /*
     * Esta llamada debe ocurrir
     * como consecuencia de una
     * interacción real del usuario.
     */

    await music.play();

    musicStarted = true;

    floatingControls.classList.add("visible");

    musicButton.classList.add("playing");

    /*
     * Fade in.
     */

    let volume = 0;

    const fade = setInterval(() => {
      volume += 0.025;

      music.volume = Math.min(volume, 0.35);

      if (volume >= 0.35) {
        clearInterval(fade);
      }
    }, 60);

    return true;
  } catch (error) {
    /*
     * El navegador puede
     * rechazar la reproducción.
     *
     * No marcamos musicStarted
     * para poder volver a intentarlo.
     */

    console.warn("El navegador bloqueó el audio:", error);

    return false;
  }
}

/* =========================================================
   ZONA INVISIBLE DE LA PRIMERA PANTALLA
========================================================= */

/*
 * Este es el punto importante.
 *
 * La zona ocupa:
 *
 * width: 100%
 * height: 50%
 *
 * pero es invisible.
 *
 * El usuario solamente ve:
 *
 * DESLIZA PARA COMENZAR
 *
 * al interactuar en esa zona
 * iniciamos la música.
 */

audioTriggerZone.addEventListener(
  "pointerdown",
  (event) => {
    startMusic();
  },
  {
    passive: true,
  },
);

/*
 * También detectamos el inicio
 * del movimiento del dedo.
 */

audioTriggerZone.addEventListener(
  "touchstart",
  () => {
    startMusic();
  },
  {
    passive: true,
  },
);

/*
 * Si comienza un swipe,
 * también intentamos iniciar
 * la música.
 */

audioTriggerZone.addEventListener(
  "touchmove",
  () => {
    startMusic();
  },
  {
    passive: true,
  },
);

/* =========================================================
   RESPALDO GLOBAL PARA EL PRIMER GESTO
========================================================= */

document.addEventListener(
  "pointerdown",
  () => {
    if (!musicStarted) {
      startMusic();
    }
  },
  {
    once: true,
    passive: true,
  },
);

/* =========================================================
   BOTÓN DE MÚSICA
========================================================= */

musicButton.addEventListener("click", async () => {
  if (music.paused) {
    const started = await startMusic();

    if (started) {
      music.volume = 0.35;
    }
  } else {
    music.pause();

    musicButton.classList.remove("playing");
  }
});

/* =========================================================
   BOTÓN DE UBICACIÓN
========================================================= */

locationButton.addEventListener("click", () => {
  /*
   * Pantalla 03:
   * Iglesia.
   */

  screens[2].scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

/* =========================================================
   OBSERVADOR DE PANTALLAS
========================================================= */

const screenObserver = new IntersectionObserver(
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
  screenObserver.observe(screen);
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
   PUNTOS DE NAVEGACIÓN
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
   PRECARGA PROGRESIVA
========================================================= */

const nextImages = {
  0: ["img/foto1.jpeg"],

  1: ["img/foto3.jpeg"],

  2: ["img/foto2.jpeg"],

  3: ["img/foto4.jpeg"],

  4: ["img/portada.jpeg"],

  5: ["img/portada.jpeg"],
};

function preloadNextImages(index) {
  const sources = nextImages[index];

  if (!sources) {
    return;
  }

  sources.forEach((source) => {
    const image = new Image();

    image.src = source;
  });
}

const preloadObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const index = screens.indexOf(entry.target);

      preloadNextImages(index);
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
