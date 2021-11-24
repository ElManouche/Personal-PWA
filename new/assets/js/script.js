// JS TO USE THE MENU AS A SINGLE PAGE WITH SCROLL
function subnavClickHandler(e) {
  const toggler = document.getElementById('toggler');
  if(toggler.checked === true) {
    setTimeout(() => toggler.click(), 50);
  }

  if (e.target.parentNode.parentNode.parentNode) {
    const ul = e.target.parentNode.parentNode,
          copy = ul.cloneNode(true),
          parent = ul.parentNode;

    if (parent.nodeName !== 'NAV') {
      setTimeout(() => parent.removeChild(ul), 100);
      setTimeout(() => {
        parent.appendChild(copy);
        initLinksCloseNav();
      }, 1000);
    }
  }
}
function initLinksCloseNav() {
  document.querySelectorAll("nav ul li a").forEach((anchor) => {
    anchor.removeEventListener('click', subnavClickHandler);
    anchor.addEventListener('click', subnavClickHandler);
  });
}
document.addEventListener("DOMContentLoaded", function(event) {
  initLinksCloseNav();
});
