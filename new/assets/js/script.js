// JS TO USE THE MENU AS A SINGLE PAGE WITH SCROLL
const linkClickedHandler = evt => {
  evt.preventDefault();
  const toggler = document.getElementById('toggler'),
        mobileOnlyElm = document.querySelector('.wrapper .mobile-navbar'),
        isMobile = mobileOnlyElm.style.display !== 'none',
        timeout = ((isMobile && toggler.checked))? 400 : 10;
  let   target = evt.target;

  // Close the mobile menu
  if(isMobile && toggler.checked === true) {
    setTimeout(() => toggler.click(), 50);
  }

  if (target.nodeName !== 'A') {
    target = target.closest("a");
  }

  // Scroll to the anchor
  setTimeout(() => {
    location.hash = "";
    location.hash = target.getAttribute('href');
  }, timeout);

  const ul = target.parentNode.parentNode,
        copy = ul.cloneNode(true),
        parent = ul.parentNode;

  // Remove than add again the submenu
  if (parent.nodeName === 'LI') {
    setTimeout(() => parent.removeChild(ul), 100);
    setTimeout(() => {
      parent.appendChild(copy);
      initLinksCloseNav();
    }, 1000);
  }
};

// don't scroll body if the mobile menu is visible
const toggleHandler = () => {
  if(toggler.checked === true) {
    document.documentElement.classList.add('no-scroll-mobile');
  } else {
    document.documentElement.classList.remove('no-scroll-mobile');
  }
};

// Animate the desktop navbar with Intersection observer
const containerObserverCallback = (entries, observer) => {
  entries.forEach(entry => {
    const container = document.querySelector(".container");
    if(entry.isIntersecting) {
      container.classList.add('banner-intersecting');
    } else {
      container.classList.remove('banner-intersecting');
    }
  });
};

let throttleTimer;
const throttle = (callback, time) => {
  if (throttleTimer) return;
  throttleTimer = true;
  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
};

// Animate the desktop navbar
const parallax = () => {
  const pos = window.scrollY,
        banner = document.querySelector("#banner");

  // Don't calculate if the banner isn't above the fold
  if (pos <= banner.offsetHeight) {
    const scale = 1 + (pos / (banner.offsetHeight * 10)),
          bg = document.querySelector("#banner .bg"),
          mg = document.querySelector("#banner .mg"),
          fg = document.querySelector("#banner .fg");

    bg.style.backgroundImage = 'url("https://ik.imagekit.io/sarahdionne/hero/webp/20201024_143714_new_bg_ezVy20HPB.webp")';
    mg.style.backgroundImage = 'url("https://ik.imagekit.io/sarahdionne/hero/webp/20201024_143714_new_mg_yX994Z_js.webp")';
    fg.style.backgroundImage = 'url("https://ik.imagekit.io/sarahdionne/hero/webp/20201024_143714_new_fg_bYPFaTtl2.webp")';

    bg.style.top = `${pos*0.4}px`;
    bg.style.transform = `scale(${scale})`;
    mg.style.top = `${pos*0.3}px`;
    mg.style.transform = `scale(${scale})`;
    fg.style.top = `${pos*0.25}px`;
  }
};

const initLinksCloseNav = () => {
  Array.from(
    document.querySelectorAll("a[href*='#']:not([href='#'])")
  ).forEach((link) => {
    link.removeEventListener('click', linkClickedHandler);
    link.addEventListener('click', linkClickedHandler);
  });
}

// Add first class
const toggleClass = (elm, classes, force) => {
  if(force) {
    elm.classList.remove(...classes);
    elm.classList.add(force);
  } else {
    if (elm.classList.contains(classes[0])) {
      elm.classList.replace(...classes)
    } else if(elm.classList.contains(classes[1])) {
      [classes[0], classes[1]] = [classes[1], classes[0]];
      elm.classList.replace(...classes);
    } else {
      elm.classList.add(classes[0]);
    }
  }
};



const initCloseSubNav = () => {
  document.querySelectorAll("li.submenu").forEach((item) => {
    item.addEventListener('click', (evt) => {
      setTimeout(() => toggleClass(item, ['open', 'closed']), 0);
    });
    item.addEventListener('mouseenter', (evt) => {
      // on mobile, timeout to trigger hover after click ;)
      setTimeout(() => toggleClass(item, ['open', 'closed'], 'open'), 100);
    });
    /* Doesn't work on mobile
    item.addEventListener('mousemove', (evt) => {
      throttle(() => {
        toggleClass(item, ['open', 'closed'], 'open');
      }, 1000);
    });
    */
  });
};
const init = () => {
  initLinksCloseNav();
  initCloseSubNav();
  document.getElementById('toggler').addEventListener('click', toggleHandler);
  const observer = new IntersectionObserver(containerObserverCallback);
  observer.observe(document.querySelector('#banner'));
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("scroll", () => {
  throttle(parallax, 1000/48);
});
