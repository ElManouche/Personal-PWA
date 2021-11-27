// JS TO USE THE MENU AS A SINGLE PAGE WITH SCROLL
function linkClickedHandler(e) {
  e.preventDefault();
  const toggler = document.getElementById('toggler'),
        mobileOnlyElm = document.querySelector('.wrapper .mobile-navbar'),
        isMobile = mobileOnlyElm.computedStyleMap().get('display').value === 'block',
        timeout = ((isMobile && toggler.checked))? 300 : 10;
  let   target = e.target;

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

}

function toggleHandler() {
  if(toggler.checked === true) {
    document.documentElement.classList.add('no-scroll');
  } else {
    document.documentElement.classList.remove('no-scroll');
  }
}
function initLinksCloseNav() {
    Array.from(document.querySelectorAll("a[href*='#']:not([href='#'])")).filter((link) => link.getAttribute('href').startsWith('#')).forEach((link) => {
    link.removeEventListener('click', linkClickedHandler);
    link.addEventListener('click', linkClickedHandler);
  });
}
function init() {
  initLinksCloseNav();
  document.getElementById('toggler').addEventListener('click', toggleHandler);
}

document.addEventListener("DOMContentLoaded", function(event) {
  init();
});

// Animate the desktop navbar
document.addEventListener("scroll", evt => {
  const pos = window.scrollY; //evt.target.scrollTop;
  const container = document.querySelector(".container");
  if((pos) > 500) {
    container.classList.remove('up');
  } else if((pos) > 0) {
    container.classList.remove('top');
    container.classList.add('up');
  } else { // === 0
    container.classList.add('top');
    container.classList.remove('up');
  }
});
