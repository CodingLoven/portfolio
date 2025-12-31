document.addEventListener("DOMContentLoaded", () => {

  /*   PROJECT FILTER  */

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (filterButtons.length && projectCards.length) {
    let activeFilter = "all";

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        if (filter === activeFilter) return;
        activeFilter = filter;

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        projectCards.forEach((card) => {
          card.classList.add("is-hidden");
        });

        setTimeout(() => {
          projectCards.forEach((card) => {
            const category = card.dataset.category;
            if (filter === "all" || category === filter) {
              card.style.display = "grid";
              requestAnimationFrame(() => {
                card.classList.remove("is-hidden");
              });
            } else {
              card.style.display = "none";
            }
          });
        }, 250);
      });
    });
  }

  /*    STATS COUNT-UP */

  const statNumbers = document.querySelectorAll(".stat-number");
  const statsSection = document.querySelector(".about-stats");

  if (statNumbers.length && statsSection) {
    let statsAnimated = false;

    const countUp = (el) => {
      const raw = el.dataset.value;
      const isDecimal = raw.includes(".");
      const target = parseFloat(raw);
      const suffix = el.textContent.replace(/[0-9.]/g, "");
      const duration = 800;
      const startTime = performance.now();

      const animate = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const value = target * progress;
        el.textContent =
          (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;

        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach(countUp);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(statsSection);
  }

  /*    VIDEO STACK + SWIPE  */

  const stack = document.querySelector(".video-stack");
  const cards = Array.from(document.querySelectorAll(".video-card"));
  const nextBtn = document.querySelector(".video-next-btn");

  if (stack && cards.length) {
    let activeIndex = 0;

    const updateStack = () => {
      cards.forEach((card, i) => {
        const pos = (i - activeIndex + cards.length) % cards.length;

        card.classList.toggle("active", pos === 0);
        card.style.zIndex = cards.length - pos;
        card.style.opacity = pos > 2 ? 0 : 1;

        if (pos === 0) {
          card.style.transform = "translate(0,0) scale(1)";
        } else if (pos === 1) {
          card.style.transform = "translate(18px,18px) scale(0.96)";
        } else if (pos === 2) {
          card.style.transform = "translate(36px,36px) scale(0.92)";
        } else {
          card.style.transform = "translate(54px,54px) scale(0.88)";
        }
      });
    };

    const nextVideo = () => {
      activeIndex = (activeIndex + 1) % cards.length;
      updateStack();
    };

    updateStack();

    if (nextBtn) {
      nextBtn.addEventListener("click", nextVideo);
    }

    /* Swipe support */
    const swipeLayer = document.querySelector(".video-swipe-layer");

    if (swipeLayer) {
      let startX = 0;
      let startY = 0;

      swipeLayer.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }, { passive: true });

      swipeLayer.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const deltaX = startX - endX;
        const deltaY = startY - endY;

        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
          nextVideo();
        }
      }, { passive: true });
    }
  }

  /*   MOBILE MENU TOGGLE  */

  const toggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }

  /*    HEADER SCROLL HIDE / SHOW   */

  const header = document.querySelector(".site-header");

  if (header) {
    let lastScrollY = window.scrollY;
    const SCROLL_DELTA = 18;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;

      if (diff > SCROLL_DELTA && currentScrollY > 120) {
        header.classList.add("is-hidden");
      } else if (diff < -SCROLL_DELTA) {
        header.classList.remove("is-hidden");
      }

      lastScrollY = currentScrollY;
    });
  }

  /*  FAQ TABS   */

  const tabs = document.querySelectorAll(".faq-tab");
  const groups = document.querySelectorAll(".faq-group");

  if (tabs.length && groups.length) {
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        groups.forEach(g => g.classList.remove("active"));

        tab.classList.add("active");
        const target = document.getElementById(tab.dataset.tab);
        if (target) target.classList.add("active");
      });
    });
  }

  /*  FAQ ACCORDION   */

  const questions = document.querySelectorAll(".faq-question");

  if (questions.length) {
    questions.forEach(question => {
      question.addEventListener("click", () => {
        const item = question.parentElement;
        const group = item.closest(".faq-group");
        if (!group) return;

        group.querySelectorAll(".faq-item").forEach(other => {
          if (other !== item) {
            const ans = other.querySelector(".faq-answer");
            if (ans) ans.style.height = "0px";
            other.classList.remove("active");
          }
        });

        const answer = item.querySelector(".faq-answer");
        if (!answer) return;

        if (item.classList.contains("active")) {
          answer.style.height = "0px";
          item.classList.remove("active");
        } else {
          item.classList.add("active");
          answer.style.height = answer.scrollHeight + "px";
        }
      });
    });
  }

  /* OPEN FIRST FAQ ON LOAD */

  const firstGroup = document.querySelector(".faq-group.active");
  if (firstGroup) {
    const firstItem = firstGroup.querySelector(".faq-item");
    if (firstItem) {
      const answer = firstItem.querySelector(".faq-answer");
      if (answer) {
        firstItem.classList.add("active");
        answer.style.height = answer.scrollHeight + "px";
      }
    }
  }

  /*   SECTION REVEAL  */

  const reveals = document.querySelectorAll(".reveal");

  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach(el => revealObserver.observe(el));
  }

  /*   CURRENT YEAR  */

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
