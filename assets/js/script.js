// Underscore throttle function
const throttle = (func, wait, options) => {
  let timeout, context, args, result,
      previous = 0;
  if (!options) options = {};

  const later = () => {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  const throttled = function() {
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

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };
  return throttled;
};

// JS TO USE THE MENU AS A SINGLE PAGE WITH SCROLL
const linkToAnchorClickedHandler = evt => {
  evt.preventDefault();
  const toggler = document.getElementById('toggler');
  let   target = evt.target;

  // Close the mobile menu
  if (!!toggler.checked) {
    setTimeout(() => toggler.click(), 10);
  }

  if (target.nodeName !== 'A') {
    target = target.closest("a");
  }

  // Scroll to the anchor
  setTimeout(() => {
    location.hash = "";
    location.hash = target.getAttribute('href');
  }, !!toggler.checked? 400 : 10);

  const submenu = target.closest('li.submenu');
  if(!!submenu) {
    setTimeout(() => submenu.classList.add('closed'), 100);
    setTimeout(() => submenu.classList.remove('closed'), 1000);
  }
};

// don't scroll body if the mobile menu is visible
const togglerClickedHandler = checked => {
  if(checked === true) {
    document.documentElement.classList.add('no-scroll');
  } else {
    document.documentElement.classList.remove('no-scroll');
  }
};

// Animate the desktop navbar
const parallax = () => {
  const pos = window.scrollY,
        banner = document.querySelector("#banner");

  // Don't calculate if the banner isn't above the fold
  if (!!banner && pos <= banner.offsetHeight) {
    const scale = (pos / (banner.offsetHeight * 10)),
          bg = document.querySelector("#banner .bg"),
          mg = document.querySelector("#banner .mg"),
          fg = document.querySelector("#banner .fg");

    bg.style.top = `${pos*0.4}px`;
    bg.style.transform = `scale(${1 + scale})`;
    mg.style.top = `${pos*0.3}px`;
    mg.style.transform = `scale(${1 + (scale * 0.65)})`;
    fg.style.top = `${pos*0.25}px`;
  }
};

const initLinksCloseNav = () => {
  document
    .querySelectorAll("a[href*='#']:not([href='#'])")
    .forEach(
    (link) => link.addEventListener('click', linkToAnchorClickedHandler)
  );
}

const initCloseSubNav = () => {
  document.querySelectorAll("li.submenu").forEach(item => {
    const throttledReopenSubmenu = throttle(() => item.classList.remove('closed'), 1000, { leading: false });
    item.addEventListener('click', () => {
      item.classList.toggle('closed');
      throttledReopenSubmenu.cancel();
    });
    item.addEventListener('mouseenter', () => {
      // on mobile, timeout to trigger hover after click ;)
      setTimeout(() => item.classList.remove('closed'), 100);
    });
    item.addEventListener("mousemove", throttledReopenSubmenu);
  });
};

const initObserveElements = () => {
  const elements = [].slice.call(document.querySelectorAll(".observable"));
  const observablesObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        const dataset = entry.target.dataset;
        for (const record in dataset) {
          if (dataset[record]) {
            entry.target.setAttribute(record, dataset[record]);
            entry.target.removeAttribute(`data-${record}`);
          }
        }
        observablesObserver.unobserve(entry.target);
      }
    });
  });
  elements.forEach(element => {
    observablesObserver.observe(element);
  });
};

const initNavPosition = () => {
  const banner = document.getElementById('banner');
  const bannerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const container = document.querySelector(".container");
      if(entry.isIntersecting) {
        container.classList.add('banner-intersecting');
      } else {
        container.classList.remove('banner-intersecting');
      }
    });
  });
  if(!!banner) {
    bannerObserver.observe(banner);
  } else {
    const container = document.querySelector(".container");
    container.classList.remove('banner-intersecting');
  }
};

const initMaps = () => {
  document.querySelectorAll('div.map').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.add('interact');
      const iframe = item.querySelector('iframe');
      iframe.src = iframe.getAttribute('data-src');
      iframe.removeAttribute('data-src');
    });
  });
};

const init = () => {
  initObserveElements();
  initLinksCloseNav();
  initNavPosition();
  initCloseSubNav();
  initMaps();

  const toggler = document.getElementById('toggler');
  toggler.addEventListener('click', () => togglerClickedHandler(toggler.checked) );
  document.addEventListener("scroll", throttle(() => parallax(), 1000/48));
}

document.addEventListener("DOMContentLoaded", init);
