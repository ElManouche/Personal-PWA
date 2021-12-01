// JS TO USE THE MENU AS A SINGLE PAGE WITH SCROLL
const linkClickedHandler = evt => {
  evt.preventDefault();
  const toggler = document.getElementById('toggler'),
        mobileOnlyElm = document.querySelector('.wrapper .mobile-navbar'),
        isMobile = mobileOnlyElm.computedStyleMap().get('display').value === 'block',
        timeout = ((isMobile && toggler.checked))? 300 : 10;
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

// Animate the desktop navbar
const parallax = () => {
  const pos = window.scrollY,
        banner = document.querySelector("#banner"),
        bannerHeight = banner.offsetHeight,
        background = document.querySelector("#banner .bg"),
        middleground = document.querySelector("#banner .mg"),
        foreground = document.querySelector("#banner .fg");

  background.style.top = +(pos*0.75)+'px';
  background.style.transform = `scale(${1+(pos/bannerHeight/4)})`;
  middleground.style.top = +(pos*0.3)+'px';
  middleground.style.transform = `scale(${1+(pos/bannerHeight/4)})`;
  foreground.style.top = +(pos*0.25)+'px';
};

const initLinksCloseNav = () => {
  Array.from(
    document.querySelectorAll("a[href*='#']:not([href='#'])")
  ).filter(
    (link) => link.getAttribute('href').startsWith('#')
  ).forEach((link) => {
    link.removeEventListener('click', linkClickedHandler);
    link.addEventListener('click', linkClickedHandler);
  });
}

const init = () => {
  initLinksCloseNav();
  document.getElementById('toggler').addEventListener('click', toggleHandler);
  const observer = new IntersectionObserver(containerObserverCallback);
  observer.observe(document.querySelector('#banner'));
}

document.addEventListener("DOMContentLoaded", evt => {
  init();
});
document.addEventListener("scroll", evt => {
  parallax();
});
