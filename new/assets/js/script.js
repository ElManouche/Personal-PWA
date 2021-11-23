function subnavClickHandler(e) {
  const togglerEl = document.getElementById('toggler');
  const submenus = document.querySelectorAll("nav ul li ul");

  togglerEl.checked = false;
  submenus.forEach((submenu) => {
    let copy = submenu.cloneNode(true);
    let parent;

    if (submenu.parentNode) {
      parent = submenu.parentNode;
      parent.removeChild(submenu);
      setTimeout(() => {
        parent.appendChild(copy);
        linksCloseNav();
      }, 1000);
    }
  });
}
function linksCloseNav() {
  document.querySelectorAll("nav ul li ul li a").forEach((anchor) => {
    anchor.removeEventListener('click', subnavClickHandler);
    anchor.addEventListener('click', subnavClickHandler);
  });
}
document.addEventListener("DOMContentLoaded", function(event) {
  linksCloseNav();
});
