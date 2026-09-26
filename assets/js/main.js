/* Portfolio site script. Each feature checks that its elements exist first. */
document.documentElement.classList.add("js");

/*===== THEME TOGGLE =====================================*/
// The first theme is set by the inline script in <head>.
(function () {
  var root = document.documentElement;
  var button = document.querySelector(".theme-toggle");
  if (!button) return;

  function syncLabel() {
    var next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", "Switch to " + next + " theme");
  }

  button.addEventListener("click", function () {
    var next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-bs-theme", next);
    try {
      localStorage.setItem("pf-theme", next);
    } catch (e) {
      // Storage can be blocked (private mode); the toggle still works for this visit.
    }
    syncLabel();
  });
  syncLabel();
})();

/*===== HERO TYPING ANIMATION ============================*/
(function () {
  var el = document.getElementById("typing-animation");
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var words = ["Web Developer", "Web Designer", "Photographer", "Runner", "Snowboarder", "Foodie"];
  var word = 0;
  var chars = el.textContent.length;
  var deleting = true;

  function tick() {
    if (deleting) {
      chars--;
      if (chars <= 0) {
        deleting = false;
        word = (word + 1) % words.length;
      }
    } else {
      chars++;
    }
    el.textContent = words[word].slice(0, Math.max(chars, 0));
    var delay = deleting ? 45 : 95;
    if (!deleting && chars >= words[word].length) {
      deleting = true;
      delay = 1600;
    }
    if (deleting && chars <= 0) delay = 350;
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1600);
})();

/*===== CLOSE THE PHONE MENU AFTER PICKING A LINK ========*/
(function () {
  var menu = document.getElementById("mainNav");
  if (!menu || !window.bootstrap) return;
  menu.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    });
  });
})();

/*===== HIGHLIGHT THE CURRENT SECTION IN THE NAV =========*/
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll(".site-nav .nav-link"));
  if (!links.length || !("IntersectionObserver" in window)) return;
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) {
        a.classList.remove("active");
        a.removeAttribute("aria-current");
      });
      var link = byId[entry.target.id];
      if (link) {
        link.classList.add("active");
        link.setAttribute("aria-current", "true");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main [id]").forEach(function (section) {
    if (byId[section.id] || section.id === "home") observer.observe(section);
  });
})();

/*===== REVEAL ON SCROLL =================================*/
(function () {
  var items = document.querySelectorAll(".feature, .project, .skill-group, .contact-card, .section-head");
  if (!("IntersectionObserver" in window)) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  items.forEach(function (el) {
    el.classList.add("reveal");
    observer.observe(el);
  });
})();

/*===== SCROLL TO TOP ====================================*/
(function () {
  var button = document.querySelector(".scroll-to-top");
  if (!button) return;
  button.addEventListener("click", function () {
    window.scrollTo({ top: 0 });
  });
  function update() {
    button.classList.toggle("is-visible", window.scrollY > 400);
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

/*===== FOOTER YEAR ======================================*/
document.querySelectorAll(".js-year").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

/*===== CONTACT FORM =====================================*/
// Validates, then sends through FormSubmit without leaving the page.
// If the background send fails, the form submits normally instead.
(function () {
  var form = document.querySelector(".js-contact-form");
  if (!form) return;
  var status = form.querySelector(".form-status");
  var button = form.querySelector("button[type=submit]");

  function say(kind, text) {
    status.className = "form-status small mt-3 mb-0 text-" + kind;
    status.textContent = text;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      say("danger", "Please fill in every field.");
      return;
    }
    if (!window.fetch) {
      form.submit();
      return;
    }
    button.disabled = true;
    say("body-secondary", "Sending…");
    fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data && String(data.success) === "false") throw new Error(data.message || "Not sent");
        form.reset();
        form.classList.remove("was-validated");
        say("success", "Thanks! Your message was sent. I'll get back to you soon.");
      })
      .catch(function () {
        say("body-secondary", "Opening the secure form to finish sending…");
        form.submit();
      })
      .then(function () {
        button.disabled = false;
      });
  });
})();
