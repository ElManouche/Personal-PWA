document.addEventListener("DOMContentLoaded", function(event) { 
  const togglerEl = document.getElementById('toggler');
  document.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener('click', () => {
      togglerEl.click();
    });
  });
});