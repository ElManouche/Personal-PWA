// Underscore throttle function
const throttle = (func, wait, options) => {
  let timeout,
    context,
    args,
    result,
    previous = 0;
  if (!options) options = {};

  const later = () => {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  const throttled = function () {
    const now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    const remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };
  return throttled;
};
const convertDate = (event) => {
  // Prevent the form from submitting
  event.preventDefault();

  // Get the date value from the input field
  const dateInput = document.getElementById("date");
  const dateValue = dateInput.value;

  // Convert the date to the desired format (YYYY-MM-DD)
  const dateParts = dateValue.split("-");
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  const formattedDate = `${day}.${month}.${year}`;

  // Set the value of the hidden input field with the formatted date
  const formattedDateInput = document.getElementById("00N0900000K6W6s");
  formattedDateInput.value = formattedDate;

  // Submit the form
  event.target.submit();
};
const trackEvent = (event, ...options) => {
  //console.log(`Track event: ${event}`, ...options);
  if (typeof mixpanel === "object") {
    mixpanel.track(event, ...options);
  }
};

// JS TO USE THE MENU AS A SINGLE PAGE WITH SCROLL
const linkToAnchorClickedHandler = (evt) => {
  evt.preventDefault();
  const toggler = document.getElementById("toggler");
  let target = evt.target,
    link;

  // Close the mobile menu
  if (!!toggler.checked) {
    setTimeout(() => toggler.click(), 10);
  }

  if (target.nodeName !== "A") {
    target = target.closest("a");
  }

  link = target.getAttribute("href");

  // Scroll to the anchor
  setTimeout(
    () => {
      location.hash = "";
      location.hash = link;
    },
    !!toggler.checked ? 400 : 10
  );

  const submenu = target.closest("li.submenu");
  if (!!submenu) {
    setTimeout(() => submenu.classList.add("closed"), 100);
    setTimeout(() => submenu.classList.remove("closed"), 1000);
  }

  trackEvent("Link to anchor clicked", { link: link });
};

// don't scroll body if the mobile menu is visible
const togglerClickedHandler = (checked) => {
  if (checked === true) {
    document.documentElement.classList.add("no-scroll");
  } else {
    document.documentElement.classList.remove("no-scroll");
  }
};

// Animate the desktop navbar
const parallax = () => {
  const pos = window.scrollY,
    banner = document.querySelector("#banner.parallax");

  // Don't calculate if the banner isn't above the fold
  if (!!banner && pos <= banner.offsetHeight) {
    const scale = pos / (banner.offsetHeight * 10),
      bg = document.querySelector("#banner .bg"),
      mg = document.querySelector("#banner .mg"),
      fg = document.querySelector("#banner .fg");

    bg.style.top = `${pos * 0.4}px`;
    bg.style.transform = `scale(${1 + scale})`;
    mg.style.top = `${pos * 0.3}px`;
    mg.style.transform = `scale(${1 + scale * 0.65})`;
    fg.style.top = `${pos * 0.25}px`;
  }
};

const initLinksCloseNav = () => {
  document
    .querySelectorAll("a[href*='#']:not([href='#'])")
    .forEach((link) =>
      link.addEventListener("click", linkToAnchorClickedHandler)
    );
};

const initCloseSubNav = () => {
  document.querySelectorAll("li.submenu").forEach((item) => {
    const throttledReopenSubmenu = throttle(
      () => item.classList.remove("closed"),
      1000,
      { leading: false }
    );
    item.addEventListener("click", () => {
      item.classList.toggle("closed");
      throttledReopenSubmenu.cancel();
    });
    item.addEventListener("mouseenter", () => {
      // on mobile, timeout to trigger hover after click ;)
      setTimeout(() => item.classList.remove("closed"), 100);
    });
    item.addEventListener("mousemove", throttledReopenSubmenu);
  });
};

const initObserveElements = () => {
  const elements = [].slice.call(document.querySelectorAll(".observable"));
  const observablesObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        trackEvent("Object intersecting", {
          element: entry.target.nodeName,
          class: entry.target.className
        });
        const dataset = entry.target.dataset;
        for (const record in dataset) {
          if (dataset[record]) {
            if (record == "hover") {
              var initialSrc = entry.target.src;
              entry.target.setAttribute("src", dataset[record]);
              setTimeout(() => {
                var timeoutID = undefined;
                entry.target.setAttribute("src", initialSrc);
                ["click", "mouseenter"].forEach((evt) =>
                  entry.target.addEventListener(
                    evt,
                    () => {
                      clearTimeout(timeoutID);
                      entry.target.setAttribute("src", dataset[record]);
                      timeoutID = setTimeout(
                        () => entry.target.setAttribute("src", initialSrc),
                        2000
                      );
                    },
                    false
                  )
                );
                entry.target.addEventListener("mouseleave", () => {
                  entry.target.setAttribute("src", initialSrc);
                  clearTimeout(timeoutID);
                });
              }, 2000);
            } else {
              entry.target.setAttribute(record, dataset[record]);
              entry.target.removeAttribute(`data-${record}`);
            }
          }
        }
        observablesObserver.unobserve(entry.target);
      }
    });
  });
  elements.forEach((element) => {
    observablesObserver.observe(element);
  });
};

const initNavPosition = () => {
  const banner = document.getElementById("banner");
  const bannerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const container = document.querySelector(".container");
      if (entry.isIntersecting) {
        container.classList.add("banner-intersecting");
      } else {
        container.classList.remove("banner-intersecting");
      }
    });
  });
  if (!!banner) {
    bannerObserver.observe(banner);
  } else {
    const container = document.querySelector(".container");
    container.classList.remove("banner-intersecting");
  }
};

const initMaps = () => {
  document.querySelectorAll("div.map-iframe").forEach((item) => {
    const iframe = item.querySelector("iframe");
    item.addEventListener("click", () => {
      item.classList.add("interact");
      iframe.src = iframe.getAttribute("data-src");
      iframe.removeAttribute("data-src");
    });
    iframe.addEventListener(
      "load",
      () => trackEvent("Map loaded", iframe.src),
      true
    );
  });
};
const initParallax = () => {
  document.addEventListener(
    "scroll",
    throttle(() => parallax(), 1000 / 48)
  );
};

const initColorSchemeToggler = () => {
  const colorSchemeToggler = document.getElementById("colorSchemeToggler");
  const colorSchemeTogglers = document.getElementsByClassName(
    "color-scheme-toggler"
  );

  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  function toggleColorScheme() {
    const html = document.querySelector("html");
    const currentScheme = html.style.getPropertyValue("color-scheme");

    let newScheme = currentScheme === "light" ? "dark" : "light";

    if (currentScheme === "" && prefersDark) {
      newScheme = "light"; // Override dark preference if no scheme set
    }

    html.style.setProperty("color-scheme", newScheme);
  }

  if (!prefersDark) {
    colorSchemeToggler.checked = true;
  }

  Array.from(colorSchemeTogglers).forEach(function (toggler) {
    toggler.addEventListener("click", () => toggleColorScheme());
  });

  // Add an event listener to the checkbox to toggle the color scheme
  if (!!colorSchemeToggler) {
    colorSchemeToggler.addEventListener("change", () => toggleColorScheme());
  }
};

const initTogglerListener = () => {
  const toggler = document.getElementById("toggler");
  toggler.addEventListener("click", () =>
    togglerClickedHandler(toggler.checked)
  );
};
const trackFirstScroll = () => {
  trackEvent("First scroll");
  document.removeEventListener("scroll", trackFirstScroll);
};

const initFirstScrollListener = () => {
  document.addEventListener("scroll", trackFirstScroll);
};

const trackAppInstallation = () => {
  trackEvent("App installed");
  window.removeEventListener("appinstalled", trackAppInstallation);
};

const initAppInstallation = () => {
  window.addEventListener("appinstalled", trackAppInstallation);
};

const initLinksClicked = () => {
  document
    .querySelectorAll("a[class*='contact_']")
    .forEach((link) =>
      link.addEventListener("click", () =>
        trackEvent(`Link clicked`, { href: link.href })
      )
    );
};
const initForm = () => {
  document
    .querySelectorAll(
      "input[type='text'], input[type='email'], input[type='tel'], input[type='date'], textarea"
    )
    .forEach((input) => {
      input.setAttribute("value", "");
      input.addEventListener("change", (e) =>
        input.setAttribute("value", e.target.value)
      );
    });
  const curYear = new Date().getFullYear();
  var min = 1966,
    max = curYear,
    select = document.getElementById("00N0900000K6W72");

  if (!!select) {
    for (var i = min; i <= max; i++) {
      var opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = i;
      select.appendChild(opt);
    }

    select.value = new Date().getFullYear();
  }
};

const locationHandler = () => {
  var location = window.location.hash.replace("#", "");
  // if the path length is 0, set it to primary page route
  if (location.length == 0) {
    location = "/";
  }
  //console.log(location);
  // get the route object from the routes object
  if (location === "form") {
    document.getElementById("banner").style.display = "none";
    const sections = document.querySelectorAll(".sections section");

    sections.forEach((section) => {
      if (section.id !== "form") {
        section.style.display = "none";
      } else {
        section.style.display = "block";
      }
    });
  } else {
    if (location === "form_sent") {
      document.getElementById("form_sent").showModal();
    }
    document.getElementById("banner").style.display = "block";
    const sections = document.querySelectorAll(".sections section");
    //console.log(sections);
    sections.forEach((section) => {
      //console.log(section.id);
      if (section.id !== "form") {
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }
    });
  }
};
const initRouting = () => {
  // create a function that watches the hash and calls the urlLocationHandler
  window.addEventListener("hashchange", locationHandler);
  // call the urlLocationHandler to load the page
  locationHandler();
};

const init = () => {
  initFirstScrollListener();
  initObserveElements();
  initTogglerListener();
  initColorSchemeToggler();
  initLinksCloseNav();
  initLinksClicked();
  initAppInstallation();
  initNavPosition();
  initCloseSubNav();
  initParallax();
  initForm();
  initRouting();
  initMaps();
};

document.addEventListener("DOMContentLoaded", init);