// JS TO USE THE MENU AS A SINGLE PAGE WITH SCROLL
function subnavClickHandler(e) {
  const toggler = document.getElementById('toggler');
  if(toggler.checked === true) {
    setTimeout(() => toggler.click(), 10);
  }

  const submenu = e.target.closest('.submenu');
  if(!!submenu) {
    setTimeout(() => submenu.classList.add('closed'), 100);
    setTimeout(() => submenu.classList.remove('closed'), 1000);   
  }
}
function initLinksCloseNav() {  
  document.querySelectorAll("a[href*='#'], li.submenu > span").forEach((anchor) => {
    anchor.addEventListener('click', subnavClickHandler);
  });
}

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

document.addEventListener("DOMContentLoaded", function(event) { 
  initLinksCloseNav();
  initMaps();
});