/* Portfolio site script. Each feature checks that its elements exist first. */
document.documentElement.classList.add("js");

/*===== THEME TOGGLE =====================================*/
// The first theme is set by the inline script in <head>.
(function () {
  var root = document.documentElement;
  var button = document.querySelector(".theme-toggle");
  if (!button) return;
  var themeColor = document.querySelector('meta[name="theme-color"]');

  function sync() {
    var theme = root.getAttribute("data-theme");
    var next = theme === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", "Switch to " + next + " theme");
    if (themeColor) themeColor.setAttribute("content", theme === "dark" ? "#0c0f14" : "#f4f5f7");
  }

  button.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("pf-theme", next);
    } catch (e) {
      // Storage can be blocked (private mode); the toggle still works for this visit.
    }
    sync();
  });
  sync();
})();

/*===== PHONE MENU =======================================*/
(function () {
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("menu");
  if (!toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  // Close after picking a link, on Escape, or when tapping outside the menu.
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setOpen(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", function (e) {
    if (menu.classList.contains("is-open") && !menu.contains(e.target) && !toggle.contains(e.target)) {
      setOpen(false);
    }
  });
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

/*===== HIGHLIGHT THE CURRENT SECTION IN THE NAV =========*/
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll(".menu a"));
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
  document.querySelectorAll("main section[id]").forEach(function (section) {
    observer.observe(section);
  });
})();

/*===== REVEAL ON SCROLL =================================*/
(function () {
  if (!("IntersectionObserver" in window)) return;
  var items = document.querySelectorAll(".section-head, .contact-intro, .feature, .project, .terminal, .contact-form");
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) {
    el.classList.add("reveal");
    observer.observe(el);
  });
})();

/*===== BACK TO TOP ======================================*/
(function () {
  var button = document.querySelector(".scroll-to-top");
  if (!button) return;
  button.addEventListener("click", function () {
    window.scrollTo({ top: 0 });
  });
  function update() {
    button.classList.toggle("is-visible", window.scrollY > 500);
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
    status.setAttribute("data-kind", kind);
    status.textContent = text;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      say("error", "Please fill in every field.");
      var firstInvalid = form.querySelector(":invalid:not(.honeypot)");
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    if (!window.fetch) {
      form.submit();
      return;
    }
    button.disabled = true;
    say("info", "Sending…");
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
        say("info", "Opening the secure form to finish sending…");
        form.submit();
      })
      .then(function () {
        button.disabled = false;
      });
  });
})();
