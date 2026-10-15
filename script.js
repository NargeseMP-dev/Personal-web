// ===== One script for the whole site

// --Scroll reveal (runs first) --

(function () {
    const items = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    if (!items.length) return;

    
    if (!("IntersectionObserver" in window)) {
        items.forEach(function (el) { el.classList.add("active"); });
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach(function (el) { observer.observe(el); });
})();


//  Menu 

(function () {
    const navlink = document.getElementById("navlink");

    window.showMenu = function () { if (navlink) navlink.classList.add("open"); };
    window.hideMenu = function () { if (navlink) navlink.classList.remove("open"); };

    if (!navlink) return;

    navlink.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", window.hideMenu);
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") window.hideMenu();
    });
    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) window.hideMenu();
    });
})();


//  Hero: gentle 3D 
(function () {
    const hero = document.querySelector(".hero");
    const stage = document.querySelector(".hero-stage");
    if (!hero || !stage) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    let frame;

    hero.addEventListener("pointermove", function (e) {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;

        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(function () {
            stage.style.setProperty("--ry", (x * 10) + "deg");
            stage.style.setProperty("--rx", (-y * 8) + "deg");
        });
    });

    hero.addEventListener("pointerleave", function () {
        stage.style.setProperty("--rx", "0deg");
        stage.style.setProperty("--ry", "0deg");
    });
})();


// --Counters --

(function () {
    const band = document.querySelector(".countt");
    if (!band) return;

    const nums = band.querySelectorAll(".num");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) return;   // keep the final numbers

    nums.forEach(function (el) { el.textContent = "0"; });

    function countUp(el) {
        const target = Number(el.dataset.target) || 0;
        const duration = 1600;
        const start = performance.now();

        function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);                       
            el.textContent = Math.round(eased * target);
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                nums.forEach(countUp);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    io.observe(band);
})();




// ---------- Contact form ----------
// There is no server on a plain static site, so sending opens the visitor's email app
// with the message already filled in. To send without that, point the form's action at a
// form service (for example Formspree) and delete this block.
(function () {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    const status = form.querySelector(".form-status");
    const TO = "nargesemihan@gmail.com";

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const data = new FormData(form);
        const subject = (data.get("subject") || "").trim() || "Message from your portfolio";
        const body = "Name: " + data.get("name") + "\nEmail: " + data.get("email") + "\n\n" + data.get("message");

        window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

        if (status) {
            status.textContent = "Opening your email app. If nothing opens, write to " + TO + " directly.";
        }
    });
})();
