// JS TO USE THE MENU AS A SINGLE PAGE WITH SCROLL
function subnavClickHandler(e) {
  document.getElementById('toggler').checked = false;

  if (e.target.parentNode.parentNode.parentNode) {
    let ul = e.target.parentNode.parentNode;
    let copy = ul.cloneNode(true);
    let parent = ul.parentNode;

    if (parent.nodeName !== 'NAV') {
      setTimeout(() => {
        parent.removeChild(ul);
      }, 100);

      setTimeout(() => {
        parent.appendChild(copy);
        linksCloseNav();
      }, 1000);
    }
  }
}
function linksCloseNav() {
  document.querySelectorAll("nav ul li a").forEach((anchor) => {
    anchor.removeEventListener('click', subnavClickHandler);
    anchor.addEventListener('click', subnavClickHandler);
  });
}
document.addEventListener("DOMContentLoaded", function(event) {
  linksCloseNav();
});
