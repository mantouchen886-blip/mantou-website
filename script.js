const header = document.querySelector(".site-header");

function updateHeader() {
  header.classList.toggle("is-solid", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const homeSections = document.querySelectorAll(".home-page main > section[id]");
const homeNavLinks = document.querySelectorAll('.home-page a[href^="#"]');

function showHomeSection(sectionId, shouldScroll = true) {
  const isHome = sectionId === "top";

  homeSections.forEach((section) => {
    section.classList.toggle("is-current", section.id === sectionId);
  });

  document.body.classList.toggle("is-section-open", !isHome);
  document.body.classList.toggle("is-works-open", sectionId === "work");

  if (isHome) {
    homeSections.forEach((section) => section.classList.remove("is-current"));
  }

  const target = isHome ? document.querySelector("#top") : document.getElementById(sectionId);
  if (shouldScroll && target) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

homeNavLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const sectionId = link.getAttribute("href").slice(1) || "top";
    if (sectionId === "top" || document.getElementById(sectionId)) {
      event.preventDefault();
      history.pushState(null, "", `#${sectionId}`);
      showHomeSection(sectionId);
    }
  });
});

if (document.body.classList.contains("home-page")) {
  const initialSection = location.hash ? location.hash.slice(1) : "top";
  showHomeSection(initialSection, false);
  window.addEventListener("hashchange", () => {
    showHomeSection(location.hash ? location.hash.slice(1) : "top");
  });
}

const artworkImages = document.querySelectorAll(".works-gallery .project-card img");

if (artworkImages.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = '<button type="button" aria-label="Close preview">&times;</button><img alt="" />';
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector("button");

  function openLightbox(image) {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    lightboxImage.src = "";
  }

  artworkImages.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Open larger preview: ${image.alt}`);
    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}
