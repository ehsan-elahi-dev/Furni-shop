"use strict";

// TODO: add functionality for all buttons

const headerEl = document.querySelector("header");
const navbarEl = document.querySelector(".navbar");
const mobileNavbarButton = document.querySelector(".actions__button--mobile-nav");
const heroSectionEl = document.querySelector(".hero");
const scrollToTopButton = document.querySelector(".scrollToTop");
const slides = document.querySelectorAll(".testimonials__slide");
const testimonialsLeftButton = document.querySelector(".testimonials__btn--left");
const testimonialsRightButton = document.querySelector(".testimonials__btn--right");
const indicators = document.querySelector(".testimonials__indicators");

const headerHeight = headerEl.offsetHeight;

// Mobile navigation toggle
mobileNavbarButton.addEventListener("click", function () {
  const isOpen = navbarEl.classList.toggle("mobile-navbar");
  document.body.classList.toggle("overflow-y-hidden", isOpen);
});

// Smooth scrolling for navbar links
navbarEl.addEventListener("click", function (e) {
  const link = e.target.closest(".navbar__link");
  if (!link) return;
  e.preventDefault();

  const href = link.getAttribute("href");

  if (href === "#") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (href !== "#" && href.startsWith("#")) {
    const section = document.querySelector(href);
    if (!section) return;

    if (href === "#contact-us") {
      section.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      const offsetTop = section.offsetTop - headerHeight;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  }

  if (navbarEl.classList.contains("mobile-navbar")) {
    navbarEl.classList.remove("mobile-navbar");
    document.body.classList.remove("overflow-y-hidden");
  }

  link.blur();
});

// Intersection Observer for sticky header and scroll-to-top button
const heroObserver = new IntersectionObserver(
  function (entries) {
    const [entry] = entries;
    const isHeroVisible = entry.isIntersecting;

    headerEl.classList.toggle("sticky", !isHeroVisible);

    scrollToTopButton.classList.toggle("scrollToTop--visible", !isHeroVisible);
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${headerHeight}px`,
  },
);
heroObserver.observe(heroSectionEl);

// Scroll-to-top button click
scrollToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Testimonials slider logic
const slider = function () {
  let curSlide = 0;
  const maxSlide = slides.length;

  const createIndicators = function () {
    const markup = [...slides].reduce(
      (acc, _, i) => acc + `<button class="indicator" data-slide="${i}"></button>`,
      "",
    );
    indicators.insertAdjacentHTML("beforeend", markup);
  };

  const activateIndicator = function (slide) {
    document
      .querySelectorAll(".indicator")
      .forEach((dot) => dot.classList.remove("indicator--active"));

    document.querySelector(`.indicator[data-slide="${slide}"]`).classList.add("indicator--active");
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateIndicator(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateIndicator(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createIndicators();
    activateIndicator(0);
  };
  init();

  testimonialsLeftButton.addEventListener("click", prevSlide);
  testimonialsRightButton.addEventListener("click", nextSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    else if (e.key === "ArrowRight") nextSlide();
  });

  indicators.addEventListener("click", function (e) {
    if (e.target.classList.contains("indicator")) {
      const { slide } = e.target.dataset;
      curSlide = +slide;
      goToSlide(curSlide);
      activateIndicator(curSlide);
    }
  });
};
slider();
