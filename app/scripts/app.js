"use strict";

// Hash router replacing AngularJS ngRoute: keeps the "#/about" links and loads views/<name>.html into #view.
const routes = {
  "": "main",
  about: "about",
  blog: "blog",
  project: "project",
  sample: "project",
  yeoman: "project",
  contacts: "contact",
};

async function showView() {
  const route = location.hash.replace(/^#\/?/, "");
  const response = await fetch(`views/${Object.hasOwn(routes, route) ? routes[route] : "main"}.html`);
  const view = document.getElementById("view");
  view.innerHTML = await response.text();
  // innerHTML never runs scripts: recreate them so the views' widgets still load
  for (const old of view.querySelectorAll("script")) {
    const script = document.createElement("script");
    for (const { name, value } of old.attributes) script.setAttribute(name, value);
    script.textContent = old.textContent;
    old.replaceWith(script);
  }
  // Bootstrap only starts data-bs-ride carousels present at page load
  view.querySelectorAll("[data-bs-ride='carousel']").forEach((el) => bootstrap.Carousel.getOrCreateInstance(el));
  view.querySelectorAll("[data-now]").forEach((el) => (el.textContent = new Date().toLocaleString("en")));
  document.querySelectorAll(".navbar a[href^='#/']").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#/${route}`));
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", showView);
showView();
document.getElementById("year").textContent = new Date().getFullYear();
