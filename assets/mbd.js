function makeVisible() {
  document.querySelector(".course").classList.add("visible");
}

window.onload = function () {
  window.setTimeout(makeVisible, 500);
};
