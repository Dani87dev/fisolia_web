// ===== Header con fondo al hacer scroll =====
const header = document.getElementById("header");
const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// ===== Menú móvil =====
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", false);
  })
);

// ===== Animación al aparecer en pantalla =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  // se activa en cuanto el elemento asoma (40px dentro de la pantalla)
  { threshold: 0, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el, i) => {
  // pequeño retraso escalonado para elementos en la misma fila
  el.style.transitionDelay = `${(i % 3) * 0.06}s`;
  revealObserver.observe(el);
});

// ===== Contadores animados =====
const animateCount = (el) => {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const duration = 1500;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString("es-ES") + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
});
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

// ===== FAQ (acordeón, solo una abierta a la vez) =====
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-q");
  button.addEventListener("click", () => {
    const willOpen = !item.classList.contains("open");
    faqItems.forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".faq-q").setAttribute("aria-expanded", false);
    });
    item.classList.toggle("open", willOpen);
    button.setAttribute("aria-expanded", willOpen);
  });
});

// ===== Formulario de cita (simulado) =====
const form = document.getElementById("bookingForm");
const formMsg = document.getElementById("formMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  // form.elements porque form.name devolvería el atributo name del propio <form>
  const name = form.elements.name;
  const phone = form.elements.phone;
  const phoneOk = /^[0-9\s+]{9,}$/.test(phone.value.trim());

  name.classList.toggle("invalid", !name.value.trim());
  phone.classList.toggle("invalid", !phoneOk);

  if (!name.value.trim() || !phoneOk) {
    formMsg.textContent = "Revisa tu nombre y teléfono, por favor.";
    formMsg.className = "form-msg error";
    return;
  }

  const slot = form.elements.slot.value;
  const when = slot === "indiferente" ? "" : ` para buscarte hueco por la ${slot}`;
  formMsg.textContent = `¡Gracias, ${name.value.trim()}! Te llamaremos muy pronto${when}.`;
  formMsg.className = "form-msg ok";
  form.reset();
});

// ===== Año del footer =====
document.getElementById("year").textContent = new Date().getFullYear();
