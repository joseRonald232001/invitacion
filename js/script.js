/* ==================================================
   ELEMENTOS
================================================== */

const opening = document.getElementById("opening");

const openInvitation = document.getElementById("openInvitation");

const music = document.getElementById("music");

const musicButton = document.getElementById("musicButton");

const locationButton = document.getElementById("locationButton");

/* ==================================================
   APERTURA
================================================== */

openInvitation.addEventListener("click", () => {
  opening.classList.add("hide");

  document.body.classList.remove("locked");

  music.volume = 0.35;

  music
    .play()
    .then(() => {
      musicButton.classList.add("playing");
    })
    .catch(() => {});
});

/* ==================================================
   MÚSICA
================================================== */

musicButton.addEventListener("click", () => {
  if (music.paused) {
    music.play();

    musicButton.classList.add("playing");
  } else {
    music.pause();

    musicButton.classList.remove("playing");
  }
});

/* ==================================================
   UBICACIÓN
================================================== */

locationButton.addEventListener("click", () => {
  const location = document.getElementById("ubicacion");

  location.scrollIntoView({
    behavior: "smooth",
  });
});

/* ==================================================
   REVEAL
================================================== */

const revealElements = document.querySelectorAll(
  ".reveal-left, .reveal-right, .reveal",
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  },
);

revealElements.forEach((element) => {
  observer.observe(element);
});

/* ==================================================
   PARTÍCULAS
================================================== */

function createParticles(selector, amount) {
  const container = document.querySelector(selector);

  if (!container) {
    return;
  }

  for (let i = 0; i < amount; i++) {
    const particle = document.createElement("span");

    particle.className = "particle";

    particle.style.left = `${Math.random() * 100}%`;

    particle.style.top = `${Math.random() * 100}%`;

    particle.style.setProperty("--duration", `${4 + Math.random() * 6}s`);

    particle.style.setProperty("--delay", `${Math.random() * 5}s`);

    container.appendChild(particle);
  }
}

createParticles(".opening-particles", 25);

createParticles(".hero-particles", 30);

createParticles(".quote-particles", 25);

createParticles(".date-particles", 20);

createParticles(".love-particles", 30);

/* ==================================================
   PARALLAX
================================================== */

const photos = document.querySelectorAll(".story-photo img");

function parallax() {
  photos.forEach((image) => {
    const parent = image.closest(".story-photo");

    const rect = parent.getBoundingClientRect();

    const screen = window.innerHeight;

    const center = rect.top + rect.height / 2;

    const movement = (center - screen / 2) * 0.06;

    if (rect.bottom > 0 && rect.top < screen) {
      image.style.transform = `translateY(${movement}px) scale(1.06)`;
    }
  });
}

window.addEventListener("scroll", parallax, {
  passive: true,
});

/* ==================================================
   HERO PARALLAX
================================================== */

const heroBackground = document.querySelector(".hero-background");

window.addEventListener(
  "scroll",
  () => {
    const scroll = window.scrollY;

    if (scroll < window.innerHeight) {
      heroBackground.style.transform = `translateY(${
        scroll * 0.12
      }px) scale(1.06)`;
    }
  },
  {
    passive: true,
  },
);

/* ==================================================
   OCULTAR INDICADOR
================================================== */

const scrollHint = document.querySelector(".scroll-hint");

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > window.innerHeight * 0.2) {
      scrollHint.style.opacity = "0";
    } else {
      scrollHint.style.opacity = "1";
    }
  },
  {
    passive: true,
  },
);

/* ==================================================
   CUENTA REGRESIVA
================================================== */

const weddingDate = new Date("December 20, 2026 17:00:00").getTime();

function updateCountdown() {
  const now = Date.now();

  const difference = weddingDate - now;

  if (difference <= 0) {
    setNumber("days", 0);

    setNumber("hours", 0);

    setNumber("minutes", 0);

    setNumber("seconds", 0);

    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  const hours = Math.floor(difference / (1000 * 60 * 60)) % 24;

  const minutes = Math.floor(difference / (1000 * 60)) % 60;

  const seconds = Math.floor(difference / 1000) % 60;

  setNumber("days", days);

  setNumber("hours", hours);

  setNumber("minutes", minutes);

  setNumber("seconds", seconds);
}

function setNumber(id, value) {
  const element = document.getElementById(id);

  const formatted = String(value).padStart(2, "0");

  if (element.textContent !== formatted) {
    element.parentElement.classList.remove("tick");

    void element.parentElement.offsetWidth;

    element.parentElement.classList.add("tick");
  }

  element.textContent = formatted;
}

updateCountdown();

setInterval(updateCountdown, 1000);

/* ==================================================
   CURSOR DE LUZ
================================================== */

const cursor = document.querySelector(".cursor-glow");

if (window.matchMedia("(pointer:fine)").matches) {
  document.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;

    cursor.style.top = `${event.clientY}px`;
  });
}
