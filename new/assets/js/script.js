function clickHandler(e) {
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
  document.querySelectorAll("nav ul li a").forEach((anchor) => {
    anchor.removeEventListener('click', clickHandler);
    anchor.addEventListener('click', clickHandler);
  });
}
document.addEventListener("DOMContentLoaded", function(event) {
  linksCloseNav();
});
