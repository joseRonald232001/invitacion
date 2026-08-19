/* =========================================================
   ELEMENTOS
========================================================= */

const loader = document.getElementById("loader");

const loaderText = document.getElementById("loaderText");

const music = document.getElementById("music");

const musicButton = document.getElementById("musicButton");

const locationButton = document.getElementById("locationButton");

const screens = [...document.querySelectorAll(".screen")];

const progressDots = [...document.querySelectorAll(".progress-dot")];

const currentNumber = document.getElementById("currentNumber");

/* =========================================================
   ESTADO
========================================================= */

let currentScreen = 0;

let musicStarted = false;

/* =========================================================
   IMÁGENES IMPORTANTES
========================================================= */

const imagesToPreload = [
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
  try {
    loaderText.textContent = "Preparando nuestra historia...";

    /*
     * Primero aseguramos
     * la imagen principal.
     */

    await preloadImage(imagesToPreload[0]);

    loaderText.textContent = "Casi estamos listos...";

    /*
     * Cargamos las demás
     * imágenes.
     */

    await Promise.all(imagesToPreload.slice(1).map(preloadImage));

    loaderText.textContent = "Listo ✦";
  } catch (error) {
    console.warn("Error precargando imágenes:", error);
  }

  /*
   * Damos un pequeño tiempo
   * para que la entrada
   * no sea brusca.
   */

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 500);
}

prepareInvitation();

/* =========================================================
   MÚSICA
========================================================= */

function startMusic() {
  /*
   * Evitamos múltiples
   * llamadas.
   */

  if (musicStarted) {
    return;
  }

  /*
   * Importante:
   * marcamos que ya intentamos
   * iniciar la música.
   */

  musicStarted = true;

  music.volume = 0;

  /*
   * play() debe ejecutarse
   * dentro de una interacción
   * del usuario.
   */

  const playPromise = music.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
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
      })
      .catch(() => {
        /*
         * Si el navegador
         * bloquea la reproducción,
         * permitimos que otro
         * gesto vuelva a intentarlo.
         */

        musicStarted = false;
      });
  }
}

/* =========================================================
   ACTIVAR AUDIO CON EL PRIMER GESTO
========================================================= */

/*
 * pointerdown funciona para:
 *
 * - Android
 * - iPhone
 * - mouse
 * - tablet
 * - stylus
 */

document.addEventListener("pointerdown", startMusic, {
  once: true,
  passive: true,
});

/*
 * Respaldo para touch.
 */

document.addEventListener("touchmove", startMusic, {
  once: true,
  passive: true,
});

/*
 * Respaldo para rueda.
 */

document.addEventListener("wheel", startMusic, {
  once: true,
  passive: true,
});

/* =========================================================
   BOTÓN MÚSICA
========================================================= */

musicButton.addEventListener("click", () => {
  if (music.paused) {
    musicStarted = true;

    music.volume = 0.35;

    music
      .play()
      .then(() => {
        musicButton.classList.add("playing");
      })
      .catch(() => {
        /*
         * No hacemos nada.
         * El navegador puede
         * bloquearlo si no
         * considera válida
         * la interacción.
         */
      });
  } else {
    music.pause();

    musicButton.classList.remove("playing");
  }
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

  /*
   * Número
   */

  currentNumber.textContent = String(index + 1).padStart(2, "0");

  /*
   * Puntos
   */

  progressDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
  });

  /*
   * Solo una pantalla
   * queda activa.
   */

  screens.forEach((screen, screenIndex) => {
    screen.classList.toggle("active", screenIndex === index);
  });
}

/* =========================================================
   NAVEGACIÓN DE LOS PUNTOS
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
   BOTÓN UBICACIÓN
========================================================= */

locationButton.addEventListener("click", () => {
  /*
   * La iglesia es la
   * pantalla 03.
   */

  screens[2].scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

/* =========================================================
   PRECARGA PROGRESIVA
========================================================= */

const progressiveImages = {
  0: ["img/foto1.jpeg"],

  1: ["img/foto3.jpeg"],

  2: ["img/foto2.jpeg"],

  3: ["img/foto4.jpeg"],

  4: ["img/portada.jpeg"],
};

function preloadNext(index) {
  const images = progressiveImages[index];

  if (!images) {
    return;
  }

  images.forEach((src) => {
    const image = new Image();

    image.src = src;
  });
}

const progressiveObserver = new IntersectionObserver(
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
  progressiveObserver.observe(screen);
});

/* =========================================================
   SOPORTE PARA TECLADO
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

  /*
   * Una pulsación también
   * cuenta como interacción.
   */

  startMusic();
});

/* =========================================================
   INICIO
========================================================= */

activateScreen(0);
