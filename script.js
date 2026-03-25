const FORM_URL = "https://forms.gle/Uvm3EYhH5xeEFsFa7";

const body = document.body;
const progressBar = document.querySelector(".scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#'], .footer-nav a[href^='#']"));
const headerLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const faqItems = document.querySelectorAll(".faq-item");
const formLinks = document.querySelectorAll("[data-form-link]");
const revealItems = document.querySelectorAll(".reveal");
const countupItems = document.querySelectorAll("[data-countup]");
const sections = Array.from(document.querySelectorAll("main section[id]"));
const serviceTriggers = Array.from(document.querySelectorAll("[data-service-trigger]"));
const serviceSections = Array.from(document.querySelectorAll("[data-service-section]"));
const serviceSectionIds = new Set(serviceSections.map((section) => section.id));
const partnershipCarousel = document.querySelector("[data-carousel]");

function closeMenu() {
  if (!siteNav || !menuToggle) {
    return;
  }

  siteNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  body.classList.remove("menu-open");
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    body.classList.toggle("menu-open", isOpen);
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = siteNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle) {
      closeMenu();
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href")?.replace("#", "");

    if (targetId && serviceSectionIds.has(targetId)) {
      event.preventDefault();
      setActiveService(targetId);
    }

    closeMenu();
  });
});

function setActiveService(targetId, { scroll = true } = {}) {
  const targetSection = serviceSections.find((section) => section.id === targetId);

  if (!targetSection) {
    return;
  }

  serviceSections.forEach((section) => {
    section.hidden = section.id !== targetId;
  });

  serviceTriggers.forEach((trigger) => {
    const isActive = trigger.dataset.serviceTrigger === targetId;
    trigger.classList.toggle("is-active", isActive);

    if (isActive) {
      trigger.setAttribute("aria-current", "true");
      return;
    }

    trigger.removeAttribute("aria-current");
  });

  if (scroll) {
    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  updateActiveSection();
}

function syncServiceTriggerState(targetId) {
  if (!targetId || !serviceSectionIds.has(targetId)) {
    return;
  }

  serviceTriggers.forEach((trigger) => {
    const isActive = trigger.dataset.serviceTrigger === targetId;
    trigger.classList.toggle("is-active", isActive);

    if (isActive) {
      trigger.setAttribute("aria-current", "true");
      return;
    }

    trigger.removeAttribute("aria-current");
  });
}

serviceTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    closeMenu();
    setActiveService(trigger.dataset.serviceTrigger);
  });
});

if (serviceSections.length > 0) {
  serviceSections.forEach((section) => {
    section.hidden = true;
  });

  serviceTriggers.forEach((trigger) => {
    trigger.classList.remove("is-active");
    trigger.removeAttribute("aria-current");
  });
}

if (partnershipCarousel) {
  const track = partnershipCarousel.querySelector("[data-carousel-track]");
  const prevButton = partnershipCarousel.querySelector("[data-carousel-prev]");
  const nextButton = partnershipCarousel.querySelector("[data-carousel-next]");
  const dots = Array.from(partnershipCarousel.querySelectorAll("[data-carousel-dot]"));
  const slides = Array.from(track?.children || []);
  let activeIndex = 0;
  let touchStartX = 0;
  let touchDeltaX = 0;

  function updateCarousel(index) {
    if (!track || slides.length === 0) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
      dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
    });
  }

  prevButton?.addEventListener("click", () => {
    updateCarousel(activeIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    updateCarousel(activeIndex + 1);
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      updateCarousel(dotIndex);
    });
  });

  partnershipCarousel.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0]?.clientX || 0;
    touchDeltaX = 0;
  }, { passive: true });

  partnershipCarousel.addEventListener("touchmove", (event) => {
    const currentX = event.touches[0]?.clientX || 0;
    touchDeltaX = currentX - touchStartX;
  }, { passive: true });

  partnershipCarousel.addEventListener("touchend", () => {
    if (Math.abs(touchDeltaX) < 40) {
      return;
    }

    if (touchDeltaX < 0) {
      updateCarousel(activeIndex + 1);
      return;
    }

    updateCarousel(activeIndex - 1);
  });

  updateCarousel(0);
}

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  if (!question) {
    return;
  }

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((faqItem) => {
      const button = faqItem.querySelector(".faq-question");
      faqItem.classList.remove("is-open");

      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    });

    if (!isOpen) {
      item.classList.add("is-open");
      question.setAttribute("aria-expanded", "true");
    }
  });
});

formLinks.forEach((link) => {
  link.setAttribute("href", FORM_URL);
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noreferrer");

  link.addEventListener("click", (event) => {
    if (FORM_URL.includes("replace-with-your-form-link")) {
      event.preventDefault();
      alert("Replace FORM_URL in script.js with your Google Form link.");
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

function animateCount(element) {
  const target = Number(element.dataset.target || 0);
  const suffix = element.dataset.suffix || "";
  const prefix = element.dataset.prefix || "";
  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = `${prefix}${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
      return;
    }

    element.textContent = `${prefix}${target}${suffix}`;
  }

  requestAnimationFrame(update);
}

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.6,
  }
);

countupItems.forEach((item) => {
  countObserver.observe(item);
});

function updateScrollProgress() {
  if (!progressBar) {
    return;
  }

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

function updateActiveSection() {
  const offset = window.scrollY + 140;
  let currentId = "";

  sections.forEach((section) => {
    if (section.hidden) {
      return;
    }

    if (offset >= section.offsetTop) {
      currentId = section.id;
    }
  });

  headerLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("is-active", isActive);
  });

  syncServiceTriggerState(currentId);
}

window.addEventListener("scroll", () => {
  updateScrollProgress();
  updateActiveSection();
});

window.addEventListener("load", () => {
  updateScrollProgress();
  updateActiveSection();
});
