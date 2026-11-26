/* Perfect Foundation Services — Interactive JS */

document.addEventListener("DOMContentLoaded", () => {
  // ---- 1. Scroll Spy & Sticky Header ----
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const mainHeader = document.getElementById("main-header");

  function updateActiveNav() {
    const scrollPos = window.scrollY + 140;
    let currentId = "";

    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 80
    ) {
      currentId = "contact";
    } else {
      sections.forEach((section) => {
        if (
          scrollPos >= section.offsetTop &&
          scrollPos < section.offsetTop + section.offsetHeight
        ) {
          currentId = section.id;
        }
      });
    }
    if (!currentId && window.scrollY < 300) currentId = "hero";

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentId}`,
      );
    });

    if (window.scrollY > 20) mainHeader.classList.add("shadow-lg");
    else mainHeader.classList.remove("shadow-lg");
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // ---- 2. Mobile Menu ----
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileDrawer = document.getElementById("mobile-menu-drawer");
  const mobileOverlay = document.getElementById("mobile-menu-overlay");
  const mobileClose = document.getElementById("mobile-menu-close");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  const openMenu = () => {
    mobileDrawer.classList.remove("translate-x-full");
    mobileOverlay.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  };
  const closeMenu = () => {
    mobileDrawer.classList.add("translate-x-full");
    mobileOverlay.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  if (mobileBtn) mobileBtn.addEventListener("click", openMenu);
  if (mobileClose) mobileClose.addEventListener("click", closeMenu);
  if (mobileOverlay) mobileOverlay.addEventListener("click", closeMenu);
  mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

  // ---- 3. Hero Carousel (full-width background) ----
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-carousel-dot");
  let currentSlide = 0;
  let slideTimer = null;

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => {
      if (i === index) {
        d.classList.add("bg-brand-400", "w-8");
        d.classList.remove("bg-white/50", "w-1.5");
      } else {
        d.classList.remove("bg-brand-400", "w-8");
        d.classList.add("bg-white/50", "w-1.5");
      }
    });
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function startTimer() {
    if (slides.length > 1) slideTimer = setInterval(nextSlide, 6000);
  }
  function stopTimer() {
    if (slideTimer) clearInterval(slideTimer);
  }

  const prevBtn = document.getElementById("hero-carousel-prev");
  const nextBtn = document.getElementById("hero-carousel-next");

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      stopTimer();
      showSlide(parseInt(dot.dataset.slide, 10));
      startTimer();
    });
  });

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      stopTimer();
      showSlide((currentSlide - 1 + slides.length) % slides.length);
      startTimer();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      stopTimer();
      nextSlide();
      startTimer();
    });

  startTimer();

  // ---- 4. Before/After Slider (Multi-Card) ----
  const sliders = document.querySelectorAll(".comparison-container");

  if (sliders.length > 0) {
    sliders.forEach((slider) => {
      const handle = slider.querySelector(".project-slider-handle");
      const afterWrapper = slider.querySelector(".project-after-wrapper");
      let dragging = false;

      if (handle && afterWrapper) {
        function update(x) {
          const rect = slider.getBoundingClientRect();
          let offset = x - rect.left;
          offset = Math.max(0, Math.min(offset, rect.width));
          const pct = (offset / rect.width) * 100;

          handle.style.left = `${pct}%`;
          afterWrapper.style.width = `${pct}%`;
        }

        // Mouse events
        slider.addEventListener("mousedown", (e) => {
          // Prevent dragging when clicking the carousel arrows/dots if they overlap
          if (e.target.closest("button")) return;
          dragging = true;
          update(e.clientX);
        });
        window.addEventListener("mouseup", () => (dragging = false));
        window.addEventListener("mousemove", (e) => {
          if (dragging) update(e.clientX);
        });

        // Touch events
        slider.addEventListener(
          "touchstart",
          (e) => {
            dragging = true;
            update(e.touches[0].clientX);
          },
          { passive: true },
        );
        window.addEventListener("touchend", () => (dragging = false));
        window.addEventListener(
          "touchmove",
          (e) => {
            if (dragging) update(e.touches[0].clientX);
          },
          { passive: true },
        );
      }
    });
  }

  // ---- 4.5 Project Carousel ----
  const projTrack = document.getElementById("projects-track");
  const projPrev = document.getElementById("proj-prev");
  const projNext = document.getElementById("proj-next");
  const projDotsContainer = document.getElementById("proj-dots");

  if (projTrack && projPrev && projNext) {
    let currentProj = 0;
    const totalProjs = projTrack.children.length;

    // Create Dots
    for (let i = 0; i < totalProjs; i++) {
      const dot = document.createElement("button");
      dot.className = `w-3 h-3 rounded-full transition-all duration-300 ${i === 0 ? "bg-brand-600 w-6" : "bg-slate-300 hover:bg-brand-400"}`;
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => {
        currentProj = i;
        updateProjCarousel();
      });
      projDotsContainer.appendChild(dot);
    }

    function updateProjCarousel() {
      projTrack.style.transform = `translateX(-${currentProj * 100}%)`;

      // Update Dots
      Array.from(projDotsContainer.children).forEach((dot, i) => {
        if (i === currentProj) {
          dot.className =
            "w-6 h-3 rounded-full transition-all duration-300 bg-brand-600";
        } else {
          dot.className =
            "w-3 h-3 rounded-full transition-all duration-300 bg-slate-300 hover:bg-brand-400 cursor-pointer";
        }
      });
    }

    projNext.addEventListener("click", () => {
      currentProj = (currentProj + 1) % totalProjs;
      updateProjCarousel();
    });

    projPrev.addEventListener("click", () => {
      currentProj = (currentProj - 1 + totalProjs) % totalProjs;
      updateProjCarousel();
    });
  }

  // ---- 5. Inspection Form (FormSubmit.co) ----
  const form = document.getElementById("minimal-inspection-form");
  const successModal = document.getElementById("form-success-modal");
  const modalClose = document.getElementById("modal-close-btn");
  const formStatus = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Required-field belt-and-suspenders check (replaces the old manual alert)
      const propTypes = [];
      if (document.getElementById("prop-mobile").checked)
        propTypes.push("Mobile Home");
      if (document.getElementById("prop-site-built").checked)
        propTypes.push("Site-built house");
      if (document.getElementById("prop-other").checked) {
        const val = document.getElementById("prop-other-text").value.trim();
        propTypes.push(val ? `Other: ${val}` : "Other");
      }

      if (propTypes.length === 0) {
        alert("Please select at least one Property Type.");
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const data = new FormData(form);
      // data.set(
      //   "_subject",
      //   `New Inspection Request — ${propTypes.join(", ")} — ${data.get("cityZip") || ""}`,
      // );

      // Combines the "Other" checkbox + its text field into one readable value
      // so the email table doesn't get two confusing columns
      if (document.getElementById("prop-other").checked) {
        data.set("propertyType", propTypes.join(", "));
      }
      if (document.getElementById("found-other").checked) {
        const val = document.getElementById("found-other-text").value.trim();
        const found = [];
        if (document.getElementById("found-pier").checked)
          found.push("Pier & Beam");
        if (document.getElementById("found-slab").checked)
          found.push("Concrete Slab");
        found.push(val ? `Other: ${val}` : "Other");
        data.set("foundationType", found.join(", "));
      }

      submitButton.disabled = true;
      if (formStatus) {
        formStatus.classList.remove(
          "hidden",
          "text-emerald-600",
          "text-rose-600",
          "text-slate-600",
        );
        formStatus.classList.add("text-slate-600");
        formStatus.textContent = "Sending your inspection request…";
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success === "false") {
          throw new Error(
            result.message ||
              `Form submission failed with status ${response.status}`,
          );
        }

        if (formStatus) {
          formStatus.classList.remove("text-slate-600");
          formStatus.classList.add("text-emerald-600");
          formStatus.textContent =
            "Thank you. Your inspection request was sent to Perfect Foundation Services.";
        }

        // Populate modal
        document.getElementById("modal-client-name").textContent =
          data.get("name") || "";
        document.getElementById("modal-client-phone").textContent =
          data.get("phone") || "";
        document.getElementById("modal-client-address").textContent =
          data.get("cityZip") || "";
        document.getElementById("modal-client-type").textContent =
          propTypes.join(", ") || "Property";

        if (successModal) {
          successModal.classList.remove("hidden");
          document.body.classList.add("overflow-hidden");
        }

        form.reset();
        document.getElementById("prop-other-wrapper").classList.add("hidden");
        document.getElementById("found-other-wrapper").classList.add("hidden");
      } catch (error) {
        console.error(error);
        if (formStatus) {
          formStatus.classList.remove("text-slate-600");
          formStatus.classList.add("text-rose-600");
          formStatus.textContent =
            "We could not send your request. Please try again or call (936) 930-3676.";
        }
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  // Close and unlock the success modal.
  if (successModal && modalClose) {
    modalClose.addEventListener("click", () => {
      successModal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    });

    successModal.addEventListener("click", (event) => {
      if (event.target === successModal) {
        successModal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
      }
    });
  }

  // ---- 6. Coverage Checker ----
  const searchInput = document.getElementById("service-search-input");
  const checkBtn = document.getElementById("service-check-btn");
  const result = document.getElementById("service-search-result");

  // Exact cities + their primary ZIP codes
  const supported = [
    // Cities
    "tyler",
    "palestine",
    "longview",
    "marshall",
    "canton",
    "mineola",
    "hawkins",
    "gladewater",
    "rusk",
    "henderson",
    "athens",
    "fairfield",
    "jacksonville",
    "lufkin",
    "nacogdoches",
    "centerville",
    "trinity",
    "livingston",
    "woodville",
    "san augustine",
    "center",
    "carthage",
    "crockett",
    "jasper",
    "whitehouse",
    "kilgore",
    "alto",
    "timpson",
    "joaquin",
    "corrigan",
    "diboll",
    "mt. enterprise",
    "mt enterprise",
    "martinsville",

    // ZIP Codes
    "75701",
    "75702",
    "75703",
    "75704",
    "75705",
    "75706",
    "75707",
    "75708",
    "75709",
    "75710",
    "75711",
    "75712",
    "75713",
    "75799", // Tyler
    "75801",
    "75803", // Palestine
    "75601",
    "75602",
    "75603",
    "75604",
    "75605",
    "75606",
    "75607",
    "75608",
    "75615", // Longview
    "75670",
    "75671",
    "75672", // Marshall
    "75103", // Canton
    "75773", // Mineola
    "75765", // Hawkins
    "75647", // Gladewater
    "75785", // Rusk
    "75652",
    "75653",
    "75654", // Henderson
    "75751", // Athens
    "75840", // Fairfield
    "75766", // Jacksonville
    "75901",
    "75902",
    "75903",
    "75904",
    "75915", // Lufkin
    "75961",
    "75962",
    "75963",
    "75964",
    "75965", // Nacogdoches
    "75833", // Centerville
    "75862", // Trinity
    "77351",
    "77352", // Livingston
    "75979", // Woodville
    "75972", // San Augustine
    "75935", // Center
    "75633", // Carthage
    "75835", // Crockett
    "75951", // Jasper
    "75791", // Whitehouse
    "75662",
    "75663", // Kilgore
    "75925", // Alto
    "75975", // Timpson
    "75954", // Joaquin
    "75937", // Corrigan (Note: verify if needed, commonly 75937 or 75939 depending on exact route)
    "75941", // Diboll
    "75681", // Mt. Enterprise
    "75660", // Martinsville (Note: small community, often uses surrounding ZIPs, this is a common one)
  ];

  function checkCoverage() {
    if (!searchInput || !result) return;
    const q = searchInput.value.trim().toLowerCase();

    if (!q) {
      result.className =
        "mt-3 p-3.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-600";
      result.textContent = "Please enter your East Texas city or ZIP code.";
      result.classList.remove("hidden");
      return;
    }

    const match = supported.some((loc) => q.includes(loc) || loc.includes(q));
    result.classList.remove("hidden");

    if (match) {
      result.className =
        "mt-3 p-4 rounded-xl text-sm bg-brand-50 border border-brand-200 text-brand-900 flex items-start gap-3";
      result.innerHTML = `
        <div class="p-1 rounded-full bg-brand-500 text-white mt-0.5 shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div>
          <strong class="font-bold block">Inside our 100-mile service territory!</strong>
          <span class="text-xs block mt-0.5 text-brand-800">"${q}" is part of our route from Nacogdoches. Request an inspection below.</span>
          <a href="#contact" class="inline-block mt-2 text-xs font-bold text-brand-700 hover:text-brand-900 underline">Request inspection →</a>
        </div>`;
    } else {
      result.className =
        "mt-3 p-4 rounded-xl text-sm bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3";
      result.innerHTML = `
        <div class="p-1 rounded-full bg-amber-500 text-white mt-0.5 shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <div>
          <strong class="font-bold block">Extended zone — confirm route</strong>
          <span class="text-xs block mt-0.5 text-amber-800">"${q}" may be outside our primary perimeter. Submit your address in the form below.</span>
        </div>`;
    }
  }

  if (checkBtn) checkBtn.addEventListener("click", checkCoverage);
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        checkCoverage();
      }
    });
  }

  // ---- 7. FAQ Accordion ----
  document.querySelectorAll(".faq-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = document.getElementById(btn.dataset.target);
      const icon = btn.querySelector(".faq-icon");
      if (!content) return;

      const isHidden = content.classList.contains("hidden");

      document
        .querySelectorAll(".faq-content")
        .forEach((c) => c.classList.add("hidden"));
      document
        .querySelectorAll(".faq-icon")
        .forEach((i) => i.classList.remove("rotate-180"));
      document
        .querySelectorAll(".faq-toggle-btn")
        .forEach((b) => b.setAttribute("aria-expanded", "false"));

      if (isHidden) {
        content.classList.remove("hidden");
        icon.classList.add("rotate-180");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // ---- 8. Scroll Reveal ----
  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealEls.forEach((el) => observer.observe(el));

  // ---- 10. Map Zoom & Pan Controls ----
  const mapContainer = document.getElementById("map-container");
  const mapImage = document.getElementById("map-image");
  const zoomInBtn = document.getElementById("zoom-in-btn");
  const zoomOutBtn = document.getElementById("zoom-out-btn");

  if (mapImage && zoomInBtn && zoomOutBtn && mapContainer) {
    let scale = 1;
    let translateX = 0;
    let translateY = 0;

    let isDragging = false;
    let startX, startY;

    function updateMapTransform() {
      mapImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // Zoom In
    zoomInBtn.addEventListener("click", () => {
      if (scale < 3) {
        scale += 0.25;
        updateMapTransform();
      }
    });

    // Zoom Out
    zoomOutBtn.addEventListener("click", () => {
      if (scale > 1) {
        scale -= 0.25;
        // Reset position if zooming all the way back out
        if (scale === 1) {
          translateX = 0;
          translateY = 0;
        }
        updateMapTransform();
      }
    });

    // Dragging Logic (Mouse)
    mapContainer.addEventListener("mousedown", (e) => {
      // Only allow drag if zoomed in
      if (scale <= 1) return;
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateMapTransform();
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Dragging Logic (Touch for Mobile)
    mapContainer.addEventListener(
      "touchstart",
      (e) => {
        if (scale <= 1) return;
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
      },
      { passive: true },
    );

    window.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        updateMapTransform();
      },
      { passive: true },
    );

    window.addEventListener("touchend", () => {
      isDragging = false;
    });
  }
  // ---- 9. Reviews Auto-Slider ----
  const reviewTrack = document.getElementById("reviews-track");
  const reviewPrev = document.getElementById("review-prev");
  const reviewNext = document.getElementById("review-next");

  if (reviewTrack && reviewPrev && reviewNext) {
    let reviewIndex = 0;
    let reviewTimer = null;

    function getVisibleCards() {
      if (window.innerWidth >= 1024) return 3; // lg
      if (window.innerWidth >= 768) return 2; // md
      return 1; // mobile
    }

    function updateReviewSlider() {
      const cards = reviewTrack.children;
      if (cards.length === 0) return;

      const visibleCards = getVisibleCards();
      const maxIndex = cards.length - visibleCards;

      // Loop around
      if (reviewIndex > maxIndex) reviewIndex = 0;
      if (reviewIndex < 0) reviewIndex = maxIndex;

      // Get exact width of one card + the gap (24px)
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 24;
      const shift = (cardWidth + gap) * reviewIndex;

      reviewTrack.style.transform = `translateX(-${shift}px)`;
    }

    function startReviewTimer() {
      if (reviewTimer) clearInterval(reviewTimer);
      reviewTimer = setInterval(() => {
        reviewIndex++;
        updateReviewSlider();
      }, 3000); // 3 seconds
    }

    reviewNext.addEventListener("click", () => {
      reviewIndex++;
      updateReviewSlider();
      startReviewTimer();
    });

    reviewPrev.addEventListener("click", () => {
      reviewIndex--;
      updateReviewSlider();
      startReviewTimer();
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      const visibleCards = getVisibleCards();
      const maxIndex = reviewTrack.children.length - visibleCards;

      if (reviewIndex > maxIndex) reviewIndex = maxIndex;

      // Disable transition temporarily to prevent stuttering on resize
      reviewTrack.style.transition = "none";
      updateReviewSlider();

      setTimeout(() => {
        reviewTrack.style.transition = "transform 0.5s ease-in-out";
      }, 50);
    });

    // Initialize
    updateReviewSlider();
    startReviewTimer();
  }
});
